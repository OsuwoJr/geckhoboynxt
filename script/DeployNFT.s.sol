// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/NFT.sol";

contract DeployNFT is Script {
    function run() public returns (NFT) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NFT nft = new NFT(
            "Lisk NFT Collection", // name
            "LSKNFT",             // symbol
            "ipfs://",            // baseTokenURI
            0.01 ether            // mintingPrice
        );

        vm.stopBroadcast();
        return nft;
    }
} 