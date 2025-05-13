import { FC, useState } from 'react';

import { Ticket } from '@types';
import { ScrollableContainer, TicketCard } from '@components';
import { TICKETS_PER_PAGE } from '@constants';

interface TicketListProps {
  tickets: Ticket[];
}

export const TicketList: FC<TicketListProps> = ({ tickets }) => {
  const [visibleCount, setVisibleCount] = useState(TICKETS_PER_PAGE);

  const visibleTickets = tickets.slice(0, visibleCount);

  if (!tickets.length) return <div>No tickets to display</div>;

  return (
    <ScrollableContainer className='max-h-[520px]' onScrollEnd={() => setVisibleCount(prev => prev + TICKETS_PER_PAGE)}>
      <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5 text-center'>
        {visibleTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </ScrollableContainer>
  );
};
