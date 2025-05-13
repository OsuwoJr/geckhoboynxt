// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GECKHONFT.sol";

contract DeployGECKHONFT is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the NFT contract
        GECKHONFT nft = new GECKHONFT(
            "GECKHO NFT",           // name
            "GECKHO",              // symbol
            0.01 ether,            // mint price
            msg.sender,            // royalty receiver
            500                    // royalty fee numerator (5%)
        );

        // Enable public minting
        nft.setPublicMinting(true);

        vm.stopBroadcast();
    }
} 