import { useEffect, useState } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount } from 'wagmi';

import { config } from '../../wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../constants';
import { useGameContext, useStepper } from '../../providers';

import { getResultsLog } from './getResultsLog';

const COUNTDOWN_DURATION = 120;
export const COUNTDOWN_STORAGE_KEY = 'countdown_end_time';

interface UseCountdownReturn {
  isCheckingResults: boolean;
  minutes: number;
  seconds: number;
  seeResultsHandler: () => Promise<void>;
}

export const useCountdown = (): UseCountdownReturn => {
  const { address } = useAccount();
  const { ticketNumber, setPlayerCombination, setWinningCombination, setRewardAmount, setMatchingNumbers } =
    useGameContext();
  const { nextStep } = useStepper();

  const [isCheckingResults, setIsCheckingResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    let endTime = Number(localStorage.getItem(COUNTDOWN_STORAGE_KEY));

    if (!endTime || isNaN(endTime)) {
      endTime = Date.now() + COUNTDOWN_DURATION * 1000;
      localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(endTime));
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const seeResults = async () => {
    setIsCheckingResults(true);
    try {
      const { request } = await simulateContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'getResults',
        args: [BigInt(ticketNumber)],
        account: address,
      });

      const txHash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      const { playerCombination, winningCombination, rewardAmount, matchingNumbers } = getResultsLog(receipt.logs);

      setPlayerCombination(playerCombination);
      setWinningCombination(winningCombination);
      setRewardAmount(rewardAmount);
      setMatchingNumbers(matchingNumbers);

      return txHash;
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
