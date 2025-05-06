import { FC } from 'react';

import { useBuyTicket } from './useBuyTicket';
import { useFetchTickets } from '../../../hooks';

import { Loader } from '../../Loader';

export const BuyTicketStep: FC = () => {
  const { isPurchasingTicket, buyTicketHandler } = useBuyTicket();
  const { goToTicketsPage } = useFetchTickets();

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20 pt-8'>
      <h1 className='text-3xl text-center'>
        <strong>Step 1.</strong> Purchase an ETHery ticket
      </h1>
      <button
        className='btn btn-sm btn-outline min-w-72 text-xl h-16'
        disabled={isPurchasingTicket}
        onClick={buyTicketHandler}
      >
        {isPurchasingTicket ? <Loader size='xl' /> : 'Buy now'}
      </button>

      <div className='divider divider-neutral'>OR</div>

      <p>Check if you have any active tickets</p>
      <button className='btn btn-sm btn-outline min-w-60 text-xl h-12' onClick={goToTicketsPage}>
        Check active tickets
      </button>
    </div>
  );
};
