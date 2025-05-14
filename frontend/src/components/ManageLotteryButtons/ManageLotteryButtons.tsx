import { ChangeEvent, FC, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { preventNonNumericInput } from '../../utils';
import { Loader } from '../Loader';

import { useManageLotteryButtons } from './useManageLotteryButtons';

const tKey = 'admin_panel.manage_buttons';

type ActionButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  label: string;
  className?: string;
};

const ActionButton: FC<ActionButtonProps> = ({ onClick, isLoading, label, className }) => (
  <button onClick={onClick} disabled={isLoading} className={`btn btn-outline btn-lg w-72 sm:h-14 px-2 ${className}`}>
    {isLoading ? <Loader size='xl' /> : label}
  </button>
);

export const ManageLotteryButtons: FC = () => {
  const { t } = useTranslation();
  const [fundAmount, setFundAmount] = useState('');

  const {
    isFundingJackpot,
    isWithdrawingJackpot,
    isWithdrawingOwnerBalance,
    isWithdrawingOperationalBalance,
    fundJackpotHandler,
    withdrawJackpotHandler,
    withdrawOwnerBalanceHandler,
    withdrawOperationalBalanceHandler,
  } = useManageLotteryButtons();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFundAmount(e.target.value);
  };

  const handleFundJackpot = async () => {
    if (!fundAmount) return;

    try {
      await fundJackpotHandler(fundAmount);
      setFundAmount('');
    } catch (err) {
      console.error('Invalid jackpot amount', err);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='join w-72'>
        <input
          className='input sm:input-xl input-lg text-md p-2 join-item'
          placeholder='ETH'
          value={fundAmount}
          onChange={handleInputChange}
          onKeyDown={preventNonNumericInput}
        />
        <button
          onClick={handleFundJackpot}
          disabled={!fundAmount || isFundingJackpot}
          className='btn btn-outline btn-success btn-lg w-48 sm:h-14 px-2 join-item'
        >
          {isFundingJackpot ? <Loader size='xl' /> : t(`${tKey}.fund_jackpot`)}
        </button>
      </div>

      <ActionButton
        onClick={withdrawOwnerBalanceHandler}
        isLoading={isWithdrawingOwnerBalance}
        label={t(`${tKey}.withdraw_owner`)}
        className='btn-info'
      />

      <ActionButton
        onClick={withdrawOperationalBalanceHandler}
        isLoading={isWithdrawingOperationalBalance}
        label={t(`${tKey}.withdraw_operational`)}
        className='btn-info'
      />

      <ActionButton
        onClick={withdrawJackpotHandler}
        isLoading={isWithdrawingJackpot}
        label={t(`${tKey}.withdraw_jackpot`)}
        className='btn-error'
      />
    </div>
  );
};
