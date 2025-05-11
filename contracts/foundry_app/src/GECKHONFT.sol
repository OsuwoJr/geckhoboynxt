// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/structs/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GECKHONFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, AccessControl, ERC2981, ReentrancyGuard {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    Counters.Counter private _tokenIdCounter;
    uint256 public mintPrice;
    bool public isPublicMintingEnabled;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintingCooldown;
    mapping(address => uint256) public mintingCount;
    
    uint256 public constant MAX_MINTS_PER_ADDRESS = 5;
    uint256 public constant MINTING_COOLDOWN = 1 hours;
    uint256 public constant MAX_MINTS_PER_TX = 3;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event WhitelistUpdated(address indexed account, bool status);
    event PriceUpdated(uint256 newPrice);
    event RoyaltyUpdated(uint96 newRoyalty);
    event MintingStatusChanged(bool isPublic);
    event MintingCooldownUpdated(uint256 newCooldown);
    event MaxMintsPerAddressUpdated(uint256 newMax);
    event MaxMintsPerTxUpdated(uint256 newMax);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _mintPrice,
        address _royaltyReceiver,
        uint96 _royaltyFeeNumerator
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        mintPrice = _mintPrice;
        isPublicMintingEnabled = false;
        
        _setDefaultRoyalty(_royaltyReceiver, _royaltyFeeNumerator);
    }

    modifier whenNotInCooldown() {
        require(
            block.timestamp >= mintingCooldown[msg.sender],
            "Minting cooldown active"
        );
        _;
    }

    modifier withinMintLimit(uint256 amount) {
        require(
            mintingCount[msg.sender] + amount <= MAX_MINTS_PER_ADDRESS,
            "Exceeds max mints per address"
        );
        require(
            amount <= MAX_MINTS_PER_TX,
            "Exceeds max mints per transaction"
        );
        _;
    }

    function mintNFT(string memory tokenURI) public payable nonReentrant whenNotPaused whenNotInCooldown withinMintLimit(1) {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(isPublicMintingEnabled || whitelist[msg.sender], "Not whitelisted or public minting disabled");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        mintingCooldown[msg.sender] = block.timestamp + MINTING_COOLDOWN;
        mintingCount[msg.sender] += 1;

        emit NFTMinted(msg.sender, tokenId, tokenURI);
    }

    function batchMintNFT(string[] memory tokenURIs) public payable nonReentrant whenNotPaused whenNotInCooldown withinMintLimit(tokenURIs.length) {
        require(msg.value >= mintPrice * tokenURIs.length, "Insufficient payment");
        require(isPublicMintingEnabled || whitelist[msg.sender], "Not whitelisted or public minting disabled");

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            emit NFTMinted(msg.sender, tokenId, tokenURIs[i]);
        }

        mintingCooldown[msg.sender] = block.timestamp + MINTING_COOLDOWN;
        mintingCount[msg.sender] += tokenURIs.length;
    }

    function addToWhitelist(address account) public onlyRole(ADMIN_ROLE) {
        whitelist[account] = true;
        emit WhitelistUpdated(account, true);
    }

    function removeFromWhitelist(address account) public onlyRole(ADMIN_ROLE) {
        whitelist[account] = false;
        emit WhitelistUpdated(account, false);
    }

    function setMintPrice(uint256 newPrice) public onlyRole(ADMIN_ROLE) {
        require(newPrice > 0, "Price must be greater than 0");
        mintPrice = newPrice;
        emit PriceUpdated(newPrice);
    }

    function setPublicMinting(bool enabled) public onlyRole(ADMIN_ROLE) {
        isPublicMintingEnabled = enabled;
        emit MintingStatusChanged(enabled);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public onlyRole(ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeNumerator);
        emit RoyaltyUpdated(feeNumerator);
    }

    function setMintingCooldown(uint256 newCooldown) public onlyRole(ADMIN_ROLE) {
        require(newCooldown > 0, "Cooldown must be greater than 0");
        MINTING_COOLDOWN = newCooldown;
        emit MintingCooldownUpdated(newCooldown);
    }

    function setMaxMintsPerAddress(uint256 newMax) public onlyRole(ADMIN_ROLE) {
        require(newMax > 0, "Max mints must be greater than 0");
        MAX_MINTS_PER_ADDRESS = newMax;
        emit MaxMintsPerAddressUpdated(newMax);
    }

    function setMaxMintsPerTx(uint256 newMax) public onlyRole(ADMIN_ROLE) {
        require(newMax > 0, "Max mints per tx must be greater than 0");
        MAX_MINTS_PER_TX = newMax;
        emit MaxMintsPerTxUpdated(newMax);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function withdraw() public onlyRole(ADMIN_ROLE) nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // The following functions are overrides required by Solidity
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 