import { useId, useState, Dispatch, SetStateAction } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { useAccount } from 'wagmi';

import { config } from '../../wagmi';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../constants';
import { useGameContext, useStepper } from '../../providers';

interface UseSubmitCombinationReturn {
  playerCombination: (number | null)[];
  baseId: string;
  hasDuplicates: boolean;
  isSubmittingCombination: boolean;
  setPlayerCombination: Dispatch<SetStateAction<(number | null)[]>>;
  submitCombination: () => Promise<string>;
  preventNonNumericInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleChange: (index: number, value: string) => void;
  isValid: () => boolean;
  submitPlayerCombinationHandler: () => Promise<void>;
}

export const useSubmitCombination = (): UseSubmitCombinationReturn => {
  const baseId = useId();
  const { address } = useAccount();
  const { ticket } = useGameContext();
  const { nextStep } = useStepper();

  const [isSubmittingCombination, setIsSubmittingCombination] = useState(false);
  const [playerCombination, setPlayerCombination] = useState<(number | null)[]>(Array(5).fill(''));
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const preventNonNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleChange = (index: number, value: string) => {
    const updatedCombination = [...playerCombination];
    updatedCombination[index] = value === '' ? 0 : Number(value);
    setPlayerCombination(updatedCombination);

    const nonEmpty = updatedCombination.filter(v => v !== null);
    const unique = new Set(nonEmpty);
    setHasDuplicates(nonEmpty.length !== unique.size);
  };

  const isValid = () => {
    const nonEmpty = playerCombination.filter(v => v !== null);
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
        args: [BigInt(ticket?.id as number), playerCombination],
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
      nextStep();
    } catch (error) {
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
    preventNonNumericInput,
    handleChange,
    isValid,
    submitPlayerCombinationHandler,
  };
};
