export enum TicketStatus {
  REWARD_AVAILABLE = 'Reward available',
  REWARD_CLAIMED = 'Reward claimed',
  NO_REWARD = 'No reward',
  COMBINATION_SUBMITTED = 'Combination submitted',
  WAITING_FOR_RESULTS = 'Waiting for result',
  PURCHASED = 'Purchased',
}

export enum TicketTabStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  REWARDS_CLAIMED = 'Rewards claimed',
  REWARDS_AVAILABLE = 'Rewards available',
  NO_REWARD = 'No rewards',
}

export enum SortCols {
  ID = 'id',
  MATCHING_NUMBERS = 'matchingNumbers',
  POTENTIAL_REWARD = 'potentialReward',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desk',
}
