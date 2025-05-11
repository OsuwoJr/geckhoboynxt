// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GECKHONFT.sol";

contract GECKHONFTTest is Test {
    GECKHONFT public nft;
    address public owner;
    address public user1;
    address public user2;
    uint256 public constant TOKEN_ID = 1;
    string public constant TOKEN_URI = "ipfs://test-uri";
    uint256 public constant WHITELIST_PRICE = 0.1 ether;
    uint256 public constant PUBLIC_PRICE = 0.2 ether;
    uint256 public constant MAX_SUPPLY = 100;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event WhitelistUpdated(uint256 indexed tokenId, address[] addresses);
    event MintingStatusChanged(uint256 indexed tokenId, bool enabled);
    event PriceUpdated(uint256 indexed tokenId, uint256 whitelistPrice, uint256 publicPrice);
    event RoyaltyUpdated(uint256 indexed tokenId, uint256 bps);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        nft = new GECKHONFT();
        
        // Setup initial state
        nft.setPrices(TOKEN_ID, WHITELIST_PRICE, PUBLIC_PRICE);
        nft.setMaxSupply(TOKEN_ID, MAX_SUPPLY);
        nft.setMintingStatus(TOKEN_ID, true);
        
        // Add user1 to whitelist
        address[] memory whitelist = new address[](1);
        whitelist[0] = user1;
        nft.setWhitelist(TOKEN_ID, whitelist);
        
        // Fund users
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
    }

    function test_InitialState() public {
        assertEq(nft.getMaxSupply(TOKEN_ID), MAX_SUPPLY);
        assertEq(nft.getCurrentSupply(TOKEN_ID), 0);
        assertTrue(nft.isWhitelisted(TOKEN_ID, user1));
        assertFalse(nft.isWhitelisted(TOKEN_ID, user2));
    }

    function test_WhitelistMint() public {
        vm.startPrank(user1);
        uint256 initialBalance = user1.balance;
        
        vm.expectEmit(true, true, true, true);
        emit NFTMinted(user1, 0, TOKEN_URI);
        
        nft.mint{value: WHITELIST_PRICE}(TOKEN_ID, TOKEN_URI);
        
        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.getCurrentSupply(TOKEN_ID), 1);
        assertEq(user1.balance, initialBalance - WHITELIST_PRICE);
        vm.stopPrank();
    }

    function test_PublicMint() public {
        vm.startPrank(user2);
        uint256 initialBalance = user2.balance;
        
        vm.expectEmit(true, true, true, true);
        emit NFTMinted(user2, 0, TOKEN_URI);
        
        nft.mint{value: PUBLIC_PRICE}(TOKEN_ID, TOKEN_URI);
        
        assertEq(nft.ownerOf(0), user2);
        assertEq(nft.getCurrentSupply(TOKEN_ID), 1);
        assertEq(user2.balance, initialBalance - PUBLIC_PRICE);
        vm.stopPrank();
    }

    function testFail_MintInsufficientPayment() public {
        vm.startPrank(user1);
        nft.mint{value: WHITELIST_PRICE - 0.01 ether}(TOKEN_ID, TOKEN_URI);
        vm.stopPrank();
    }

    function testFail_MintNotWhitelisted() public {
        vm.startPrank(user2);
        nft.mint{value: WHITELIST_PRICE}(TOKEN_ID, TOKEN_URI);
        vm.stopPrank();
    }

    function testFail_MintMaxSupplyReached() public {
        // Set max supply to 1
        nft.setMaxSupply(TOKEN_ID, 1);
        
        // First mint
        vm.startPrank(user1);
        nft.mint{value: WHITELIST_PRICE}(TOKEN_ID, TOKEN_URI);
        
        // Second mint should fail
        nft.mint{value: WHITELIST_PRICE}(TOKEN_ID, TOKEN_URI);
        vm.stopPrank();
    }

    function testFail_MintMintingDisabled() public {
        nft.setMintingStatus(TOKEN_ID, false);
        
        vm.startPrank(user1);
        nft.mint{value: WHITELIST_PRICE}(TOKEN_ID, TOKEN_URI);
        vm.stopPrank();
    }

    function test_UpdateWhitelist() public {
        address[] memory newWhitelist = new address[](2);
        newWhitelist[0] = user1;
        newWhitelist[1] = user2;
        
        vm.expectEmit(true, true, true, true);
        emit WhitelistUpdated(TOKEN_ID, newWhitelist);
        
        nft.setWhitelist(TOKEN_ID, newWhitelist);
        
        assertTrue(nft.isWhitelisted(TOKEN_ID, user1));
        assertTrue(nft.isWhitelisted(TOKEN_ID, user2));
    }

    function test_UpdatePrices() public {
        uint256 newWhitelistPrice = 0.15 ether;
        uint256 newPublicPrice = 0.25 ether;
        
        vm.expectEmit(true, true, true, true);
        emit PriceUpdated(TOKEN_ID, newWhitelistPrice, newPublicPrice);
        
        nft.setPrices(TOKEN_ID, newWhitelistPrice, newPublicPrice);
        
        assertEq(nft.getPrice(TOKEN_ID), newWhitelistPrice);
    }

    function test_UpdateRoyalty() public {
        uint256 newRoyalty = 500; // 5%
        
        vm.expectEmit(true, true, true, true);
        emit RoyaltyUpdated(TOKEN_ID, newRoyalty);
        
        nft.setRoyalty(TOKEN_ID, newRoyalty);
        
        assertEq(nft.getRoyalty(TOKEN_ID), newRoyalty);
    }

    function testFail_UpdateRoyaltyTooHigh() public {
        nft.setRoyalty(TOKEN_ID, 10001); // Should fail as max is 10000 (100%)
    }

    function test_Withdraw() public {
        // Mint an NFT to add funds to contract
        vm.startPrank(user1);
        nft.mint{value: WHITELIST_PRICE}(TOKEN_ID, TOKEN_URI);
        vm.stopPrank();
        
        uint256 initialBalance = owner.balance;
        uint256 contractBalance = address(nft).balance;
        
        nft.withdraw();
        
        assertEq(address(nft).balance, 0);
        assertEq(owner.balance, initialBalance + contractBalance);
    }

    function testFail_WithdrawNotOwner() public {
        vm.startPrank(user1);
        nft.withdraw();
        vm.stopPrank();
    }
} 