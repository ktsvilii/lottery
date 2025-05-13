import { useState } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { useAccount } from 'wagmi';

import { config } from '../../../wagmi';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../../constants';
import { useGameContext, useNotifications, useStepper } from '../../../providers';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../../types';
import { useTranslation } from 'react-i18next';

interface UseCheckResultsReturn {
  ticket: Ticket | null;
  isClaimingRewards: boolean;
  claimRewardHandler: () => Promise<string>;
  goHomeHandler: () => void;
  playAgainHandler: () => void;
}

const tKey = 'notifications.claim_reward';

export const useCheckResults = (): UseCheckResultsReturn => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { address } = useAccount();
  const { toggleNotification } = useNotifications();

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
        args: [BigInt(ticket?.id as bigint)],
        account: address,
      });

      const txHash = await writeContract(config, request);

      await waitForTransactionReceipt(config, { hash: txHash });
      setTicketState({ isRewardClaimed: true });
      toggleNotification({
        content: t(`${tKey}.success_message`),
        type: 'success',
      });

      return txHash;
    } catch (err) {
      toggleNotification({
        content: t(`${tKey}.error_message`),
        type: 'error',
      });
      console.error('Submitting combination failed:', err);
      setTicketState({ isRewardClaimed: false });
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
