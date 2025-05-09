import { useEffect, useRef, useState } from 'react';
import { readContract } from '@wagmi/core';
import { useAccount, useWatchContractEvent } from 'wagmi';

import { useGameContext, useStepper } from '../../../providers';
import { config } from '../../../wagmi';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../../constants';
import { Ticket } from '../../../types';

const COUNTDOWN_DURATION = 120;
const COUNTDOWN_STORAGE_KEY = 'countdown_end_time';

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

  useEffect(() => {
    if (!ticket?.id) return;

    const storageKey = `${COUNTDOWN_STORAGE_KEY}_${ticket.id}`;
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
      localStorage.removeItem(`${COUNTDOWN_STORAGE_KEY}_${ticket.id}`);
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
        localStorage.removeItem(`${COUNTDOWN_STORAGE_KEY}_${ticket.id}`);
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
