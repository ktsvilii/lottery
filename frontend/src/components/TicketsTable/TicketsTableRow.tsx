import { FC } from 'react';
import { formatEther } from 'viem';
import { Ticket } from '../../types';
import { CopyIcon } from './CopyIcon';
import { CheckIcon } from './CheckIcon';

interface Props {
  ticket: Ticket;
  copiedId: bigint | null;
  onCopy: (id: bigint) => void;
}

export const TicketsTableRow: FC<Props> = ({ ticket, copiedId, onCopy }) => {
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
