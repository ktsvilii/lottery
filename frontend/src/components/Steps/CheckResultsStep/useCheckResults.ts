import { useState } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { useAccount } from 'wagmi';

import { config } from '../../../wagmi';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../../constants';
import { useGameContext, useStepper } from '../../../providers';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../../types';

interface UseCheckResultsReturn {
  ticket: Ticket | undefined;
  isClaimingRewards: boolean;
  claimRewardHandler: () => Promise<string>;
  goHomeHandler: () => void;
  playAgainHandler: () => void;
}

export const useCheckResults = (): UseCheckResultsReturn => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const { setCurrentStep } = useStepper();
  const { ticket, setTicketState } = useGameContext();
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);

  const claimRewardHandler = async () => {
    setIsClaimingRewards(true);
    try {
      const { request } = await simulateContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'claimReward',
        args: [BigInt(ticket?.id as number)],
        account: address,
      });

      const txHash = await writeContract(config, request);

      await waitForTransactionReceipt(config, { hash: txHash });
      setTicketState({ isRewardClaimed: true });

      return txHash;
    } catch (err) {
      console.error('Submitting combination failed:', err);
      setTicketState({ isRewardClaimed: true });
      throw err;
    } finally {
      setIsClaimingRewards(false);
    }
  };

  const goHomeHandler = () => {
    navigate('/');
    setTicketState(undefined);
  };

  const playAgainHandler = () => {
    setTicketState(undefined);
    setCurrentStep(0);
  };

  return {
    ticket,
    isClaimingRewards,
    claimRewardHandler,
    goHomeHandler,
    playAgainHandler,
  };
};
