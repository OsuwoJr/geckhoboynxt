import { ethers } from 'ethers';

// NFT Contract ABI - only the functions we need
const NFT_ABI = [
  'function mint() public payable',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

// Contract address - replace with your deployed contract address
export const NFT_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

// Supported chain IDs
export const SUPPORTED_CHAIN_IDS = {
  MAINNET: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
};

// Get contract instance
export const getContract = (provider: ethers.providers.Web3Provider) => {
  return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
};

// Mint NFT function
export const mintNFT = async (provider: ethers.providers.Web3Provider) => {
  try {
    const signer = provider.getSigner();
    const contract = getContract(provider).connect(signer);
    const tx = await contract.mint();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// Get NFT balance for an address
export const getNFTBalance = async (provider: ethers.providers.Web3Provider, address: string) => {
  try {
    const contract = getContract(provider);
    const balance = await contract.balanceOf(address);
    return balance.toString();
  } catch (error) {
    console.error('Error getting NFT balance:', error);
    throw error;
  }
}; 