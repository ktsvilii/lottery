import { FC } from 'react';
import { SortCols, SortOrder } from '../../types';
import { ArrowUpIcon } from './ArrowUpIcon';
import { ArrowDownIcon } from './ArrowDownIcon';

interface Props {
  sortKey: SortCols;
  sortOrder: SortOrder;
  onSort: (key: SortCols) => void;
  toggleOrder: (fn: (prev: SortOrder) => SortOrder) => void;
}

export const TicketsTableHeader: FC<Props> = ({ sortKey, sortOrder, onSort, toggleOrder }) => {
  const renderSortArrow = (key: string) => {
    if (sortKey !== key) return null;
    return sortOrder === SortOrder.ASC ? <ArrowUpIcon /> : <ArrowDownIcon />;
  };

  const handleSort = (key: SortCols) => {
    if (sortKey === key) {
      toggleOrder(prev => (prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC));
    } else {
      onSort(key);
      toggleOrder(() => SortOrder.ASC);
    }
  };

  return (
    <thead className='sticky top-0 z-10 bg-neutral text-white'>
      <tr>
        <th className='min-w-[90px] cursor-pointer' onClick={() => handleSort(SortCols.ID)}>
          <span className='inline-flex items-center gap-1'>Ticket #{renderSortArrow(SortCols.ID)}</span>
        </th>

        <th className='min-w-[170px]'>Owner</th>

        <th className='min-w-[90px] cursor-pointer text-right' onClick={() => handleSort(SortCols.MATCHING_NUMBERS)}>
          <span className='inline-flex items-center justify-end gap-1 w-full'>
            Matched{renderSortArrow(SortCols.MATCHING_NUMBERS)}
          </span>
        </th>

        <th className='min-w-[110px] cursor-pointer text-right' onClick={() => handleSort(SortCols.POTENTIAL_REWARD)}>
          <span className='inline-flex items-center justify-end gap-1 w-full'>
            Reward (ETH){renderSortArrow(SortCols.POTENTIAL_REWARD)}
          </span>
        </th>

        <th className='min-w-[90px] text-center'>Is claimed</th>
      </tr>
    </thead>
  );
};
