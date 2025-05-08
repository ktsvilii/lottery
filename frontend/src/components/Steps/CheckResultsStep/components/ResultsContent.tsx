import { FC } from 'react';

import { formatEther } from 'viem';

import { ButtonContent } from './ButtonContent';

interface ResultsContentProps {
  potentialReward: bigint | null;
  matchingNumbers: number;
  isRewardClaimed: boolean;
  isClaimingRewards: boolean;
  claimRewardHandler: () => void;
}

export const ResultsContent: FC<ResultsContentProps> = ({
  potentialReward,
  matchingNumbers,
  isRewardClaimed,
  isClaimingRewards,
  claimRewardHandler,
}) => {
  return (
    <>
      {potentialReward ? (
        <div className='container flex flex-col gap-3'>
          <p>
            You matched {matchingNumbers} number{matchingNumbers !== 1 && 's'}. Your reward is{' '}
            {formatEther(potentialReward)} ETH.
          </p>
          <ButtonContent
            isRewardClaimed={isRewardClaimed}
            isClaimingRewards={isClaimingRewards}
            claimRewardHandler={claimRewardHandler}
          />
        </div>
      ) : (
        <p>You have 0 matches. Better luck next time.</p>
      )}
    </>
  );
};
