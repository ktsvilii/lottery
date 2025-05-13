import { FC } from 'react';

import { Loader } from '@components';

interface ButtonContentProps {
  isRewardClaimed: boolean;
  isClaimingRewards: boolean;
  claimRewardHandler: () => void;
}

export const ButtonContent: FC<ButtonContentProps> = ({ isRewardClaimed, isClaimingRewards, claimRewardHandler }) => {
  return (
    <>
      {isRewardClaimed ? (
        <button disabled className='btn btn-neutral'>
          Reward is already claimed
        </button>
      ) : (
        <button
          disabled={isClaimingRewards}
          className='btn btn-neutral shadow-none hover:bg-white hover:text-black'
          onClick={claimRewardHandler}
        >
          {isClaimingRewards ? <Loader size='xl' /> : 'Claim Reward'}
        </button>
      )}
    </>
  );
};
