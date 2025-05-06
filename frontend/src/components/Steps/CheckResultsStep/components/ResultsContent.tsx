import { FC } from 'react';

import { formatEther } from 'viem';

import { ButtonContent } from './ButtonContent';

interface ResultsContentProps {
  reward: bigint | null;
  matchingNumbers: number;
  isRewardClaimed: boolean;
  isClaimingRewards: boolean;
  claimRewardHandler: () => void;
}

export const ResultsContent: FC<ResultsContentProps> = ({
  reward,
  matchingNumbers,
  isRewardClaimed,
  isClaimingRewards,
  claimRewardHandler,
}) => {
  return (
    <>
      {reward ? (
        <div className='container flex flex-col gap-3'>
          <p>
            You matched {matchingNumbers} number{matchingNumbers !== 1 && 's'}. Your reward is {formatEther(reward)}{' '}
            ETH.
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
