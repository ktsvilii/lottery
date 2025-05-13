import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Loader } from '@components';

interface ButtonContentProps {
  isRewardClaimed: boolean;
  isClaimingRewards: boolean;
  claimRewardHandler: () => void;
}

export const ButtonContent: FC<ButtonContentProps> = ({ isRewardClaimed, isClaimingRewards, claimRewardHandler }) => {
  const { t } = useTranslation();
  const buttonTitle = t(`game.step_4.reward${isRewardClaimed ? '' : '_not'}_claimed`);
  return (
    <>
      {isRewardClaimed ? (
        <button disabled className='btn btn-neutral'>
          {buttonTitle}
        </button>
      ) : (
        <button
          disabled={isClaimingRewards}
          className='btn btn-neutral shadow-none hover:bg-white hover:text-black'
          onClick={claimRewardHandler}
        >
          {isClaimingRewards ? <Loader size='xl' /> : buttonTitle}
        </button>
      )}
    </>
  );
};
