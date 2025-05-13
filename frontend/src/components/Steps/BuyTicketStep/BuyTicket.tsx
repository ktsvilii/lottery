import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Loader } from '@components';

import { useBuyTicket } from './useBuyTicket';

export const BuyTicketStep: FC = () => {
  const navigate = useNavigate();
  const { isPurchasingTicket, buyTicketHandler, buyBatchTicketsHandler } = useBuyTicket();

  const goToTicketsPage = () => {
    navigate('/tickets');
  };

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20'>
      <h1 className='text-3xl text-center'>
        <strong>Step 1.</strong> Purchase an ETHery ticket(s)
      </h1>
      <div className='flex flex-col gap-2 md:flex-row'>
        <button
          className='btn btn-sm btn-outline min-w-72 text-xl md:h-16 h-12'
          disabled={isPurchasingTicket}
          onClick={buyTicketHandler}
        >
          {isPurchasingTicket ? <Loader size='xl' /> : 'Buy one'}
        </button>

        <button
          className='btn btn-sm btn-outline min-w-72 text-xl md:h-16 h-12'
          disabled={isPurchasingTicket}
          onClick={buyBatchTicketsHandler}
        >
          {isPurchasingTicket ? <Loader size='xl' /> : 'Buy 9, get 1 free'}
        </button>
      </div>

      <div className='divider divider-neutral'>OR</div>

      <p>Check if you have any active tickets</p>
      <button className='btn btn-sm btn-outline min-w-60 text-xl h-10 md:h-12' onClick={goToTicketsPage}>
        Check tickets list
      </button>
    </div>
  );
};
