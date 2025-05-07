import { useEffect, useState } from 'react';

import { readContract } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { useGameContext, useStepper } from '../../../providers';
import { config } from '../../../wagmi';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../../constants';

const COUNTDOWN_DURATION = 120;
const COUNTDOWN_STORAGE_KEY = 'countdown_end_time';

type PreviewResultsReturn = [
  number,
  bigint,
  [number, number, number, number, number],
  [number, number, number, number, number],
];

interface UseCountdownReturn {
  isCheckingResults: boolean;
  minutes: number;
  seconds: number;
  seeResultsHandler: () => Promise<void>;
}

export const useCountdown = (): UseCountdownReturn => {
  const { address } = useAccount();
  const { ticket, setTicketState } = useGameContext();
  const { nextStep } = useStepper();

  const [isCheckingResults, setIsCheckingResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    let endTime = Number(localStorage.getItem(`${COUNTDOWN_STORAGE_KEY}_${ticket?.id}`));

    if (!endTime || isNaN(endTime)) {
      endTime = Date.now() + COUNTDOWN_DURATION * 1000;
      localStorage.setItem(`${COUNTDOWN_STORAGE_KEY}_${ticket?.id}`, String(endTime));
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.round((endTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 200);

    return () => clearInterval(interval);
  }, [ticket?.id]);

  const seeResults = async () => {
    setIsCheckingResults(true);
    try {
      const result = await readContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'previewResults',
        args: [BigInt(ticket?.id as number)],
        account: address,
      });

      const [matchingNumbers, reward, playerCombination, winningCombination] = result as PreviewResultsReturn;

      setTicketState({ matchingNumbers, reward, playerCombination, winningCombination });
    } catch (err) {
      console.error('Submitting combination failed:', err);
      throw err;
    } finally {
      setIsCheckingResults(false);
    }
  };

  const seeResultsHandler = async () => {
    if (minutes === 0 && seconds === 0) {
      await seeResults();
      localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      nextStep();
    }
  };

  return { isCheckingResults, minutes, seconds, seeResultsHandler };
};
