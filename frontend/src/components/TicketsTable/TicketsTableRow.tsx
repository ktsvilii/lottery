import { FC } from 'react';

import { formatEther } from 'viem';

import { CheckIcon, CopyIcon } from '@assets';
import { Ticket } from '@types';

interface TicketsTableProps {
  ticket: Ticket;
  copiedId: bigint | null;
  onCopy: (id: bigint) => void;
}

export const TicketsTableRow: FC<TicketsTableProps> = ({ ticket, copiedId, onCopy }) => {
  const { id, owner, matchingNumbers, potentialReward, isRewardClaimed } = ticket;
  return (
    <tr>
      <th>{id.toString()}</th>
      <td className='flex items-center gap-2'>
        <span>{`${owner.slice(0, 5)}...${owner.slice(-5)}`}</span>
        <button
          onClick={() => onCopy(id)}
          className='text-gray-400 text-sm flex items-center gap-1'
          title='Copy to clipboard'
        >
          {copiedId === id ? 'Copied' : <CopyIcon />}
        </button>
      </td>
      <td className='text-right'>{matchingNumbers}</td>
      <td className='text-right'>{formatEther(potentialReward)}</td>
      <td className='flex justify-center'>{isRewardClaimed ? <CheckIcon /> : null}</td>
    </tr>
  );
};
