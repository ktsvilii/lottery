import { useStepper } from '../providers';
import { SortCols, SortOrder, Ticket, TicketStatus } from '../types';

export const getTicketStatus = (
  potentialReward: bigint,
  isRewardClaimed: boolean,
  winningCombinationGenerated: boolean,
  playerCombinationSubmitted: boolean,
): TicketStatus => {
  if (isRewardClaimed) return TicketStatus.REWARD_CLAIMED;
  if (!isRewardClaimed && potentialReward > 0n) return TicketStatus.REWARD_AVAILABLE;
  if (playerCombinationSubmitted && !winningCombinationGenerated) return TicketStatus.WAITING_FOR_RESULTS;
  if (potentialReward === 0n && playerCombinationSubmitted) return TicketStatus.NO_REWARD;
  if (playerCombinationSubmitted) return TicketStatus.COMBINATION_SUBMITTED;
  return TicketStatus.PURCHASED;
};

export const setStepByTicketStatus = (ticketStatus: TicketStatus) => {
  const { setCurrentStep } = useStepper.getState();

  switch (ticketStatus) {
    case TicketStatus.REWARD_CLAIMED:
    case TicketStatus.REWARD_AVAILABLE:
    case TicketStatus.NO_REWARD:
      setCurrentStep(3);
      break;
    case TicketStatus.COMBINATION_SUBMITTED:
    case TicketStatus.WAITING_FOR_RESULTS:
      setCurrentStep(2);
      break;
    case TicketStatus.PURCHASED:
      setCurrentStep(1);
      break;
    default:
      return;
  }
};

export const sortTickets = (tickets: Ticket[], key: SortCols, order: SortOrder): Ticket[] => {
  return [...tickets].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === 'bigint' && typeof bVal === 'bigint') {
      return order === SortOrder.ASC ? Number(aVal - bVal) : Number(bVal - aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === SortOrder.ASC ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
};

export const filterTickets = (tickets: Ticket[], query: string): Ticket[] => {
  const q = query.toLowerCase();
  return tickets.filter(ticket => {
    return ticket.id.toString().includes(q) || ticket.owner.toLowerCase().includes(q);
  });
};

export const preventNonNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
  if (!/^\d|\.$/.test(e.key)) e.preventDefault();
};
