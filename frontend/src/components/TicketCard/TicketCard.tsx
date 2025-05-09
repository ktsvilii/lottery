import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Ticket, TicketStatus } from '../../types';
import { useGameContext } from '../../providers';
import { getTicketStatus, setStepByTicketStatus } from '../../utils';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();

  const { id, playerCombination, playerCombinationSubmitted, isRewardClaimed, winningCombinationGenerated } = ticket;

  const { setTicketState } = useGameContext();

  const displayedCombination = playerCombinationSubmitted ? playerCombination.join(', ') : '—';

  const ticketStatus = getTicketStatus(isRewardClaimed, winningCombinationGenerated, playerCombinationSubmitted);

  const handleTicketClick = (ticketStatus: TicketStatus) => {
    setTicketState(ticket);
    setStepByTicketStatus(ticketStatus);
    navigate('/game');
  };

  const getBgColor = () => {
    if (isRewardClaimed) return 'bg-green-600';
    if (winningCombinationGenerated) return 'bg-yellow-600';
    return 'bg-black';
  };

  return (
    <div
      className={
        'grid grid-cols-[auto,1fr] border border-gray-100 min-w-72 rounded overflow-hidden transition-opacity cursor-pointer'
      }
      onClick={() => handleTicketClick(ticketStatus)}
    >
      <div className='bg-black text-white p-4 border-r-1 border-white'>
        <div className='md:text-lg text-sm font-medium'>Ticket number</div>
        <div className='text-2xl font-bold'>{id}</div>
      </div>

      <div className='text-black bg-white p-4'>
        <div className='md:text-lg text-sm font-medium'>Your combination</div>
        <div className='text-2xl font-bold'>{displayedCombination}</div>
      </div>

      <div className={`col-span-2 px-4 py-2 text-white text-md border-t-1 border-white ${getBgColor()}`}>
        <strong>Status:</strong> <span>{ticketStatus}</span>
      </div>
    </div>
  );
};
