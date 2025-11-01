import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { Card } from './Card';

interface WalletConnectProps {
  onConnect?: (address: string, network: string) => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      getBalance(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkName = getNetworkName(chainId);
      
      setAddress(accounts[0]);
      setNetwork(networkName);
      
      await getBalance(accounts[0]);
      
      if (onConnect) {
        onConnect(accounts[0], networkName);
      }

      // Save to localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', accounts[0]);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const getBalance = async (addr: string) => {
    try {
      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest']
      });
      
      // Convert from Wei to Ether
      const ethBalance = parseInt(bal, 16) / 1e18;
      setBalance(ethBalance.toFixed(4));
    } catch (err) {
      console.error('Error getting balance:', err);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setNetwork('');
    setBalance('0');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0xaa36a7': 'Sepolia Testnet',
    };
    return networks[chainId] || `Unknown (${chainId})`;
  };

  const shortenAddress = (addr: string): string => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const switchNetwork = async (chainId: string) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (err: any) {
      // If network doesn't exist, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId,
              chainName: 'Polygon Mumbai',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/']
            }]
          });
        } catch (addErr) {
          console.error('Error adding network:', addErr);
        }
      }
    }
  };

  if (!address) {
    return (
      <div className="space-y-4">
        <Button
          variant="primary"
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : '🦊 Connect MetaMask'}
        </Button>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
            {error.includes('not installed') && (
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-2 text-primary hover:underline"
              >
                Download MetaMask →
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🦊</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Connected Wallet</p>
              <p className="font-mono font-semibold text-gray-900">
                {shortenAddress(address)}
              </p>
            </div>
          </div>
          
          <button
            onClick={disconnect}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Disconnect"
          >
            <Icon name="close" size={20} className="text-red-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Balance</p>
            <p className="font-semibold text-gray-900">{balance} ETH</p>
          </div>
          
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Network</p>
            <p className="font-semibold text-gray-900 text-sm">{network}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => switchNetwork('0x13881')}
            className="flex-1 px-3 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
          >
            Switch to Mumbai
          </button>
          <button
            onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
            className="flex-1 px-3 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
          >
            View on Explorer
          </button>
        </div>
      </div>
    </Card>
  );
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
