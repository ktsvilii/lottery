import { Ticket, TicketTabStatus } from '../../types';

export const useTickets = (tickets?: Ticket[]) => {
  const sortByNewestId = (a: Ticket, b: Ticket) => Number(b.id) - Number(a.id);

  return {
    [TicketTabStatus.ALL]: tickets || [],
    [TicketTabStatus.ACTIVE]:
      tickets
        ?.filter(
          ticket =>
            !ticket.playerCombinationSubmitted ||
            (ticket.playerCombinationSubmitted && !ticket.winningCombinationGenerated),
        )
        .sort(sortByNewestId) || [],
    [TicketTabStatus.REWARDS_CLAIMED]: tickets?.filter(ticket => ticket.isRewardClaimed).sort(sortByNewestId) || [],
    [TicketTabStatus.REWARDS_AVAILABLE]:
      tickets?.filter(ticket => !ticket.isRewardClaimed && ticket.potentialReward > 0n).sort(sortByNewestId) || [],
    [TicketTabStatus.NO_REWARD]:
      tickets
        ?.filter(
          ticket =>
            ticket.potentialReward === 0n && ticket.playerCombinationSubmitted && ticket.winningCombinationGenerated,
        )
        .sort(sortByNewestId) || [],
  };
};
