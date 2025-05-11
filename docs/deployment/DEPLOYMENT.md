# GECKHONFT Deployment Guide

## Prerequisites

1. **Required Software**
   - Node.js (v16 or later)
   - npm or yarn
   - Git
   - MetaMask or similar wallet

2. **Required Accounts**
   - Ethereum wallet with testnet/mainnet ETH
   - Infura/Alchemy account for RPC endpoints
   - Etherscan account for contract verification

## Environment Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd contracts/foundry_app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - Add your RPC URLs
   - Add your private key
   - Add your Etherscan API key
   - Configure contract parameters

## Deployment Process

### Local Development

1. **Start Local Network**
   ```bash
   npx hardhat node
   ```

2. **Deploy to Local Network**
   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

### Testnet Deployment (Sepolia)

1. **Verify Configuration**
   - Check `.env` file for Sepolia RPC URL
   - Ensure account has sufficient Sepolia ETH
   - Verify Etherscan API key

2. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

3. **Verify Contract**
   - Contract verification is automatic in the deployment script
   - Manual verification if needed:
     ```bash
     npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "GECKHO NFT" "GECKHO" "100000000000000000" <ROYALTY_RECEIVER> "500"
     ```

### Mainnet Deployment

1. **Pre-deployment Checklist**
   - [ ] Complete security audit
   - [ ] Test on testnet
   - [ ] Verify all parameters
   - [ ] Ensure sufficient ETH for deployment
   - [ ] Backup private keys

2. **Deploy to Mainnet**
   ```bash
   npx hardhat run scripts/deploy.ts --network mainnet
   ```

3. **Post-deployment Steps**
   - Verify contract on Etherscan
   - Set up monitoring
   - Configure initial parameters
   - Test all functionality

## Contract Verification

### Automatic Verification
- Handled by deployment script
- Requires Etherscan API key
- Waits for 6 block confirmations

### Manual Verification
```bash
npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Deployment Information

### Contract Parameters
- Name: GECKHO NFT
- Symbol: GECKHO
- Mint Price: 0.1 ETH
- Royalty Fee: 5%

### Initial Setup
1. Deployer added to whitelist
2. Public minting disabled by default
3. Royalty receiver set to deployer address

## Monitoring

### Contract Monitoring
1. **Etherscan**
   - Contract verification
   - Transaction monitoring
   - Event tracking

2. **Custom Monitoring**
   - Event listeners
   - Balance tracking
   - Gas price monitoring

### Alert Setup
1. **Transaction Alerts**
   - Failed transactions
   - High gas prices
   - Unusual activity

2. **Contract Alerts**
   - Balance changes
   - Parameter updates
   - Emergency events

## Troubleshooting

### Common Issues
1. **Deployment Failures**
   - Insufficient gas
   - Network issues
   - Invalid parameters

2. **Verification Issues**
   - Constructor arguments mismatch
   - Network delays
   - API key issues

### Solutions
1. **Gas Issues**
   - Increase gas limit
   - Check gas prices
   - Optimize contract

2. **Network Issues**
   - Check RPC endpoint
   - Verify network status
   - Use alternative RPC

## Security Considerations

### Pre-deployment
1. **Security Audit**
   - Complete audit
   - Address findings
   - Document changes

2. **Testing**
   - Unit tests
   - Integration tests
   - Security tests

### Post-deployment
1. **Monitoring**
   - Set up alerts
   - Monitor events
   - Track transactions

2. **Maintenance**
   - Regular updates
   - Security patches
   - Parameter adjustments

## Support

### Documentation
- Contract documentation
- API documentation
- User guides

### Contact
- Technical support
- Security team
- Emergency contacts 