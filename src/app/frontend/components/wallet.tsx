"use client";

import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export function WalletComponent() {
  const { isConnected, address, disconnect } = useAuth();
  const [error, setError] = useState<string>("");

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#FF5884] mb-2">Wallet Connected!</h2>
          <p className="text-gray-600 mb-3">Your wallet is successfully connected</p>
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700 font-mono break-all">
              {address}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleDisconnect}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#FF5884] mb-2">Connect Wallet</h2>
        <p className="text-[#FF5884] mb-4">Connect your wallet using Dynamic</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        <DynamicWidget />
      </div>
    </div>
  );
} 