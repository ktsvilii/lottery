export interface Ticket {
  id: number;
  owner: string;
  purchaseTimestamp: Date;
  playerCombination: number[];
  winningCombination: number[];
  matchingNumbers: number;
  reward: bigint | null;
  isRewardClaimed: boolean;
  playerCombinationSubmitted: boolean;
  winningCombinationGenerated: boolean;
}
