import { useEffect, useRef, useState } from 'react';

import { COUNTDOWN_DURATION, COUNTDOWN_STORAGE_KEY, LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '@constants';
import { useGameContext, useStepper } from '@providers';
import { Ticket } from '@types';
import { readContract } from '@wagmi/core';
import { useAccount, useWatchContractEvent } from 'wagmi';

import { config } from '../../../wagmi';

interface UseCountdownReturn {
  isCheckingResults: boolean;
  isResultReady: boolean;
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
  const [isResultReady, setIsResultReady] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const storageKey = `${COUNTDOWN_STORAGE_KEY}_${ticket?.id}`;

  useEffect(() => {
    if (!ticket?.id) return;

    let endTime = Number(localStorage.getItem(storageKey));

    if (!endTime || isNaN(endTime)) {
      endTime = Date.now() + COUNTDOWN_DURATION * 1000;
      localStorage.setItem(storageKey, String(endTime));
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.round((endTime - now) / 1000));
      setTimeLeft(diff);

      if (diff <= 0) {
        clearIntervalIfNeeded();
        localStorage.removeItem(storageKey);
        setIsResultReady(true);
      }
    };

    updateCountdown();
    intervalRef.current = window.setInterval(updateCountdown, 200);

    return () => clearIntervalIfNeeded();
  }, [ticket?.id]);

  const clearIntervalIfNeeded = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'RandomNumberGenerated',
    onLogs() {
      onResultsReady();
    },
  });

  const onResultsReady = () => {
    if (ticket?.id) {
      localStorage.removeItem(storageKey);
    }
    clearIntervalIfNeeded();
    setTimeLeft(0);
    setIsResultReady(true);
  };

  const seeResults = async () => {
    setIsCheckingResults(true);
    try {
      const requestedTicket = await readContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'getTicketById',
        args: [ticket?.id as bigint],
        account: address,
      });

      setTicketState(requestedTicket as Ticket);
    } catch (err) {
      console.error('Fetching ticket failed:', err);
      throw err;
    } finally {
      setIsCheckingResults(false);
    }
  };

  const seeResultsHandler = async () => {
    if (minutes === 0 && seconds === 0) {
      await seeResults();
      if (ticket?.id) {
        localStorage.removeItem(storageKey);
      }
      nextStep();
    }
  };

  return {
    isCheckingResults,
    isResultReady,
    minutes,
    seconds,
    seeResultsHandler,
  };
};
