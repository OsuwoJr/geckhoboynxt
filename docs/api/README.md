# Frontend API Documentation

## Overview
The frontend application provides a user interface for interacting with the GECKHONFT smart contract. This documentation covers the API endpoints, hooks, and utilities used in the application.

## API Endpoints

### Contract Interaction

#### `mintNFT(provider, tokenId, tokenURI)`
Mints a new NFT with the specified token ID and URI.
- **Parameters**:
  - `provider`: Web3Provider instance
  - `tokenId`: The ID of the token to mint
  - `tokenURI`: The URI pointing to the token's metadata
- **Returns**: Promise resolving to the transaction receipt
- **Throws**: Error if minting fails

#### `getNFTInfo(provider, tokenId)`
Gets information about a specific NFT.
- **Parameters**:
  - `provider`: Web3Provider instance
  - `tokenId`: The ID of the token to get info for
- **Returns**: Promise resolving to an object containing:
  - `price`: Current minting price
  - `maxSupply`: Maximum supply
  - `currentSupply`: Current supply
  - `royalty`: Royalty percentage

#### `isWhitelisted(provider, tokenId, address)`
Checks if an address is whitelisted for a specific token ID.
- **Parameters**:
  - `provider`: Web3Provider instance
  - `tokenId`: The token ID to check
  - `address`: The address to check
- **Returns**: Promise resolving to a boolean

## React Hooks

### `useAccount()`
Hook for accessing the connected wallet account.
- **Returns**: Object containing:
  - `address`: Connected wallet address
  - `isConnected`: Boolean indicating connection status
  - `connector`: Active connector instance

### `useConnect()`
Hook for connecting to a wallet.
- **Returns**: Object containing:
  - `connect`: Function to connect to a wallet
  - `connectors`: Available connectors
  - `isConnecting`: Boolean indicating connection in progress
  - `pendingConnector`: Connector being connected to

### `useDisconnect()`
Hook for disconnecting from a wallet.
- **Returns**: Object containing:
  - `disconnect`: Function to disconnect from wallet
  - `isDisconnecting`: Boolean indicating disconnection in progress

## Components

### `NFTPage`
Main component for the NFT minting interface.
- **Props**: None
- **Features**:
  - Wallet connection
  - Network switching
  - NFT information display
  - Minting interface
  - Error handling
  - Loading states

### `WalletConnect`
Component for wallet connection.
- **Props**:
  - `onConnect`: Callback when wallet is connected
  - `onDisconnect`: Callback when wallet is disconnected
- **Features**:
  - Multiple wallet support
  - Connection status display
  - Error handling

### `MintForm`
Component for NFT minting.
- **Props**:
  - `tokenId`: ID of the token to mint
  - `price`: Current minting price
  - `isWhitelisted`: Whether user is whitelisted
  - `onMint`: Callback when minting is successful
- **Features**:
  - Token URI input
  - Price display
  - Whitelist status
  - Minting status
  - Error handling

## Utilities

### `formatEther(value)`
Formats a wei value to ETH.
- **Parameters**:
  - `value`: Value in wei
- **Returns**: Formatted ETH string

### `parseEther(value)`
Parses an ETH string to wei.
- **Parameters**:
  - `value`: ETH string
- **Returns**: Value in wei

### `getContractAddress(network)`
Gets the contract address for a specific network.
- **Parameters**:
  - `network`: Network name or ID
- **Returns**: Contract address

## Error Handling

The application includes comprehensive error handling for:
- Wallet connection failures
- Network switching errors
- Contract interaction errors
- Input validation
- Transaction failures

## State Management

The application uses Zustand for state management with the following stores:

### `useWalletStore`
Manages wallet connection state:
- Connected address
- Network information
- Connection status
- Error state

### `useNFTStore`
Manages NFT-related state:
- Token information
- Minting status
- Whitelist status
- Error state

## Testing

The frontend includes comprehensive tests:
- Unit tests for components
- Integration tests for hooks
- End-to-end tests for user flows
- Error handling tests

Run tests using:
```bash
# Unit and integration tests
npm test

# End-to-end tests
npm run test:e2e
```

## Browser Support

The application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS/Android)

## Performance Considerations

1. **Lazy Loading**
   - Components are lazy loaded
   - Images are optimized
   - Code splitting is implemented

2. **Caching**
   - Contract data is cached
   - Network information is cached
   - Wallet connection state is persisted

3. **Error Boundaries**
   - Components are wrapped in error boundaries
   - Fallback UI for errors
   - Error reporting

## Security

1. **Input Validation**
   - All user inputs are validated
   - Contract interactions are sanitized
   - Network switching is verified

2. **Wallet Security**
   - Secure connection handling
   - Network verification
   - Transaction confirmation

3. **Error Handling**
   - Graceful error recovery
   - User-friendly error messages
   - Error logging 