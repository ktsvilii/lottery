import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { formatEther } from 'viem';
import { Ticket } from '../../types';
import { ROWS_PER_PAGE } from '../../constants/constants';
import { Loader } from '../Loader';
import { CopyIcon } from './CopyIcon';
import { CheckIcon } from './CheckIcon';

interface TicketsTableProps {
  tickets: Ticket[];
}

export const TicketsTable: FC<TicketsTableProps> = ({ tickets }) => {
  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE);
  const [copiedId, setCopiedId] = useState<bigint | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
    if (nearBottom && visibleCount < tickets.length) {
      setVisibleCount(prev => prev + ROWS_PER_PAGE);
    }
  }, [tickets.length, visibleCount]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', onScroll);
      return () => el.removeEventListener('scroll', onScroll);
    }
  }, [visibleCount, tickets.length, onScroll]);

  const visibleTickets = tickets.slice(0, visibleCount);

  return (
    <div ref={containerRef} className='max-h-[450px] overflow-auto'>
      <table className='table table-zebra table-fixed w-full'>
        <thead className='sticky top-0 z-10 bg-neutral text-white'>
          <tr>
            <th className='w-[10%] min-w-[80px]'>Ticket #</th> {/* Minimum width */}
            <th className='w-[20%] min-w-[150px]'>Owner</th> {/* Minimum width */}
            <th className='w-[10%] min-w-[120px] text-right'>Matched</th> {/* Minimum width */}
            <th className='w-[30%] min-w-[160px] text-right text-wrap'>Reward (ETH)</th> {/* Minimum width */}
            <th className='w-[30%] min-w-[160px] text-right text-wrap'>Is claimed</th> {/* Minimum width */}
          </tr>
        </thead>
        <tbody>
          {visibleTickets.map(({ id, owner, matchingNumbers, potentialReward, isRewardClaimed }) => (
            <tr key={id}>
              <th>{id}</th>
              <td className='flex items-center gap-2'>
                <span>{`${owner.slice(0, 5)}...${owner.slice(-5)}`}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(owner);
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 800);
                  }}
                  className='text-gray-400 text-sm flex items-center gap-1'
                  title='Copy to clipboard'
                >
                  {copiedId === id ? 'Copied' : <CopyIcon />}
                </button>
              </td>
              <td className='text-right'>{matchingNumbers}</td>
              <td className='text-right'>{formatEther(potentialReward)}</td>
              <td className='text-right'>{isRewardClaimed ? <CheckIcon /> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleCount < tickets.length && (
        <div className='py-4 text-center'>
          <Loader size='lg' />
        </div>
      )}
    </div>
  );
};
