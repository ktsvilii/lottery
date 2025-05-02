import { useState } from 'react';

export const useGame = () => {
  const [ticketNumber, setTicketNumber] = useState(0);
  const [playerCombination, setPlayerCombination] = useState<bigint[]>();
  const [winningCombination, setWinningCombination] = useState<bigint[]>();
  const [rewardAmount, setRewardAmount] = useState(0n);
  const [matchingNumbers, setMatchingNumbers] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  return {
    ticketNumber,
    playerCombination,
    winningCombination,
    rewardAmount,
    matchingNumbers,
    isGameStarted,
    setTicketNumber,
    setPlayerCombination,
    setWinningCombination,
    setRewardAmount,
    setMatchingNumbers,
    setIsGameStarted,
  };
};
