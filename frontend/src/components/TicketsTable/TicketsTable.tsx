import { FC, JSX, ReactNode, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { formatEther } from 'viem';

import { Ticket } from '../../types';
import { ROWS_PER_PAGE } from '../../constants/constants';
import { Loader } from '../Loader';

interface TicketsTable {
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

export const TicketsTable: FC<TicketsTable> = ({ tickets }) => {
  const InfiniteScrollComponent = InfiniteScroll as unknown as React.FC<InfiniteScrollProps>;

  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE);

  const loadMore = () => {
    setVisibleCount(prev => prev + ROWS_PER_PAGE);
  };

  if (!tickets.length) return <div>No tickets to display</div>;

  const visibleTickets = tickets.slice(0, visibleCount);
  const hasMore = visibleTickets.length < tickets.length;

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
        <table className='table table-zebra'>
          <thead className='bg-neutral text-white'>
            <tr>
              <th>Ticket #</th>
              <th>Owner</th>
              <th>Matching numbers</th>
              <th>Potential reward (ETH)</th>
              <th>Actual reward (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {tickets?.map(({ id, owner, matchingNumbers, potentialReward, actualReward }) => (
              <tr key={id}>
                <th>{id}</th>
                <td>{owner}</td>
                <td>{matchingNumbers}</td>
                <td>{formatEther(potentialReward)}</td>
                <td>{formatEther(actualReward)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScrollComponent>
    </div>
  );
};
