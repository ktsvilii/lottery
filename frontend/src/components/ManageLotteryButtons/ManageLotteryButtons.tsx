import { ChangeEvent, FC, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useAdmin } from '../../hooks';
import { preventNonNumericInput } from '../../utils';
import { Loader } from '../Loader';

const tKey = 'admin_panel.manage_buttons';

export const ManageLotteryButtons: FC = () => {
  const { t } = useTranslation();

  const [fundJackpotAmount, setFundJackpotAmount] = useState('');

  const {
    isFundingJackpot,
    isWithdrawingJackpot,
    isWithdrawingOwnerBalance,
    isWithdrawingOperationalBalance,
    fundJackpotHandler,
    withdrawJackpotHandler,
    withdrawOwnerBalanceHandler,
    withdrawOperationalBalanceHandler,
  } = useAdmin();

  const fundJackpotAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFundJackpotAmount(e.target.value);
  };

  const handleFundJackpot = async () => {
    if (!fundJackpotAmount) return;

    try {
      await fundJackpotHandler(fundJackpotAmount);
      setFundJackpotAmount('');
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
          value={fundJackpotAmount}
          onChange={fundJackpotAmountHandler}
          onKeyDown={preventNonNumericInput}
        />
        <button
          onClick={handleFundJackpot}
          disabled={!fundJackpotAmount}
          className='btn btn-outline btn-success btn-lg w-48 sm:h-14 px-2 join-item'
        >
          {isFundingJackpot ? <Loader size='xl' /> : t(`${tKey}.fund_jackpot`)}
        </button>
      </div>
      <button onClick={withdrawOwnerBalanceHandler} className='btn btn-outline btn-info btn-lg w-72 sm:h-14 px-2'>
        {isWithdrawingOwnerBalance ? <Loader size='xl' /> : t(`${tKey}.withdraw_owner`)}
      </button>
      <button onClick={withdrawOperationalBalanceHandler} className='btn btn-outline btn-info btn-lg w-72 sm:h-14 px-2'>
        {isWithdrawingOperationalBalance ? <Loader size='xl' /> : t(`${tKey}.withdraw_operational`)}
      </button>
      <button onClick={withdrawJackpotHandler} className='btn btn-outline btn-error btn-lg w-72 sm:h-14 px-2'>
        {isWithdrawingJackpot ? <Loader size='xl' /> : t(`${tKey}.withdraw_jackpot`)}
      </button>
    </div>
  );
};
