import { Abi } from 'viem';
import { Lottery_ABI } from './LotteryABI';

export const LOTTERY_CONTRACT_ADDRESS = '0xf6575ef4B9eC2a8C2a0269E4079b66076B3dFa9E';
export const LOTTERY_ABI = Lottery_ABI as Abi;

export const LotteryContractConfig = {
  abi: LOTTERY_ABI,
  address: LOTTERY_CONTRACT_ADDRESS,
};
