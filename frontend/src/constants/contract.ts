import { Abi } from 'viem';

import { Lottery_ABI } from './LotteryABI';

export const LOTTERY_CONTRACT_ADDRESS = '0x8C1A95194027AeB6574C33874444c58B433ACA2B';
export const LOTTERY_ABI = Lottery_ABI as Abi;

export const LotteryContractConfig = {
  abi: LOTTERY_ABI,
  address: LOTTERY_CONTRACT_ADDRESS,
};
