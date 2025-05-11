// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GECKHONFT.sol";

contract DeployScript is Script {
    function run() public {
        // Use the first Anvil account's private key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        GECKHONFT nft = new GECKHONFT();
        console.log("Deployed GECKHONFT to:", address(nft));

        vm.stopBroadcast();
    }
} 