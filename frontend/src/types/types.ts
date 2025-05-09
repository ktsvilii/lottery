export interface Ticket {
  id: bigint;
  owner: string;
  purchaseTimestamp: Date;
  playerCombination: number[];
  winningCombination: number[];
  matchingNumbers: number;
  potentialReward: bigint;
  actualReward: bigint;
  isRewardClaimed: boolean;
  playerCombinationSubmitted: boolean;
  winningCombinationGenerated: boolean;
  randomNumberRequested: boolean;
}

export enum TicketTabStatus {
  ACTIVE = 'Active',
  REWARDS_CLAIMED = 'Rewards claimed',
  REWARDS_AVAILABLE = 'Rewards available',
  NO_REWARD = 'No rewards',
}
