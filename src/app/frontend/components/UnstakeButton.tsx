"use client";

import { useState } from "react";
import { getContract } from "viem";
import { useWalletClients } from "../lib/clients";
import { stakingAbi } from "./abi/stakingAbi";

interface UnstakeButtonProps {
  onSuccess: () => void;
  stakingContractAddress: string;
}

export function UnstakeButton({ 
  onSuccess, 
  stakingContractAddress 
}: UnstakeButtonProps) {
  const { primaryWallet, getPublicClient, getWalletClient } = useWalletClients();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  if (!primaryWallet || !getPublicClient || !getWalletClient) {
    return null;
  }

  const handleUnstake = async () => {
    setIsLoading(true);
    setError("");

    try {
      const publicClient = await getPublicClient();
      const walletClient = await getWalletClient();

      if (!publicClient || !walletClient) {
        throw new Error("Failed to get wallet clients");
      }

      // Create staking contract instance
      const stakingContract = getContract({
        address: stakingContractAddress as `0x${string}`,
        abi: stakingAbi,
        client: walletClient,
      });

      // Check if user has staked tokens before attempting to unstake
      console.log("Checking staked balance...");
      const stakedAmount = await stakingContract.read.getStaked([primaryWallet.address as `0x${string}`]);
      
      if (stakedAmount === 0n) {
        throw new Error("No tokens staked to unstake");
      }

      console.log("Staked amount:", stakedAmount.toString());

      // Call the unstake function
      console.log("Unstaking tokens...");
      const unstakeHash = await stakingContract.write.unstake();

      // Wait for unstaking transaction receipt
      const unstakeReceipt = await publicClient.waitForTransactionReceipt({
        hash: unstakeHash,
      });

      if (unstakeReceipt.status !== "success") {
        throw new Error("Unstaking failed");
      }

      console.log("Unstaking successful:", unstakeReceipt);

      // Unstaking successful, call onSuccess
      onSuccess();

    } catch (err) {
      console.error("Unstaking error:", err);
      setError(err instanceof Error ? err.message : "Unstaking failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleUnstake}
        disabled={isLoading}
        className="w-full rounded-full bg-[#FF5884] hover:bg-[#E54B7A] disabled:bg-gray-400
                   text-white text-base sm:text-lg font-semibold py-3.5
                   shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] disabled:scale-100
                   focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Inria Sans', sans-serif" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Unstaking...
          </div>
        ) : (
          "Unstake USDC"
        )}
      </button>

      {error && (
        <div className="mt-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
