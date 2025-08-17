// Contract addresses configuration
export const CONTRACTS = {
  // Token addresses
  PYUSD: process.env.NEXT_PUBLIC_DEV_PYUSD || "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  
  // Contract addresses
  STAKING: process.env.NEXT_PUBLIC_DEV_STAKE_ADDRESS || "0x0000000000000000000000000000000000000000", // TODO: Add actual staking contract address
} as const;

// Contract ABI exports
export { stakingAbi } from '../components/abi/stakingAbi';
export { erc20abi } from '../components/abi/erc20abi';
