'use client';

import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getContract, mintNFT, getNFTInfo, isWhitelisted, SUPPORTED_CHAIN_IDS } from '@/utils/contract';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function NFTPage() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<{
    maxSupply: string;
    currentSupply: string;
    price: string;
    royalty: string;
    isPublicMinting: boolean;
    maxMintsPerTx: string;
  } | null>(null);
  const [tokenURI, setTokenURI] = useState('');
  const [isWhitelistedUser, setIsWhitelistedUser] = useState(false);

  useEffect(() => {
    const loadNFTInfo = async () => {
      if (!isConnected || !chain) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const info = await getNFTInfo(provider, 0);
        setNftInfo(info);

        if (address) {
          const whitelisted = await isWhitelisted(provider, 0, address);
          setIsWhitelistedUser(whitelisted);
        }
      } catch (error) {
        console.error('Error loading NFT info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load NFT information',
          variant: 'destructive',
        });
      }
    };

    loadNFTInfo();
  }, [isConnected, chain, address, toast]);

  const handleMint = async () => {
    if (!isConnected || !chain || !address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (!nftInfo?.isPublicMinting && !isWhitelistedUser) {
      toast({
        title: 'Error',
        description: 'You are not whitelisted and public minting is disabled',
        variant: 'destructive',
      });
      return;
    }

    if (!tokenURI) {
      toast({
        title: 'Error',
        description: 'Please enter a token URI',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const result = await mintNFT(provider, 0, tokenURI);
      
      toast({
        title: 'Success',
        description: `NFT minted successfully! Token ID: ${result.tokenId}`,
      });
      
      setTokenURI('');
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mint NFT',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    if (switchNetwork) {
      try {
        await switchNetwork(SUPPORTED_CHAIN_IDS.ANVIL);
      } catch (error) {
        console.error('Error switching network:', error);
        toast({
          title: 'Error',
          description: 'Failed to switch network',
          variant: 'destructive',
        });
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to continue</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (chain?.id !== SUPPORTED_CHAIN_IDS.ANVIL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription>
            Please switch to the Anvil network to mint NFTs
            <Button onClick={handleSwitchNetwork} className="ml-4">
              Switch Network
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mint NFT</CardTitle>
          <CardDescription>
            {nftInfo?.isPublicMinting
              ? 'Public minting is enabled'
              : isWhitelistedUser
              ? 'You are whitelisted'
              : 'Public minting is disabled and you are not whitelisted'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Max Supply</p>
                <p className="text-2xl font-bold">{nftInfo?.maxSupply || '0'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Supply</p>
                <p className="text-2xl font-bold">{nftInfo?.currentSupply || '0'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-2xl font-bold">{nftInfo?.price || '0'} ETH</p>
              </div>
              <div>
                <p className="text-sm font-medium">Royalty</p>
                <p className="text-2xl font-bold">{nftInfo?.royalty || '0'}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="tokenURI" className="text-sm font-medium">
                Token URI
              </label>
              <Input
                id="tokenURI"
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                placeholder="Enter token URI (e.g., ipfs://...)"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleMint}
            disabled={isLoading || !nftInfo?.isPublicMinting && !isWhitelistedUser}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              'Mint NFT'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 