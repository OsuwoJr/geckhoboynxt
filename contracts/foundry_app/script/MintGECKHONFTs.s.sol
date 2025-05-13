// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GECKHONFT.sol";

contract MintGECKHONFTs is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get the deployed contract
        GECKHONFT nft = GECKHONFT(0x5FbDB2315678afecb367f032d93F642f64180aa3);

        // Mint Genesis Pass
        string memory genesisURI = "ipfs://QmGenesisPassMetadata";
        nft.mintNFT{value: 0.05 ether}(genesisURI);

        // Mint Exodus Pass
        string memory exodusURI = "ipfs://QmExodusPassMetadata";
        nft.mintNFT{value: 0.08 ether}(exodusURI);

        // Mint Revelation Pass
        string memory revelationURI = "ipfs://QmRevelationPassMetadata";
        nft.mintNFT{value: 0.2 ether}(revelationURI);

        vm.stopBroadcast();
    }
} 