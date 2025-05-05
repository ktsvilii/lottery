import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFetchTickets } from '../../hooks';
import { Loader } from '../../components';
import { TicketCard } from '../../components/TicketCard';

export const Tickets: FC = () => {
  const navigate = useNavigate();
  const { tickets, isFetchingTickets, fetchUserTicketsHandler } = useFetchTickets();

  useEffect(() => {
    fetchUserTicketsHandler();
  }, []);

  const goBack = () => navigate(-1);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow'>
        {isFetchingTickets ? (
          <div className='flex items-center justify-center h-full w-full'>
            <Loader size='xl' />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20 pt-8'>
            <h1 className='text-3xl text-center mb-5'>
              <strong>Your tickets</strong>
            </h1>

            {tickets?.length ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5 text-center'>
                {tickets?.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <div>You have no tickets</div>
            )}

            <button className='btn btn-sm btn-outline min-w-72 text-xl h-16' onClick={goBack}>
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
