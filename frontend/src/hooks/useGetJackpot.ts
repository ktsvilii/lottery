import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../constants';

export const useGetJackpot = () => {
  const { address } = useAccount();

  const { data: jackpot, refetch: refetchJackpot } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getJackpot',
    account: address,
  });

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'JackpotWithdraw',
    onLogs() {
      refetchJackpot();
    },
  });

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'FundJackpot',
    onLogs() {
      refetchJackpot();
    },
  });

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'Distribute',
    onLogs() {
      refetchJackpot();
    },
  });

  return {
    jackpot,
    refetchJackpot,
  };
};
