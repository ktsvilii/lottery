import { FC, JSX, ReactNode, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Ticket } from '../../../types';
import { Loader, TicketCard } from '../../../components';
import { TICKETS_PER_PAGE } from '../../../constants/constants';

interface TicketListProps {
  tickets: Ticket[];
}

interface InfiniteScrollProps {
  dataLength: number;
  next: () => void;
  hasMore: boolean;
  loader: JSX.Element;
  scrollableTarget: string;
  scrollThreshold: number;
  children: ReactNode;
}

export const TicketList: FC<TicketListProps> = ({ tickets }) => {
  const InfiniteScrollComponent = InfiniteScroll as unknown as React.FC<InfiniteScrollProps>;

  const [visibleCount, setVisibleCount] = useState(TICKETS_PER_PAGE);

  const loadMore = () => {
    setVisibleCount(prev => prev + TICKETS_PER_PAGE);
  };

  const visibleTickets = tickets.slice(0, visibleCount);
  const hasMore = visibleTickets.length < tickets.length;

  if (!tickets.length) return <div>No tickets to display</div>;

  return (
    <div id='scrollableContainer' className='max-h-[420px] md:max-h-[450px] overflow-y-auto'>
      <InfiniteScrollComponent
        dataLength={visibleTickets.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Loader size='lg' />}
        scrollableTarget='scrollableContainer'
        scrollThreshold={0.9}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5 text-center'>
          {visibleTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </InfiniteScrollComponent>
    </div>
  );
};
