import { FC } from 'react';

import { Ticket } from '../../../types';

import { TicketCard } from '../../../components';

interface TicketListProps {
  tickets: Ticket[];
}

export const TicketList: FC<TicketListProps> = ({ tickets }) => {
  if (!tickets.length) return <div>No tickets to display</div>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5 text-center'>
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
