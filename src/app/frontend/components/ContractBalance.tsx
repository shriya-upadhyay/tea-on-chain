"use client";

import { useReadContract } from 'wagmi';
import { useAuth } from '../contexts/AuthContext';
import { wagmiContractConfig } from '../contracts';
import { BaseError } from 'viem';

export function ContractBalance() {
  const { isConnected, address } = useAuth();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="text-right">
      <div className="text-xs text-gray-500">PYUSD Balance</div>
      <UserBalance address={address} />
    </div>
  );
}

function UserBalance({ address }: { address: string }) {
  const { data, error, isLoading, isSuccess } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  if (isLoading) {
    return (
      <div className="text-sm font-semibold text-[#FF5884]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error('Balance fetch error:', error);
    return (
      <div className="text-sm font-semibold text-red-500">
        Error loading balance
      </div>
    );
  }

  if (!isSuccess || !data) {
    return (
      <div className="text-sm font-semibold text-gray-400">
        0.00 PYUSD
      </div>
    );
  }

  // Convert from wei to PYUSD (assuming 6 decimals like USDC)
  const balance = Number(data) / Math.pow(10, 6);
  const formattedBalance = balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="text-sm font-semibold text-[#FF5884]">
      {formattedBalance} PYUSD
    </div>
  );
} 