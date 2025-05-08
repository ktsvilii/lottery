import { FC } from 'react';

import { useCheckResults } from './useCheckResults';

import { FallbackUI } from '../../FallbackUI';
import { ResultsContent } from './components';

export const CheckResultsStep: FC = () => {
  const { ticket, isClaimingRewards, playAgainHandler, goHomeHandler, claimRewardHandler } = useCheckResults();

  if (!ticket) {
    return <FallbackUI />;
  }

  const { id, playerCombination, winningCombination, potentialReward, matchingNumbers, isRewardClaimed } = ticket;

  const playerCombinationResult = playerCombination?.join(', ');
  const winningCombinationResult = winningCombination?.join(', ');

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20 pt-8'>
      <h1 className='text-3xl text-center'>
        <strong>Step 4.</strong> Check Results for ticket #{id}
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-black border-1 border-white p-4 min-w-80 text-xl md:text-2xl text-white'>
          <p>Your combination</p>
          <p>{playerCombinationResult}</p>
        </div>
        <div className='bg-white  border-1 border-white p-4 min-w-80 text-xl md:text-2xl text-black'>
          <p>Winning combination</p>
          <p>{winningCombinationResult}</p>
        </div>
      </div>

      <h2 className='py-5 text-center'>
        <ResultsContent
          isClaimingRewards={isClaimingRewards}
          isRewardClaimed={isRewardClaimed}
          matchingNumbers={matchingNumbers}
          potentialReward={potentialReward}
          claimRewardHandler={claimRewardHandler}
        />
      </h2>

      <button className='btn btn-sm btn-outline min-w-72 text-xl h-16' onClick={playAgainHandler}>
        Play again
      </button>

      <div className='divider divider-neutral'>OR</div>

      <button className='btn btn-sm btn-outline min-w-60 text-xl h-12' onClick={goHomeHandler}>
        Return to homepage
      </button>
    </div>
  );
};
