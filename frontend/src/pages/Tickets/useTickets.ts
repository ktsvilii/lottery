import { Ticket, TicketTabStatus } from '../../types';

export const useTickets = (tickets?: Ticket[]) => {
  return {
    [TicketTabStatus.ACTIVE]:
      tickets?.filter(
        ticket =>
          !ticket.playerCombinationSubmitted ||
          (ticket.playerCombinationSubmitted && !ticket.winningCombinationGenerated),
      ) || [],
    [TicketTabStatus.REWARDS_CLAIMED]: tickets?.filter(ticket => ticket.isRewardClaimed) || [],
    [TicketTabStatus.REWARDS_AVAILABLE]:
      tickets?.filter(ticket => !ticket.isRewardClaimed && ticket.potentialReward > 0n) || [],
    [TicketTabStatus.NO_REWARD]:
      tickets?.filter(ticket => ticket.potentialReward === 0n && ticket.playerCombinationSubmitted) || [],
  };
};
