import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import NFTPage from '../page';
import { mintNFT, getNFTInfo, isWhitelisted } from '@/utils/contract';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

// Mock ethers
jest.mock('ethers', () => ({
  providers: {
    Web3Provider: jest.fn(),
  },
  utils: {
    parseEther: jest.fn(),
    formatEther: jest.fn(),
  },
}));

// Mock contract utils
jest.mock('@/utils/contract', () => ({
  mintNFT: jest.fn(),
  getNFTInfo: jest.fn(),
  isWhitelisted: jest.fn(),
  SUPPORTED_CHAIN_IDS: {
    ANVIL: 31337,
  },
}));

describe('NFTPage', () => {
  const mockAddress = '0x123...';
  const mockProvider = {};

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock window.ethereum
    window.ethereum = {
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    // Mock wagmi hooks
    (useAccount as jest.Mock).mockReturnValue({
      address: mockAddress,
      isConnected: true,
    });
    (useConnect as jest.Mock).mockReturnValue({
      connect: jest.fn(),
    });
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: jest.fn(),
    });

    // Mock ethers
    (ethers.providers.Web3Provider as jest.Mock).mockReturnValue(mockProvider);
    (ethers.utils.parseEther as jest.Mock).mockReturnValue('1000000000000000000');
    (ethers.utils.formatEther as jest.Mock).mockReturnValue('1.0');

    // Mock contract functions
    (getNFTInfo as jest.Mock).mockResolvedValue({
      price: '1.0',
      maxSupply: '100',
      currentSupply: '50',
      royalty: '5',
    });
    (isWhitelisted as jest.Mock).mockResolvedValue(true);
    (mintNFT as jest.Mock).mockResolvedValue({
      transaction: {},
      tokenId: '1',
    });
  });

  it('renders NFT minting page', () => {
    render(<NFTPage />);
    
    expect(screen.getByText('Mint Your NFT')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet and mint your unique NFT on the blockchain')).toBeInTheDocument();
  });

  it('shows wallet connection button when not connected', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: null,
      isConnected: false,
    });

    render(<NFTPage />);
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('loads NFT info when connected', async () => {
    render(<NFTPage />);
    
    await waitFor(() => {
      expect(getNFTInfo).toHaveBeenCalled();
      expect(screen.getByText('1.0 ETH')).toBeInTheDocument();
      expect(screen.getByText('50 / 100')).toBeInTheDocument();
      expect(screen.getByText('5%')).toBeInTheDocument();
    });
  });

  it('shows whitelist badge when user is whitelisted', async () => {
    render(<NFTPage />);
    
    await waitFor(() => {
      expect(isWhitelisted).toHaveBeenCalled();
      expect(screen.getByText('Whitelisted')).toBeInTheDocument();
    });
  });

  it('handles minting process', async () => {
    render(<NFTPage />);
    
    const tokenUriInput = screen.getByPlaceholderText('ipfs://your-metadata-uri');
    fireEvent.change(tokenUriInput, { target: { value: 'ipfs://test-uri' } });
    
    const mintButton = screen.getByText('Mint NFT');
    fireEvent.click(mintButton);
    
    await waitFor(() => {
      expect(mintNFT).toHaveBeenCalledWith(
        expect.any(Object),
        1,
        'ipfs://test-uri'
      );
      expect(screen.getByText('Successfully minted NFT with ID: 1')).toBeInTheDocument();
    });
  });

  it('shows error message when minting fails', async () => {
    (mintNFT as jest.Mock).mockRejectedValue(new Error('Minting failed'));
    
    render(<NFTPage />);
    
    const tokenUriInput = screen.getByPlaceholderText('ipfs://your-metadata-uri');
    fireEvent.change(tokenUriInput, { target: { value: 'ipfs://test-uri' } });
    
    const mintButton = screen.getByText('Mint NFT');
    fireEvent.click(mintButton);
    
    await waitFor(() => {
      expect(screen.getByText('Minting failed')).toBeInTheDocument();
    });
  });

  it('handles network switching', async () => {
    render(<NFTPage />);
    
    const switchButton = screen.getByText('Switch to Anvil');
    fireEvent.click(switchButton);
    
    await waitFor(() => {
      expect(window.ethereum.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }],
      });
    });
  });

  it('handles wallet disconnection', () => {
    const mockDisconnect = jest.fn();
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: mockDisconnect,
    });
    
    render(<NFTPage />);
    
    const disconnectButton = screen.getByText('Disconnect Wallet');
    fireEvent.click(disconnectButton);
    
    expect(mockDisconnect).toHaveBeenCalled();
  });
}); 