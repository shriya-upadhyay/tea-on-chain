"use client";

import { useState } from "react";
import { getContract } from "viem";
import { parseUnits } from "viem";
import { useWalletClients } from "../lib/clients";
import { stakingAbi } from "./abi/stakingAbi";
import { erc20abi } from "./abi/erc20abi";

interface StakingButtonProps {
  onSuccess: () => void;
  tokenAddress: string;
  stakingContractAddress: string;
}

export function StakingButton({ 
  onSuccess, 
  tokenAddress, 
  stakingContractAddress 
}: StakingButtonProps) {
  const { primaryWallet, getPublicClient, getWalletClient } = useWalletClients();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  if (!primaryWallet || !getPublicClient || !getWalletClient) {
    return null;
  }

  const handleStake = async () => {
    setIsLoading(true);
    setError("");

    try {
      const publicClient = await getPublicClient();
      const walletClient = await getWalletClient();

      if (!publicClient || !walletClient) {
        throw new Error("Failed to get wallet clients");
      }

      // Fixed stake amount: 2 USDC (6 decimals)
      const amountToStake = parseUnits("2", 6);

      // Create ERC20 contract instance
      const tokenContract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20abi,
        client: walletClient,
      });

      // Create staking contract instance
      const stakingContract = getContract({
        address: stakingContractAddress as `0x${string}`,
        abi: stakingAbi,
        client: walletClient,
      });

      // Step 1: Approve the staking contract to spend tokens
      console.log("Approving tokens for staking contract...");
      const approveHash = await tokenContract.write.approve([
        stakingContractAddress as `0x${string}`,
        amountToStake,
      ]);

      // Wait for approval transaction receipt
      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveHash,
      });

      if (approveReceipt.status !== "success") {
        throw new Error("Token approval failed");
      }

      console.log("Token approval successful:", approveReceipt);

      // Step 2: Call the stake function
      console.log("Staking tokens...");
      const stakeHash = await stakingContract.write.stake();

      // Wait for staking transaction receipt
      const stakeReceipt = await publicClient.waitForTransactionReceipt({
        hash: stakeHash,
      });

      if (stakeReceipt.status !== "success") {
        throw new Error("Staking failed");
      }

      console.log("Staking successful:", stakeReceipt);

      // Both transactions successful, call onSuccess
      onSuccess();

    } catch (err) {
      console.error("Staking error:", err);
      setError(err instanceof Error ? err.message : "Staking failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleStake}
        disabled={isLoading}
        className="w-full rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A] disabled:bg-gray-400
                   text-white text-base sm:text-lg font-semibold py-3.5
                   shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] disabled:scale-100
                   focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Inria Sans', sans-serif" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Staking...
          </div>
        ) : (
          "Stake 2 USDC"
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
