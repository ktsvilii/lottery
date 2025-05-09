import { TicketStatus } from '../types';

export const getTicketStatus = (
  isRewardClaimed: boolean,
  winningCombinationGenerated: boolean,
  playerCombinationSubmitted: boolean,
): TicketStatus => {
  if (isRewardClaimed) return TicketStatus.REWARD_CLAIMED;
  if (winningCombinationGenerated) return TicketStatus.READY_TO_CHECK_RESULTS;
  if (playerCombinationSubmitted) return TicketStatus.COMBINATION_SUBMITTED;
  return TicketStatus.PURCHASED;
};
