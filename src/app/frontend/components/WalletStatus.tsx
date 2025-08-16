"use client";

import { useAuth } from '../contexts/AuthContext';
import { ContractBalance } from './ContractBalance';

export function WalletStatus() {
  const { isConnected, disconnect } = useAuth();

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-sm text-gray-600">Not Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:block">
        <ContractBalance />
      </div>
      <button
        onClick={disconnect}
        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
} 