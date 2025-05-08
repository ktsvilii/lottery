export interface Ticket {
  id: number;
  owner: string;
  purchaseTimestamp: Date;
  playerCombination: number[];
  winningCombination: number[];
  matchingNumbers: number;
  potentialReward: bigint;
  actualReward: bigint | null;
  isRewardClaimed: boolean;
  playerCombinationSubmitted: boolean;
  winningCombinationGenerated: boolean;
  randomNumberRequested: boolean;
}
