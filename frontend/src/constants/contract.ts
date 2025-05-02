import { Abi } from 'viem';
import { Lottery_ABI } from './LotteryABI';

export const LOTTERY_CONTRACT_ADDRESS = '0xbF8D13C0DdBFcE06eB62647FD178E04C4eFaBDB2';
export const LOTTERY_ABI = Lottery_ABI as Abi;

export const LotteryContractConfig = {
  abi: LOTTERY_ABI,
  address: LOTTERY_CONTRACT_ADDRESS,
};
