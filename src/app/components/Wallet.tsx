'use client';

import React, { useState, useEffect } from 'react';

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
}

export default function Wallet() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false
  });
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found');
        }
        const address = accounts[0];
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        }) as string;
        
        // Convert balance from wei to ETH
        const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
        
        setWalletState({
          address,
          balance: balanceInEth,
          isConnected: true
        });
        setError(null);
      } else {
        setError('Please install MetaMask or another Web3 wallet');
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      balance: null,
      isConnected: false
    });
  };

  const toggleWallet = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.wallet-container') && !target.closest('.wallet-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="wallet-wrapper">
      <button className="wallet-toggle" onClick={toggleWallet}>
        <i className="fas fa-wallet"></i>
        {walletState.isConnected && (
          <span className="wallet-connected"></span>
        )}
      </button>

      {isOpen && (
        <div className="wallet-container">
          <div className="wallet-header">
            <h3>Crypto Wallet</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {!walletState.isConnected ? (
            <div className="wallet-content">
              {error && <p className="error-message">{error}</p>}
              <button 
                className="connect-wallet-btn"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="wallet-content">
              <div className="wallet-info">
                <p className="wallet-address">
                  {`${walletState.address?.slice(0, 6)}...${walletState.address?.slice(-4)}`}
                </p>
                <p className="wallet-balance">
                  Balance: {walletState.balance} ETH
                </p>
              </div>
              <button 
                className="disconnect-wallet-btn"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 