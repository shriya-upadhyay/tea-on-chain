"use client";

import { useAuth } from '../contexts/AuthContext';
import { useConnect } from 'wagmi';
import { useState } from 'react';

export function WalletComponent() {
  const { isConnected, address, connect, disconnect } = useAuth();
  const { connectors, isPending } = useConnect();
  const [error, setError] = useState<string>("");

  const handleConnectWallet = async (connector: any) => {
    try {
      setError("");
      await connect(connector);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      console.error("Connection error:", err);
    }
  };

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
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnectWallet(connector)}
            disabled={isPending}
            className="w-full bg-[#FF5884] hover:bg-[#E04A7A] disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              `Connect ${connector.name}`
            )}
          </button>
        ))}
        
        {connectors.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No wallets available. Please install a supported wallet extension.
          </p>
        )}
      </div>
    </div>
  );
} 