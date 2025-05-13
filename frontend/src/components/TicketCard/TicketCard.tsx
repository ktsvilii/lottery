import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useGameContext } from '../../providers';
import { Ticket, TicketStatus } from '../../types';
import { getTicketStatus, setStepByTicketStatus } from '../../utils';

interface TicketCardProps {
  ticket: Ticket;
}

const tKey = 'tickets.ticket_card';

export const TicketCard: FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    id,
    playerCombination,
    playerCombinationSubmitted,
    isRewardClaimed,
    winningCombinationGenerated,
    potentialReward,
  } = ticket;

  const { setTicketState } = useGameContext();

  const displayedCombination = playerCombinationSubmitted ? playerCombination.join(', ') : '—';

  const isRewardAvailable = !isRewardClaimed && potentialReward > 0n;
  const hasNoReward = potentialReward === 0n && playerCombinationSubmitted;
  const waitingForResult = playerCombinationSubmitted && !winningCombinationGenerated;

  const ticketStatus = getTicketStatus(
    potentialReward,
    isRewardClaimed,
    winningCombinationGenerated,
    playerCombinationSubmitted,
  );

  const handleTicketClick = (ticketStatus: TicketStatus) => {
    setTicketState(ticket);
    setStepByTicketStatus(ticketStatus);
    navigate('/game');
  };

  const getBgColor = () => {
    if (isRewardClaimed) return 'bg-green-700';
    if (waitingForResult) return 'bg-gray-400';
    if (hasNoReward) return 'bg-gray-600';
    if (isRewardAvailable) return 'bg-green-500';
    if (winningCombinationGenerated) return 'bg-yellow-500';
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
        <div className='md:text-lg text-sm font-medium'>{t(`${tKey}.ticket_number`)}</div>
        <div className='text-2xl font-bold'>{id}</div>
      </div>

      <div className='text-black bg-white p-4'>
        <div className='md:text-lg text-sm font-medium'>{t(`${tKey}.player_combi`)}</div>
        <div className='text-2xl font-bold'>{displayedCombination}</div>
      </div>

      <div className={`col-span-2 px-4 py-2 text-white text-md border-t-1 border-white ${getBgColor()}`}>
        <strong>{t(`${tKey}.status_label`)}</strong> <span>{t(`${tKey}.statuses.${ticketStatus}`)}</span>
      </div>
    </div>
  );
};
