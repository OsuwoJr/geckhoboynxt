'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3 } from './Web3Provider';

const Header = () => {
  const pathname = usePathname();
  const { account, connect, disconnect } = useWeb3();

  const isNFTPage = pathname === '/nft';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">GECKHO</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium ${
                pathname === '/' ? 'text-[#a0b921]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/nft" 
              className={`text-sm font-medium ${
                pathname === '/nft' ? 'text-[#a0b921]' : 'text-gray-300 hover:text-white'
              }`}
            >
              NFTs
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {!isNFTPage && (
              <Link 
                href="/cart" 
                className="text-gray-300 hover:text-white"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
              </Link>
            )}
            {account ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
                <button
                  onClick={disconnect}
                  className="px-3 py-1 text-sm text-white bg-[#a0b921] rounded-lg hover:bg-[#8a9e1d] transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="px-4 py-2 text-sm text-white bg-[#a0b921] rounded-lg hover:bg-[#8a9e1d] transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 