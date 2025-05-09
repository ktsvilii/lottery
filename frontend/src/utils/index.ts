import { useStepper } from '../providers';
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

export const setStepByTicketStatus =
  (ticketStatus: TicketStatus) => {
    const {setCurrentStep} = useStepper.getState();
    
    switch (ticketStatus) {
      case TicketStatus.REWARD_CLAIMED:
      case TicketStatus.READY_TO_CHECK_RESULTS:
        setCurrentStep(3);
        break;
      case TicketStatus.COMBINATION_SUBMITTED:
        setCurrentStep(2);
        break;
      case TicketStatus.PURCHASED:
        setCurrentStep(1);
        break;
      default:
        return;
    }
  };
