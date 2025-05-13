import { FC } from 'react';
import { Trans } from 'react-i18next';

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
            <Trans
              i18nKey={'game.step_4.rewarded_title'}
              values={{
                matchingNumbers,
                sufix: matchingNumbers !== 1 ? 's' : '',
                reward: formatEther(potentialReward),
              }}
            />
          </p>
          <ButtonContent
            isRewardClaimed={isRewardClaimed}
            isClaimingRewards={isClaimingRewards}
            claimRewardHandler={claimRewardHandler}
          />
        </div>
      ) : (
        <p>
          <Trans i18nKey={'game.step_4.not_rewarded_title'} />
        </p>
      )}
    </>
  );
};
