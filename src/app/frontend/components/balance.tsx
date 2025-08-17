"use client";

import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';
import { getContract } from 'viem';
import { erc20abi } from './abi/erc20abi';
import { useWalletClients } from '../lib/clients';

export function Balance() {
  const { user, primaryWallet } = useDynamicContext();
  const { getPublicClient } = useWalletClients();
  const [contractAddress, setContractAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [decimals, setDecimals] = useState<number>(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Get contract address from environment variable
  useEffect(() => {
    const address = process.env.NEXT_PUBLIC_DEV_PYUSD || "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
    if (address) {
      setContractAddress(address);
    }
  }, []);

  // Fetch balance and decimals function
  const fetchBalance = async () => {
    if (!primaryWallet?.address || !contractAddress || !getPublicClient) return;

    // Check if it's an Ethereum wallet
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    setIsLoading(true);
    setError('');

      try {
        if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;
        console.log('primaryWallet', primaryWallet);
        const publicClient = await getPublicClient();
        
        if (!publicClient) {
          throw new Error('Failed to get public client');
        }
        
        console.log('publicClient', publicClient);

      // Create contract instance using viem
      const contract = getContract({ 
        address: contractAddress as `0x${string}`, 
        abi: erc20abi, 
        client: publicClient 
      });

      // Read decimals and balance using Promise.all for efficiency
      const [decimalsNumber, balanceNumber] = await Promise.all([
        contract.read.decimals(),
        contract.read.balanceOf([primaryWallet.address as `0x${string}`])
      ]);

      setDecimals(decimalsNumber as number);
      
      const formattedBalance = (Number(balanceNumber) / Math.pow(10, decimalsNumber as number)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      setBalance(formattedBalance);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balance when wallet connects
  useEffect(() => {
    console.log('fetching balance', primaryWallet);
    fetchBalance();
  }, [primaryWallet?.address, contractAddress]);

  // Handle click to refresh balance
  const handleClick = () => {
    fetchBalance();
  };

  if (!user || !primaryWallet) {
    return (
      <div className="text-center">
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF5884] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={handleClick}>
      <div className="text-xs text-gray-500">PYUSD</div>
      <div className="text-sm font-semibold text-[#FF5884]">{balance}</div>
    </div>
  );
} 