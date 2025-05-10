// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Minting price
    uint256 public mintingPrice;

    event NFTMinted(address indexed creator, uint256 indexed tokenId, string tokenURI);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI,
        uint256 _mintingPrice
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
        mintingPrice = _mintingPrice;
    }

    function mint(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= mintingPrice, "Insufficient payment");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _creators[newTokenId] = msg.sender;

        emit NFTMinted(msg.sender, newTokenId, tokenURI);
        
        return newTokenId;
    }

    function getCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _creators[tokenId];
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setMintingPrice(uint256 _newPrice) public onlyOwner {
        mintingPrice = _newPrice;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
} 