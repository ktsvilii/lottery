import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { useGameContext, useStepper } from '../../providers';
import { parseEther } from 'viem';

export const CheckResultsStep: FC = () => {
  const navigate = useNavigate();
  const { goToFirstStep } = useStepper();
  const { ticketNumber, playerCombination, winningCombination, rewardAmount, matchingNumbers } = useGameContext();

  const playerCombinationResult = playerCombination?.join(', ');
  const winningCombinationResult = winningCombination?.join(', ');

  const goHome = () => {
    navigate('/');
  };

  const resultsContent = rewardAmount
    ? `You matched ${matchingNumbers} number. Your reward is ${parseEther(String(rewardAmount), 'wei')} ETH.`
    : `You have 0 matches. Better luck next time.`;

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20 pt-8'>
      <h1 className='text-3xl text-center'>
        <strong>Step 4.</strong> Check Results for ticket #{ticketNumber}
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 space-x-4 space-y-4'>
        <div className='bg-black p-4 min-w-80 text-2xl text-white'>
          <p>Your combination</p>
          <p>{playerCombinationResult}</p>
        </div>
        <div className='bg-white p-4 min-w-80 text-xl md:text-2xl text-black'>
          <p>Winning combination</p>
          <p>{winningCombinationResult}</p>
        </div>
      </div>

      <h2 className='py-5 text-center'>{resultsContent}</h2>

      <button className='btn btn-sm btn-outline min-w-72 text-xl h-16' onClick={goToFirstStep}>
        Play again
      </button>

      <div className='divider divider-neutral'>OR</div>

      <button className='btn btn-sm btn-outline min-w-60 text-xl h-12' onClick={goHome}>
        Return to homepage
      </button>
    </div>
  );
};
