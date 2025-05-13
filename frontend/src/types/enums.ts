export enum TicketStatus {
  REWARD_AVAILABLE = 'reward_available',
  REWARD_CLAIMED = 'reward_claimed',
  NO_REWARD = 'no_reward',
  COMBINATION_SUBMITTED = 'combination_submitted',
  WAITING_FOR_RESULTS = 'waiting_for_result',
  PURCHASED = 'purchased',
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
