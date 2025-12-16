// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EncryptedDutchAuctionHook} from "../src/EncryptedDutchAuctionHook.sol";

/**
 * @title DeployScript
 * @dev Deployment script for the Encrypted Dutch Auction Hook
 */
contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the hook contract
        EncryptedDutchAuctionHook hook = new EncryptedDutchAuctionHook();
        
        console.log("EncryptedDutchAuctionHook deployed to:", address(hook));
        
        vm.stopBroadcast();
    }
}
