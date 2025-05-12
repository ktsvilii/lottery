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

export type Theme = 'light' | 'black';
