import { Abi } from 'viem';

import { Lottery_ABI } from './LotteryABI';

export const LOTTERY_CONTRACT_ADDRESS = '0x9ce4B0Fe4561b0C9f7DC2C861D1BA7f1A8CbAD2f';
export const LOTTERY_ABI = Lottery_ABI as Abi;

export const LotteryContractConfig = {
  abi: LOTTERY_ABI,
  address: LOTTERY_CONTRACT_ADDRESS,
};
