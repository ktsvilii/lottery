/* eslint-disable prettier/prettier */
export interface Ticket {
  id: number;
  ticketNumber: number;
  owner: string;
  createdAt: Date;
  randomWillBeGeneratedAt: Date;
  status: TicketStatus;
  playerCombination: number[];
  winningCombination: number[];
  matchingNumbers: number;
  rewardAmountWei: string;
}

export enum TicketStatus {
  PURCHASED = 'Purchased',
  COMBINATION_SUBMITTED = 'Combination_submitted',
  RANDOM_GENERATED = 'Random_generated',
  REWARD_CLAIMED = 'Reward_claimed',
}
