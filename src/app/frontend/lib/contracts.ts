// Contract addresses configuration
export const CONTRACTS = {
  // Token addresses
  PYUSD: "0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1",
  
  // Contract addresses
  STAKING: process.env.NEXT_PUBLIC_DEV_STAKE_ADDRESS || "0x0000000000000000000000000000000000000000", // TODO: Add actual staking contract address
} as const;

// Contract ABI exports
export { stakingAbi } from '../components/abi/stakingAbi';
export { erc20abi } from '../components/abi/erc20abi';
