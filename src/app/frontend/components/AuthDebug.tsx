"use client";

import { useAuth } from '../contexts/AuthContext';
import { useAccount, useConnect } from 'wagmi';

export function AuthDebug() {
  const auth = useAuth();
  const wagmiAccount = useAccount();
  const wagmiConnect = useConnect();

  return (
    <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div><strong>AuthContext:</strong></div>
        <div>isConnected: {String(auth.isConnected)}</div>
        <div>address: {auth.address ? `${auth.address.slice(0, 6)}...` : 'none'}</div>
        <div>isLoading: {String(auth.isLoading)}</div>
        
        <div className="mt-2"><strong>Wagmi Direct:</strong></div>
        <div>isConnected: {String(wagmiAccount.isConnected)}</div>
        <div>address: {wagmiAccount.address ? `${wagmiAccount.address.slice(0, 6)}...` : 'none'}</div>
        <div>isConnecting: {String(wagmiConnect.isPending)}</div>
        
        <div className="mt-2"><strong>Connectors:</strong></div>
        <div>Available: {wagmiConnect.connectors.length}</div>
        {wagmiConnect.connectors.map((connector, i) => (
          <div key={i} className="ml-2">
            {i + 1}. {connector.name} (UID: {connector.uid})
          </div>
        ))}
      </div>
    </div>
  );
} 