export enum TicketStatus {
  REWARD_CLAIMED = 'Reward claimed',
  READY_TO_CHECK_RESULTS = 'Ready to check results',
  COMBINATION_SUBMITTED = 'Combination submitted',
  PURCHASED = 'Purchased',
}

export enum TicketTabStatus {
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
