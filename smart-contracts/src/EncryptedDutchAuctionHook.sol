// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolSwapTest} from "@uniswap/v4-core/src/test/PoolSwapTest.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Import FHE lib
import {FHE, euint32, ebool} from "fhevm/lib/TFHE.sol";

/**
 * @title EncryptedDutchAuctionHook
 * @dev A Uniswap v4 hook that enables confidential Dutch auctions using FHE
 * 
 * Features:
 * - Encrypted auction parameters (start price, floor price, decay rate)
 * - Homomorphic price calculation: currentPrice = startPrice - (decayRate * timeElapsed)
 * - FHE-based bid comparison and conditional execution
 * - Anti-sniping protection through hidden price curve
 */
contract EncryptedDutchAuctionHook is IHooks, ReentrancyGuard, Ownable {
    using FHE for euint32;
    using FHE for ebool;

    // Auction state structure
    struct Auction {
        euint32 startPrice;      // Encrypted starting price
        euint32 floorPrice;      // Encrypted minimum floor price
        euint32 decayPerSecond;  // Encrypted price decay per second
        uint256 startTime;       // Public auction start timestamp
        uint256 endTime;         // Public auction end timestamp
        bool active;             // Whether auction is active
        address creator;         // Auction creator
        bytes encryptedData;     // Additional encrypted parameters
    }

    // Storage for auctions
    mapping(address pool => Auction) public auctions;
    mapping(address user => uint256) public userAuctionWins;
    
    // Events
    event AuctionCreated(address indexed pool, address indexed creator, uint256 startTime, uint256 endTime);
    event BidPlaced(address indexed pool, address indexed bidder, bytes encryptedBid);
    event AuctionExecuted(address indexed pool, address indexed winner, uint256 executionPrice);
    event AuctionCancelled(address indexed pool, address indexed canceller);

    // Constants
    uint256 public constant MIN_AUCTION_DURATION = 300; // 5 minutes
    uint256 public constant MAX_AUCTION_DURATION = 86400; // 24 hours
    
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new encrypted Dutch auction
     * @param startPrice Encrypted starting price
     * @param floorPrice Encrypted minimum floor price  
     * @param decayPerSecond Encrypted price decay rate per second
     * @param duration Auction duration in seconds
     */
    function createAuction(
        euint32 memory startPrice,
        euint32 memory floorPrice,
        euint32 memory decayPerSecond,
        uint256 duration
    ) external returns (address pool) {
        require(duration >= MIN_AUCTION_DURATION, "Duration too short");
        require(duration <= MAX_AUCTION_DURATION, "Duration too long");
        
        // For demo purposes, create a mock pool address
        // In production, this would be the actual Uniswap v4 pool
        pool = address(bytes20(uint160(uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp))))));
        
        Auction memory newAuction = Auction({
            startPrice: startPrice,
            floorPrice: floorPrice,
            decayPerSecond: decayPerSecond,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            active: true,
            creator: msg.sender,
            encryptedData: bytes("")
        });
        
        auctions[pool] = newAuction;
        
        emit AuctionCreated(pool, msg.sender, newAuction.startTime, newAuction.endTime);
        
        return pool;
    }

    /**
     * @dev Calculate current hidden price using FHE operations
     * @param pool The pool address
     * @return currentPrice The current encrypted price
     */
    function getCurrentPrice(address pool) public view returns (euint32 memory) {
        Auction storage auction = auctions[pool];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.startTime, "Auction not started");
        require(block.timestamp <= auction.endTime, "Auction ended");
        
        // Calculate time elapsed since start
        uint256 timeElapsed = block.timestamp - auction.startTime;
        
        // Calculate total decay: decayPerSecond * timeElapsed
        euint32 memory totalDecay = auction.decayPerSecond.mul(uint32(timeElapsed));
        
        // Calculate current price: startPrice - totalDecay
        euint32 memory currentPrice = auction.startPrice.sub(totalDecay);
        
        // Ensure price doesn't go below floor
        currentPrice = FHE.max(currentPrice, auction.floorPrice);
        
        return currentPrice;
    }

    /**
     * @dev Check if a bid is valid (greater than or equal to current price)
     * @param pool The pool address
     * @param encryptedBid The encrypted bid amount
     * @return isValid Whether the bid is valid
     */
    function validateBid(address pool, euint32 memory encryptedBid) public view returns (ebool memory) {
        euint32 memory currentPrice = getCurrentPrice(pool);
        return FHE.gte(encryptedBid, currentPrice);
    }

    /**
     * @dev Execute a swap with encrypted bid validation
     * @param pool The pool key
     * @param swapData Encrypted swap data containing bid amount
     * @return BeforeSwapDelta
     */
    function beforeSwap(
        address,
        PoolKey calldata pool,
        IPoolManager.SwapParams calldata swapParams,
        bytes calldata swapData
    ) external override nonReentrant returns (BeforeSwapDelta, bytes4) {
        Auction storage auction = auctions[address(pool.token0)];
        require(auction.active, "No active auction");
        require(block.timestamp <= auction.endTime, "Auction ended");
        
        // Decrypt the bid amount from swapData
        euint32 memory encryptedBid = euint32.wrap(0);
        if (swapData.length >= 32) {
            encryptedBid = euint32.wrap(uint32(bytes4(swapData[:32])));
        }
        
        // Get current hidden price
        euint32 memory currentPrice = getCurrentPrice(address(pool.token0));
        
        // Compare bid against current price
        ebool memory validBid = FHE.gte(encryptedBid, currentPrice);
        
        // If bid is not valid, revert the swap
        require(FHE.reveal(validBid), "Bid too low");
        
        // Track winning bid
        userAuctionWins[msg.sender]++;
        auction.active = false; // End the auction
        
        // For demo purposes, return zero delta
        // In production, this would perform the actual swap
        return (BeforeSwapDeltaLibrary.ZERO_DELTA, this.beforeSwap.selector);
    }

    /**
     * @dev Reveal auction parameters after settlement (optional)
     * @param pool The pool address
     */
    function revealAuctionParams(address pool) external {
        Auction storage auction = auctions[pool];
        require(!auction.active, "Auction still active");
        require(msg.sender == auction.creator, "Only creator can reveal");
        
        // In production, this would decrypt and reveal the parameters
        // For now, just emit an event with the revealed values
        emit AuctionExecuted(pool, msg.sender, block.timestamp);
    }

    /**
     * @dev Cancel an auction
     * @param pool The pool address
     */
    function cancelAuction(address pool) external {
        Auction storage auction = auctions[pool];
        require(auction.active, "Auction not active");
        require(msg.sender == auction.creator || msg.sender == owner(), "Not authorized");
        
        auction.active = false;
        emit AuctionCancelled(pool, msg.sender);
    }

    /**
     * @dev Get auction information
     * @param pool The pool address
     * @return auction The auction struct
     */
    function getAuction(address pool) external view returns (Auction memory) {
        return auctions[pool];
    }

    /**
     * @dev Check if pool has active auction
     * @param pool The pool address
     * @return bool Whether auction is active
     */
    function hasActiveAuction(address pool) external view returns (bool) {
        Auction storage auction = auctions[pool];
        return auction.active && block.timestamp <= auction.endTime;
    }
}
