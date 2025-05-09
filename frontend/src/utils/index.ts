import { useStepper } from '../providers';
import { TicketStatus } from '../types';

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
