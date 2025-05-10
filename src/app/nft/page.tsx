'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWeb3 } from '@/components/Web3Provider';
import { mintNFT } from '@/utils/contract';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  supply: string;
  benefits: {
    category: string;
    items: string[];
  }[];
  status: 'upcoming' | 'available' | 'sold';
  color: string;
  tokenURI: string;
}

const nftCollection: NFT[] = [
  {
    id: 'genesis-pass',
    name: 'GECKHO GENESIS PASS',
    description: '"The Origin"',
    image: '/images/genesis-pass.jpg',
    price: '0.05',
    supply: '100 NFTs',
    color: '#a0b921',
    tokenURI: 'ipfs://your-genesis-pass-metadata-uri',
    benefits: [
      {
        category: '🎁 Access & Utility Perks',
        items: [
          '🎵 Early Access to Music & Art - Be the first to hear unreleased tracks and visual drops',
          '🛍️ Exclusive Merch Drops - Access to limited merch lines not available to the public',
          '🗳️ Creative Voting Power - Participate in community polls for cover art and tracklist decisions',
          '🎟️ Fan Event Access - Guaranteed access to one virtual or in-person event per year',
          '🎁 Quarterly 1-of-1 Art or Gear Raffle - Entered automatically for custom art and signed merch'
        ]
      },
      {
        category: '🔓 Bonus Utility',
        items: [
          'Unlockable NFT Content - Secret content embedded in the NFT including exclusive demos and behind-the-scenes footage'
        ]
      }
    ],
    status: 'available'
  },
  {
    id: 'exodus-pass',
    name: 'EXODUS PASS',
    description: '"The Journey"',
    image: '/images/exodus-pass.jpg',
    price: '0.08',
    supply: '250 NFTs',
    color: '#FFD700',
    tokenURI: 'ipfs://your-exodus-pass-metadata-uri',
    benefits: [
      {
        category: '🚀 Core Perks',
        items: [
          '🎧 Behind-the-Scenes Creation Access - Private streams of studio sessions and production workflows',
          '💬 Private Discord Access + AMAs - Exclusive chat room with monthly AMAs and creative polls',
          '📼 Vault Access to Unreleased Content - Hidden archive with B-sides and experimental sounds',
          '📮 Enhanced Voting Power - 2x the vote weight of Genesis holders',
          '🎨 Annual Artist Airdrop - Free collab NFT drop or mini-comic per year'
        ]
      },
      {
        category: '🧬 Bonus Utility',
        items: [
          'Trait Evolution: "Ascended Exodus" - Combine 2 Exodus Passes to unlock a higher-tier NFT with new perks'
        ]
      }
    ],
    status: 'available'
  },
  {
    id: 'revelation-pass',
    name: 'REVELATION PASS',
    description: '"The Future"',
    image: '/images/revelation-pass.jpg',
    price: '0.2',
    supply: '50 NFTs',
    color: '#4169E1',
    tokenURI: 'ipfs://your-revelation-pass-metadata-uri',
    benefits: [
      {
        category: '💎 Premium Collector Perks',
        items: [
          '🖼️ 1-of-1 Custom Collectible - Bespoke visual artwork stylized to your profile',
          '🎤 Co-Creation Credit - Chance to contribute creatively to GECKHO tracks or visual concepts',
          '🧢 Limited Merch Bundle - Physical high-quality item with NFT twin',
          '📈 Share of Royalties - Eligible for % return via partner platforms',
          '🌐 Lifetime Event Access - Unlimited entry to all future GECKHO experiences',
          '🧩 Alternate Reality Game (ARG) - Entry into an interactive lore-driven puzzle game'
        ]
      }
    ],
    status: 'available'
  }
];

export default function NFTPage() {
  const [minting, setMinting] = useState<string | null>(null);
  const { account, provider, connect } = useWeb3();

  const handleMint = async (nft: NFT) => {
    if (!account || !provider) {
      await connect();
      return;
    }

    setMinting(nft.id);
    try {
      const tx = await mintNFT(provider, nft.tokenURI, nft.price);
      await tx.wait();
      alert(`Successfully minted ${nft.name}!`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setMinting(null);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/nft-hero.jpg"
              alt="GECKHO NFT Collection"
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
              className="object-contain md:object-cover object-center"
              style={{
                objectPosition: 'center',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white uppercase tracking-wider font-['Impact'] drop-shadow-lg">
              NFT Collection
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-white drop-shadow-lg">
              Exclusive digital collectibles with unique benefits and utilities
            </p>
          </div>
        </section>

        {/* Featured NFTs */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-[#a0b921] uppercase tracking-wider font-['Impact']">
              The GECKHO Trilogy
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {nftCollection.map((nft) => (
                <div 
                  key={nft.id}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333333] hover:border-[var(--nft-color)] transition-colors duration-300"
                  style={{ '--nft-color': nft.color } as React.CSSProperties}
                >
                  <div className="relative aspect-[9/16] w-full bg-black">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2 bg-[var(--nft-color)] text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {nft.status}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: nft.color }}>{nft.name}</h3>
                    <p className="text-gray-400 mb-2 text-sm sm:text-base">{nft.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm sm:text-base text-gray-400">Supply: {nft.supply}</span>
                      <span className="text-lg sm:text-xl font-bold" style={{ color: nft.color }}>
                        {nft.price} ETH
                      </span>
                    </div>
                    {nft.benefits.map((benefitGroup, groupIndex) => (
                      <div key={groupIndex} className="mb-4">
                        <h4 className="text-sm sm:text-base font-semibold mb-2" style={{ color: nft.color }}>
                          {benefitGroup.category}
                        </h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm sm:text-base">
                          {benefitGroup.items.map((benefit, index) => (
                            <li key={index} className="mb-2">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <button 
                      className="w-full bg-[var(--nft-color)] text-black px-4 sm:px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ '--nft-color': nft.color } as React.CSSProperties}
                      onClick={() => handleMint(nft)}
                      disabled={minting === nft.id}
                    >
                      {minting === nft.id ? (
                        'Minting...'
                      ) : !account ? (
                        'Connect Wallet'
                      ) : nft.id === 'genesis-pass' ? (
                        'Join the Genesis'
                      ) : nft.id === 'exodus-pass' ? (
                        'Begin the Exodus'
                      ) : (
                        'Enter the Revelation'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-[#a0b921] uppercase tracking-wider font-['Impact']">
              Collector Ecosystem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="text-center p-4 sm:p-6 bg-[#1a1a1a] rounded-xl border border-[#333333]">
                <div className="text-3xl sm:text-4xl mb-4">🏆</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">True Believer Title</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Automatically unlocked when holding all three passes. Includes special badge, guaranteed free mint in next collection, and access to private council.
                </p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-[#1a1a1a] rounded-xl border border-[#333333]">
                <div className="text-3xl sm:text-4xl mb-4">📊</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Leaderboard System</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Rank based on collection diversity, holding longevity, and event participation. Higher scores unlock prizes and recognition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-[#a0b921] uppercase tracking-wider font-['Impact']">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-2">What are NFTs?</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of a specific item or piece of content.
                </p>
              </div>
              <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-2">How do I purchase an NFT?</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  You&apos;ll need a cryptocurrency wallet and some ETH to purchase NFTs. Detailed instructions will be provided when NFTs are released.
                </p>
              </div>
              <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-2">What benefits do I get?</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Each NFT comes with unique benefits including exclusive music access, VIP concert tickets, and special merchandise.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 