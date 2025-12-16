// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {euint32, ebool} from "fhevm/lib/TFHE.sol";

/**
 * @title IEncryptedDutchAuctionHook
 * @dev Interface for the Encrypted Dutch Auction Hook
 */
interface IEncryptedDutchAuctionHook {
    // Auction state structure
    struct Auction {
        euint32 startPrice;      // Encrypted starting price
        euint32 floorPrice;      // Encrypted minimum floor price
        euint32 decayPerSecond;  // Encrypted price decay rate per second
        uint256 startTime;       // Public auction start timestamp
        uint256 endTime;         // Public auction end timestamp
        bool active;             // Whether auction is active
        address creator;         // Auction creator
        bytes encryptedData;     // Additional encrypted parameters
    }

    // Events
    event AuctionCreated(address indexed pool, address indexed creator, uint256 startTime, uint256 endTime);
    event BidPlaced(address indexed pool, address indexed bidder, bytes encryptedBid);
    event AuctionExecuted(address indexed pool, address indexed winner, uint256 executionPrice);
    event AuctionCancelled(address indexed pool, address indexed canceller);

    // Functions
    function createAuction(
        euint32 memory startPrice,
        euint32 memory floorPrice,
        euint32 memory decayPerSecond,
        uint256 duration
    ) external returns (address pool);

    function getCurrentPrice(address pool) external view returns (euint32 memory);
    
    function validateBid(address pool, euint32 memory encryptedBid) external view returns (ebool memory);
    
    function getAuction(address pool) external view returns (Auction memory);
    
    function hasActiveAuction(address pool) external view returns (bool);
    
    function cancelAuction(address pool) external;
    
    function revealAuctionParams(address pool) external;
}
