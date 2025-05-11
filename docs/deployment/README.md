# Deployment Guide

## Prerequisites

1. **Development Environment**
   - Node.js (v16 or later)
   - npm (v7 or later)
   - Foundry (latest version)
   - Git

2. **Required Accounts**
   - Ethereum wallet with testnet/mainnet ETH
   - Alchemy/Infura account for RPC endpoints
   - Etherscan account for contract verification

## Environment Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/geckhoboynxt.git
   cd geckhoboynxt
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install Foundry
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Network RPC URLs
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key

   # Contract Deployment
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key

   # Network Configuration
   NEXT_PUBLIC_NETWORK_ID=1 # Mainnet
   ```

## Smart Contract Deployment

### Local Development

1. **Start Local Network**
   ```bash
   cd contracts/foundry_app
   anvil
   ```

2. **Deploy Contract**
   ```bash
   # Deploy to local network
   forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast
   ```

### Testnet Deployment

1. **Configure Network**
   Update `foundry.toml` with testnet configuration:
   ```toml
   [profile.testnet]
   src = "src"
   out = "out"
   libs = ["lib"]
   solc = "0.8.20"
   ```

2. **Deploy to Testnet**
   ```bash
   # Deploy to Goerli
   forge script script/Deploy.s.sol:Deploy --rpc-url $GOERLI_RPC_URL --broadcast --verify
   ```

### Mainnet Deployment

1. **Verify Configuration**
   - Double-check all parameters
   - Ensure sufficient ETH for deployment
   - Verify contract code

2. **Deploy to Mainnet**
   ```bash
   # Deploy to Mainnet
   forge script script/Deploy.s.sol:Deploy --rpc-url $MAINNET_RPC_URL --broadcast --verify
   ```

## Frontend Deployment

### Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Locally**
   - Open http://localhost:3000
   - Connect wallet
   - Test all functionality

### Production

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Configure Environment**
   - Set environment variables in Vercel dashboard
   - Configure build settings
   - Set up custom domain

## Post-Deployment

1. **Contract Verification**
   ```bash
   # Verify on Etherscan
   forge verify-contract <CONTRACT_ADDRESS> src/GECKHONFT.sol:GECKHONFT --chain-id 1
   ```

2. **Initial Setup**
   ```bash
   # Set initial parameters
   cast send <CONTRACT_ADDRESS> "setPrices(uint256,uint256,uint256)" 1 100000000000000000 200000000000000000 --rpc-url $MAINNET_RPC_URL
   cast send <CONTRACT_ADDRESS> "setMaxSupply(uint256,uint256)" 1 10000 --rpc-url $MAINNET_RPC_URL
   cast send <CONTRACT_ADDRESS> "setRoyalty(uint256,uint256)" 1 500 --rpc-url $MAINNET_RPC_URL
   ```

3. **Whitelist Setup**
   ```bash
   # Add whitelist addresses
   cast send <CONTRACT_ADDRESS> "setWhitelist(uint256,address[])" 1 "[address1,address2]" --rpc-url $MAINNET_RPC_URL
   ```

## Monitoring

1. **Contract Monitoring**
   - Set up Etherscan alerts
   - Monitor contract events
   - Track transaction status

2. **Frontend Monitoring**
   - Set up error tracking
   - Monitor user analytics
   - Track performance metrics

## Security Checklist

1. **Pre-Deployment**
   - [ ] Contract audited
   - [ ] All tests passing
   - [ ] Security best practices followed
   - [ ] Access control verified
   - [ ] Emergency procedures documented

2. **Post-Deployment**
   - [ ] Contract verified on Etherscan
   - [ ] Initial parameters set correctly
   - [ ] Whitelist configured
   - [ ] Monitoring set up
   - [ ] Backup procedures in place

## Troubleshooting

### Common Issues

1. **Deployment Failures**
   - Check gas prices
   - Verify network connection
   - Ensure sufficient ETH
   - Check contract size limits

2. **Verification Issues**
   - Verify compiler version
   - Check constructor arguments
   - Ensure all dependencies verified

3. **Frontend Issues**
   - Check environment variables
   - Verify contract addresses
   - Check network configuration
   - Verify wallet connection

### Support

For deployment support:
- Open an issue on GitHub
- Contact development team
- Check documentation updates
- Join community Discord 