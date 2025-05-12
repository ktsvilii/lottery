import { ChangeEvent, FC, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAdmin } from '../../hooks';
import { Stats, TicketsTable } from '../../components';
import { preventNonNumericInput } from '../../utils';

export const Admin: FC = () => {
  const navigate = useNavigate();

  const { isAdmin, allTickets } = useAdmin();
  const [fundJackpotAmount, setFundJackpotAmount] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const fundJackpotAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFundJackpotAmount(e.target.value);
  };

  return (
    <>
      <h1 className='text-3xl text-center'>
        <strong>Admin panel</strong>
      </h1>
      <div className='max-w-12xl mx-auto grid grid-cols-1 xl:grid-cols-5 lg:mt-10'>
        <div className='max-w-8xl md:col-span-3 space-y-5 place-items-center'>
          <TicketsTable tickets={allTickets} />
        </div>
        <div className='md:col-span-1 ml-5'>
          <Stats tickets={allTickets} />
        </div>
        <div className='md:col-span-1'>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={fundJackpotAmount}
                onChange={fundJackpotAmountHandler}
                onKeyDown={preventNonNumericInput}
                placeholder='ETH'
                className='input input-xl text-md p-2 max-w-30'
              />
              <button
                className='btn btn-outline btn-success btn-lg max-w-40 w-full h-14 px-2'
                disabled={!fundJackpotAmount}
              >
                Fund Jackpot
              </button>
            </div>

            <button className='btn btn-outline btn-info btn-lg max-w-72 h-14 px-2'>Withdraw owner balance</button>

            <button className='btn btn-outline btn-info btn-lg max-w-72 h-14 px-2'>Withdraw operation balance</button>
            <button className='btn btn-outline btn-error btn-lg max-w-72 h-14 px-2'>Withdraw Jackpot</button>
          </div>
        </div>
      </div>
    </>
  );
};
