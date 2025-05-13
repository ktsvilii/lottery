import { FC, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ROWS_PER_PAGE } from '@constants';
import { SortCols, SortOrder, Ticket } from '@types';
import { filterTickets, sortTickets } from '@utils';

import { Loader } from '../Loader';
import { ScrollableContainer } from '../ScrollableContainer';

import { TicketsTableFilter } from './TicketsTableFilter';
import { TicketsTableHeader } from './TicketsTableHeader';
import { TicketsTableRow } from './TicketsTableRow';

interface TicketsTableProps {
  allTickets: Ticket[];
  fetchAllTickets: () => Promise<void>;
}
const tKey = 'admin_panel';

export const TicketsTable: FC<TicketsTableProps> = ({ allTickets, fetchAllTickets }) => {
  const { t } = useTranslation();

  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE);
  const [copiedId, setCopiedId] = useState<bigint | null>(null);
  const [sortKey, setSortKey] = useState<SortCols>(SortCols.ID);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [filterText, setFilterText] = useState('');

  const sortedTickets = sortTickets(allTickets, sortKey, sortOrder);
  const filteredTickets = filterTickets(sortedTickets, filterText);
  const visibleTickets = filteredTickets.slice(0, visibleCount);

  return (
    <div className='w-full overflow-x-auto'>
      <div className='flex justify-between'>
        <TicketsTableFilter
          value={filterText}
          onChange={text => {
            setFilterText(text);
            setVisibleCount(ROWS_PER_PAGE);
          }}
        />
        <button className='btn btn-neutral' onClick={fetchAllTickets}>
          {t(`${tKey}.refresh_stats`)}
        </button>
      </div>

      <ScrollableContainer
        className='max-h-[290px] sm:max-h-[270px] lg:max-h-[400px]'
        onScrollEnd={() => setVisibleCount(prev => prev + ROWS_PER_PAGE)}
      >
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
