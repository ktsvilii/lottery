import { useId, useState, Dispatch, SetStateAction } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { useAccount } from 'wagmi';
import { config } from '../../../wagmi';
import { useGameContext, useNotifications, useStepper } from '@providers';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '@constants';

type UserCombination = number | null;

interface UseSubmitCombinationReturn {
  playerCombination: UserCombination[];
  baseId: string;
  hasDuplicates: boolean;
  isSubmittingCombination: boolean;
  setPlayerCombination: Dispatch<SetStateAction<UserCombination[]>>;
  submitCombination: () => Promise<string>;
  handleChange: (index: number, value: string) => void;
  isValid: () => boolean;
  submitPlayerCombinationHandler: () => Promise<void>;
}

export const useSubmitCombination = (): UseSubmitCombinationReturn => {
  const baseId = useId();
  const { address } = useAccount();
  const { ticket } = useGameContext();
  const { nextStep } = useStepper();
  const { toggleNotification } = useNotifications();

  const [isSubmittingCombination, setIsSubmittingCombination] = useState(false);
  const [playerCombination, setPlayerCombination] = useState<(number | null)[]>(Array(5).fill(null));
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const handleChange = (index: number, value: string) => {
    const updatedCombination = [...playerCombination];
    updatedCombination[index] = value === '' ? null : Number(value);
    setPlayerCombination(updatedCombination);

    const nonEmpty = updatedCombination.filter(v => v !== null);
    const unique = new Set(nonEmpty);
    setHasDuplicates(nonEmpty.length !== unique.size);
  };

  const isValid = () => {
    const nonEmpty = playerCombination.filter(v => v !== null && v <= 36);
    const unique = new Set(nonEmpty);
    return nonEmpty.length === 5 && unique.size === 5;
  };

  const submitCombination = async () => {
    if (!isValid()) {
      console.error('Invalid combination');
      throw new Error('Combination is invalid');
    }

    setIsSubmittingCombination(true);
    try {
      const { request } = await simulateContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'submitCombination',
        args: [ticket?.id as bigint, playerCombination],
        account: address,
      });

      const txHash = await writeContract(config, request);

      await waitForTransactionReceipt(config, { hash: txHash });

      return txHash;
    } catch (err) {
      console.error('Submitting combination failed:', err);
      throw err;
    } finally {
      setIsSubmittingCombination(false);
    }
  };

  const submitPlayerCombinationHandler = async () => {
    try {
      await submitCombination();
      toggleNotification({ content: 'Combination submited', type: 'success' });

      nextStep();
    } catch (error) {
      toggleNotification({ content: 'Error during combination confirmation ', type: 'error' });
      console.error('Error during ticket purchase:', error);
    }
  };

  return {
    playerCombination,
    baseId,
    hasDuplicates,
    isSubmittingCombination,
    submitCombination,
    setPlayerCombination,
    handleChange,
    isValid,
    submitPlayerCombinationHandler,
  };
};
