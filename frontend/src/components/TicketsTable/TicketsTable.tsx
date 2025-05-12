import { FC, useState } from 'react';
import { SortCols, SortOrder, Ticket } from '../../types';
import { ROWS_PER_PAGE } from '../../constants/constants';
import { Loader } from '../Loader';
import { filterTickets, sortTickets } from '../../utils';
import { TicketsTableFilter } from './TicketsTableFilter';
import { TicketsTableHeader } from './TicketsTableHeader';
import { TicketsTableRow } from './TicketsTableRow';
import { ScrollableContainer } from '../ScrollableContainer';

interface TicketsTableProps {
  tickets: Ticket[];
}

export const TicketsTable: FC<TicketsTableProps> = ({ tickets }) => {
  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE);
  const [copiedId, setCopiedId] = useState<bigint | null>(null);
  const [sortKey, setSortKey] = useState<SortCols>(SortCols.ID);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [filterText, setFilterText] = useState('');

  const sortedTickets = sortTickets(tickets, sortKey, sortOrder);
  const filteredTickets = filterTickets(sortedTickets, filterText);
  const visibleTickets = filteredTickets.slice(0, visibleCount);

  return (
    <div className='w-full overflow-x-auto'>
      <TicketsTableFilter
        value={filterText}
        onChange={text => {
          setFilterText(text);
          setVisibleCount(ROWS_PER_PAGE);
        }}
      />

      <ScrollableContainer className='max-h-[500px]' onScrollEnd={() => setVisibleCount(prev => prev + ROWS_PER_PAGE)}>
        <table className='table-auto table table-zebra w-full'>
          <TicketsTableHeader sortKey={sortKey} sortOrder={sortOrder} onSort={setSortKey} toggleOrder={setSortOrder} />

          <tbody>
            {visibleTickets.map(ticket => (
              <TicketsTableRow
                key={ticket.id.toString()}
                ticket={ticket}
                copiedId={copiedId}
                onCopy={id => {
                  navigator.clipboard.writeText(ticket.owner);
                  setCopiedId(id);
                  setTimeout(() => setCopiedId(null), 800);
                }}
              />
            ))}
          </tbody>
        </table>
        {visibleCount < filteredTickets.length && (
          <div className='py-4 text-center'>
            <Loader size='lg' />
          </div>
        )}
      </ScrollableContainer>
    </div>
  );
};
