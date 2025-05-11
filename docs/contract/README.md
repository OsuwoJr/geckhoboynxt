# GECKHONFT Smart Contract Documentation

## Overview
The GECKHONFT contract is an ERC721-compliant NFT contract with additional features for whitelist minting, royalty support, and supply management.

## Contract Details
- **Name**: GECKHONFT
- **Version**: 1.0.0
- **License**: MIT
- **Standard**: ERC721 with ERC2981 (Royalty) support

## Features
1. **Whitelist Minting**
   - Support for whitelisted addresses
   - Different pricing for whitelist and public minting
   - Whitelist management functions

2. **Supply Management**
   - Configurable maximum supply per token ID
   - Current supply tracking
   - Supply limit enforcement

3. **Royalty Support**
   - ERC2981 compliant royalty implementation
   - Configurable royalty percentage (in basis points)
   - Maximum royalty cap of 10%

4. **Minting Control**
   - Enable/disable minting per token ID
   - Price management for both whitelist and public minting
   - Owner-only administrative functions

## Contract Functions

### Public Functions

#### `mint(uint256 tokenId, string memory tokenURI)`
Mints a new NFT with the specified token ID and URI.
- **Parameters**:
  - `tokenId`: The ID of the token to mint
  - `tokenURI`: The URI pointing to the token's metadata
- **Requirements**:
  - Must send correct payment amount
  - Must be whitelisted if minting during whitelist period
  - Must not exceed max supply
  - Minting must be enabled
- **Events**:
  - `NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI)`

#### `isWhitelisted(uint256 tokenId, address account)`
Checks if an address is whitelisted for a specific token ID.
- **Parameters**:
  - `tokenId`: The token ID to check
  - `account`: The address to check
- **Returns**: `bool` indicating whitelist status

#### `getPrice(uint256 tokenId)`
Gets the current minting price for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to check
- **Returns**: `uint256` price in wei

#### `getMaxSupply(uint256 tokenId)`
Gets the maximum supply for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to check
- **Returns**: `uint256` maximum supply

#### `getCurrentSupply(uint256 tokenId)`
Gets the current supply for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to check
- **Returns**: `uint256` current supply

#### `getRoyalty(uint256 tokenId)`
Gets the royalty percentage for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to check
- **Returns**: `uint256` royalty in basis points

### Admin Functions

#### `setWhitelist(uint256 tokenId, address[] memory addresses)`
Sets the whitelist for a specific token ID.
- **Parameters**:
  - `tokenId`: The token ID to set whitelist for
  - `addresses`: Array of whitelisted addresses
- **Events**:
  - `WhitelistUpdated(uint256 indexed tokenId, address[] addresses)`

#### `setPrices(uint256 tokenId, uint256 whitelistPrice, uint256 publicPrice)`
Sets the minting prices for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to set prices for
  - `whitelistPrice`: Price for whitelisted addresses
  - `publicPrice`: Price for public minting
- **Events**:
  - `PriceUpdated(uint256 indexed tokenId, uint256 whitelistPrice, uint256 publicPrice)`

#### `setMaxSupply(uint256 tokenId, uint256 maxSupply)`
Sets the maximum supply for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to set max supply for
  - `maxSupply`: Maximum number of tokens that can be minted

#### `setMintingStatus(uint256 tokenId, bool enabled)`
Enables or disables minting for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to set status for
  - `enabled`: Whether minting is enabled
- **Events**:
  - `MintingStatusChanged(uint256 indexed tokenId, bool enabled)`

#### `setRoyalty(uint256 tokenId, uint256 bps)`
Sets the royalty percentage for a token ID.
- **Parameters**:
  - `tokenId`: The token ID to set royalty for
  - `bps`: Royalty percentage in basis points (max 1000 = 10%)
- **Events**:
  - `RoyaltyUpdated(uint256 indexed tokenId, uint256 bps)`

#### `withdraw()`
Withdraws all contract balance to the owner.
- **Requirements**:
  - Only callable by owner

## Events

### `NFTMinted`
Emitted when a new NFT is minted.
```solidity
event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
```

### `WhitelistUpdated`
Emitted when the whitelist is updated.
```solidity
event WhitelistUpdated(uint256 indexed tokenId, address[] addresses);
```

### `MintingStatusChanged`
Emitted when minting status is changed.
```solidity
event MintingStatusChanged(uint256 indexed tokenId, bool enabled);
```

### `PriceUpdated`
Emitted when prices are updated.
```solidity
event PriceUpdated(uint256 indexed tokenId, uint256 whitelistPrice, uint256 publicPrice);
```

### `RoyaltyUpdated`
Emitted when royalty percentage is updated.
```solidity
event RoyaltyUpdated(uint256 indexed tokenId, uint256 bps);
```

## Security Considerations

1. **Access Control**
   - All administrative functions are restricted to the contract owner
   - Whitelist management is controlled by the owner
   - Price and supply management is controlled by the owner

2. **Input Validation**
   - Royalty percentage is capped at 10%
   - Supply limits are enforced
   - Payment amounts are verified

3. **Reentrancy Protection**
   - Uses OpenZeppelin's ReentrancyGuard
   - Secure withdrawal pattern

4. **Safe Math**
   - Uses OpenZeppelin's SafeMath for arithmetic operations
   - Prevents overflow/underflow

## Testing
The contract includes comprehensive test coverage:
- Unit tests for all functions
- Event emission tests
- Access control tests
- Error condition tests
- State change tests

Run tests using:
```bash
forge test
```

## Deployment
See the deployment documentation for detailed instructions on deploying the contract to different networks. 