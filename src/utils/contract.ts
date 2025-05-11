import { ethers } from 'ethers';

// NFT Contract ABI - only the functions we need
const NFT_ABI = [
  'function mintNFT(string memory tokenURI) public payable',
  'function batchMintNFT(string[] memory tokenURIs) public payable',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function mintPrice() view returns (uint256)',
  'function isPublicMintingEnabled() view returns (bool)',
  'function whitelist(address) view returns (bool)',
  'function mintingCooldown(address) view returns (uint256)',
  'function mintingCount(address) view returns (uint256)',
  'function MAX_MINTS_PER_ADDRESS() view returns (uint256)',
  'function MAX_MINTS_PER_TX() view returns (uint256)',
  'function MINTING_COOLDOWN() view returns (uint256)',
  'event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI)',
  'event WhitelistUpdated(address indexed account, bool status)',
  'event PriceUpdated(uint256 newPrice)',
  'event RoyaltyUpdated(uint96 newRoyalty)',
  'event MintingStatusChanged(bool isPublic)',
];

// Contract address - deployed to Anvil local network
export const NFT_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Supported chain IDs
export const SUPPORTED_CHAIN_IDS = {
  MAINNET: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
  ANVIL: 31337,
};

// Get contract instance
export const getContract = (provider: ethers.providers.Web3Provider) => {
  if (!provider) {
    throw new Error('Provider is required');
  }
  return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
};

// Mint NFT function
export const mintNFT = async (
  provider: ethers.providers.Web3Provider,
  tokenId: number,
  tokenURI: string
) => {
  try {
    if (!provider) {
      throw new Error('Provider is required');
    }
    const signer = provider.getSigner();
    const contract = getContract(provider).connect(signer);
    
    // Get the current price
    const price = await contract.mintPrice();
    
    // Check if minting is possible
    const isPublicMinting = await contract.isPublicMintingEnabled();
    const isWhitelisted = await contract.whitelist(await signer.getAddress());
    
    if (!isPublicMinting && !isWhitelisted) {
      throw new Error('Not whitelisted and public minting is disabled');
    }
    
    // Mint the NFT
    const tx = await contract.mintNFT(tokenURI, { value: price });
    const receipt = await tx.wait();
    
    // Find the NFTMinted event
    const event = receipt.events?.find((e: { event: string }) => e.event === 'NFTMinted');
    if (!event) {
      throw new Error('Mint event not found');
    }
    
    return {
      transaction: tx,
      tokenId: event.args?.tokenId,
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    if (error instanceof Error) {
      if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected by user');
      }
      if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds for transaction');
      }
      if (error.message.includes('execution reverted')) {
        throw new Error('Transaction failed: Contract execution reverted');
      }
    }
    throw error;
  }
};

// Get NFT balance for an address
export const getNFTBalance = async (provider: ethers.providers.Web3Provider, address: string) => {
  try {
    if (!provider) {
      throw new Error('Provider is required');
    }
    const contract = getContract(provider);
    const balance = await contract.balanceOf(address);
    return balance.toString();
  } catch (error) {
    console.error('Error getting NFT balance:', error);
    throw error;
  }
};

// Get NFT collection info
export const getNFTInfo = async (
  provider: ethers.providers.Web3Provider,
  tokenId: number
) => {
  try {
    if (!provider) {
      throw new Error('Provider is required');
    }
    const contract = getContract(provider);

    // Check if contract is deployed
    const code = await provider.getCode(NFT_CONTRACT_ADDRESS);
    if (code === '0x') {
      throw new Error('Contract not deployed at the specified address');
    }

    // Get contract info
    const [price, isPublicMinting, maxMintsPerAddress, maxMintsPerTx] = await Promise.all([
      contract.mintPrice().catch(() => ethers.BigNumber.from(0)),
      contract.isPublicMintingEnabled().catch(() => false),
      contract.MAX_MINTS_PER_ADDRESS().catch(() => ethers.BigNumber.from(0)),
      contract.MAX_MINTS_PER_TX().catch(() => ethers.BigNumber.from(0)),
    ]);
    
    return {
      maxSupply: maxMintsPerAddress.toString(),
      currentSupply: '0', // This is not available in the contract
      price: ethers.utils.formatEther(price),
      royalty: '0', // This is not available in the contract
      isPublicMinting,
      maxMintsPerTx: maxMintsPerTx.toString(),
    };
  } catch (error) {
    console.error('Error getting NFT info:', error);
    if (error instanceof Error) {
      if (error.message.includes('call revert exception')) {
        throw new Error('Contract call failed: Function may not exist or contract may not be properly deployed');
      }
    }
    throw error;
  }
};

// Check if address is whitelisted
export const isWhitelisted = async (
  provider: ethers.providers.Web3Provider,
  tokenId: number,
  address: string
) => {
  try {
    if (!provider) {
      throw new Error('Provider is required');
    }
    const contract = getContract(provider);
    return await contract.whitelist(address).catch(() => false);
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return false;
  }
}; 