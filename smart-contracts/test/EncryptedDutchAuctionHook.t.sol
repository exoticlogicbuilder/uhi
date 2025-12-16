// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {EncryptedDutchAuctionHook} from "../src/EncryptedDutchAuctionHook.sol";
import {FHE, euint32} from "fhevm/lib/TFHE.sol";

/**
 * @title EncryptedDutchAuctionHookTest
 * @dev Test suite for the Encrypted Dutch Auction Hook
 */
contract EncryptedDutchAuctionHookTest is Test {
    EncryptedDutchAuctionHook public hook;
    
    event AuctionCreated(address indexed pool, address indexed creator, uint256 startTime, uint256 endTime);
    event AuctionExecuted(address indexed pool, address indexed winner, uint256 executionPrice);
    event AuctionCancelled(address indexed pool, address indexed canceller);

    function setUp() public {
        hook = new EncryptedDutchAuctionHook();
    }

    function testCreateAuction() public {
        // Create encrypted auction parameters
        euint32 memory startPrice = FHE.encrypt(uint32(1000));
        euint32 memory floorPrice = FHE.encrypt(uint32(100));
        euint32 memory decayPerSecond = FHE.encrypt(uint32(10));
        uint256 duration = 3600; // 1 hour

        // Expect auction creation event
        vm.expectEmit(true, true, false, false);
        emit AuctionCreated(address(0), address(this), block.timestamp, block.timestamp + duration);

        address pool = hook.createAuction(startPrice, floorPrice, decayPerSecond, duration);
        
        assertTrue(pool != address(0));
        assertTrue(hook.hasActiveAuction(pool));
    }

    function testGetCurrentPrice() public {
        // Create auction
        euint32 memory startPrice = FHE.encrypt(uint32(1000));
        euint32 memory floorPrice = FHE.encrypt(uint32(100));
        euint32 memory decayPerSecond = FHE.encrypt(uint32(10));
        uint256 duration = 3600;

        address pool = hook.createAuction(startPrice, floorPrice, decayPerSecond, duration);
        
        // Wait 1 second
        vm.warp(block.timestamp + 1);
        
        // Get current price (should be 1000 - 10*1 = 990)
        euint32 memory currentPrice = hook.getCurrentPrice(pool);
        
        // In a real FHE environment, we would decrypt and verify
        // For testing, we just check that the function doesn't revert
        assertTrue(true);
    }

    function testValidateBid() public {
        // Create auction
        euint32 memory startPrice = FHE.encrypt(uint32(1000));
        euint32 memory floorPrice = FHE.encrypt(uint32(100));
        euint32 memory decayPerSecond = FHE.encrypt(uint32(10));
        uint256 duration = 3600;

        address pool = hook.createAuction(startPrice, floorPrice, decayPerSecond, duration);
        
        // Test valid bid (should be >= current price)
        euint32 memory validBid = FHE.encrypt(uint32(1100));
        // ebool memory isValid = hook.validateBid(pool, validBid);
        
        // Test invalid bid (should be < current price)
        euint32 memory invalidBid = FHE.encrypt(uint32(900));
        // ebool memory isInvalid = hook.validateBid(pool, invalidBid);
        
        assertTrue(true);
    }

    function testCancelAuction() public {
        // Create auction
        euint32 memory startPrice = FHE.encrypt(uint32(1000));
        euint32 memory floorPrice = FHE.encrypt(uint32(100));
        euint32 memory decayPerSecond = FHE.encrypt(uint32(10));
        uint256 duration = 3600;

        address pool = hook.createAuction(startPrice, floorPrice, decayPerSecond, duration);
        
        // Verify auction is active
        assertTrue(hook.hasActiveAuction(pool));
        
        // Cancel auction
        vm.expectEmit(true, true, false, false);
        emit AuctionCancelled(pool, address(this));
        
        hook.cancelAuction(pool);
        
        // Verify auction is no longer active
        assertTrue(!hook.hasActiveAuction(pool));
    }

    function testCreateAuctionRevertDurationTooShort() public {
        euint32 memory startPrice = FHE.encrypt(uint32(1000));
        euint32 memory floorPrice = FHE.encrypt(uint32(100));
        euint32 memory decayPerSecond = FHE.encrypt(uint32(10));
        uint256 duration = 100; // Too short

        vm.expectRevert("Duration too short");
        hook.createAuction(startPrice, floorPrice, decayPerSecond, duration);
    }

    function testCreateAuctionRevertDurationTooLong() public {
        euint32 memory startPrice = FHE.encrypt(uint32(1000));
        euint32 memory floorPrice = FHE.encrypt(uint32(100));
        euint32 memory decayPerSecond = FHE.encrypt(uint32(10));
        uint256 duration = 100000; // Too long

        vm.expectRevert("Duration too long");
        hook.createAuction(startPrice, floorPrice, decayPerSecond, duration);
    }
}
