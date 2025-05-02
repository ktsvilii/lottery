import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { LOTTERY_CONTRACT_ADDRESS, LOTTERY_ABI } from '../constants';

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
