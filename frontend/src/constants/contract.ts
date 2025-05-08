import { Abi } from 'viem';
import { Lottery_ABI } from './LotteryABI';

export const LOTTERY_CONTRACT_ADDRESS = '0x238F0165344Db6B5de5c928b6aDba0D94C77b5D1';
export const LOTTERY_ABI = Lottery_ABI as Abi;

export const LotteryContractConfig = {
  abi: LOTTERY_ABI,
  address: LOTTERY_CONTRACT_ADDRESS,
};
