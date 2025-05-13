export const Lottery_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_subscriptionId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'have',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'want',
        type: 'address',
      },
    ],
    name: 'OnlyCoordinatorCanFulfill',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'have',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'coordinator',
        type: 'address',
      },
    ],
    name: 'OnlyOwnerOrCoordinator',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'vrfCoordinator',
        type: 'address',
      },
    ],
    name: 'CoordinatorSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Distribute',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'FundJackpot',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'JackpotWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'OperationsBalanceWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'OwnerBalanceWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[5]',
        name: 'combination',
        type: 'uint256[5]',
      },
    ],
    name: 'PlayerCombinationSubmitted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
    ],
    name: 'RandomNumberGenerated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RewardClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'ticketNumber',
        type: 'uint256',
      },
    ],
    name: 'TicketPurchased',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: 'CALLBACK_GAS_LIMIT',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NUMBER_OF_WORDS',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NUMBER_RANGE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REQUEST_CONFIRMATIONS',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TICKET_PRICE_WEI',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allTicketIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buyBatchTickets',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'purchaseTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'playerCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'winningCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint8',
            name: 'matchingNumbers',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'potentialReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actualReward',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isRewardClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'playerCombinationSubmitted',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'winningCombinationGenerated',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'randomNumberRequested',
            type: 'bool',
          },
        ],
        internalType: 'struct Lottery.LotteryTicket[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buyTicket',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'purchaseTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'playerCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'winningCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint8',
            name: 'matchingNumbers',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'potentialReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actualReward',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isRewardClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'playerCombinationSubmitted',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'winningCombinationGenerated',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'randomNumberRequested',
            type: 'bool',
          },
        ],
        internalType: 'struct Lottery.LotteryTicket[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'count',
        type: 'uint8',
      },
    ],
    name: 'buyTickets',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'purchaseTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'playerCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'winningCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint8',
            name: 'matchingNumbers',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'potentialReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actualReward',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isRewardClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'playerCombinationSubmitted',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'winningCombinationGenerated',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'randomNumberRequested',
            type: 'bool',
          },
        ],
        internalType: 'struct Lottery.LotteryTicket[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
    ],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'fundJackpot',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllTickets',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'purchaseTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'playerCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'winningCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint8',
            name: 'matchingNumbers',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'potentialReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actualReward',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isRewardClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'playerCombinationSubmitted',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'winningCombinationGenerated',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'randomNumberRequested',
            type: 'bool',
          },
        ],
        internalType: 'struct Lottery.LotteryTicket[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getJackpot',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPlayerTickets',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'purchaseTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'playerCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'winningCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint8',
            name: 'matchingNumbers',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'potentialReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actualReward',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isRewardClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'playerCombinationSubmitted',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'winningCombinationGenerated',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'randomNumberRequested',
            type: 'bool',
          },
        ],
        internalType: 'struct Lottery.LotteryTicket[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
    ],
    name: 'getTicketById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'purchaseTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256[5]',
            name: 'playerCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'winningCombination',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint8',
            name: 'matchingNumbers',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'potentialReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actualReward',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isRewardClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'playerCombinationSubmitted',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'winningCombinationGenerated',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'randomNumberRequested',
            type: 'bool',
          },
        ],
        internalType: 'struct Lottery.LotteryTicket',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'jackpot',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextTicketId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'playerTicketIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'randomWords',
        type: 'uint256[]',
      },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'requestIdToTicketId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 's_vrfCoordinator',
    outputs: [
      {
        internalType: 'contract IVRFCoordinatorV2Plus',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vrfCoordinator',
        type: 'address',
      },
    ],
    name: 'setCoordinator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'ticketId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[5]',
        name: 'playerCombination',
        type: 'uint256[5]',
      },
    ],
    name: 'submitCombination',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tickets',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'purchaseTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'matchingNumbers',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'potentialReward',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'actualReward',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isRewardClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'playerCombinationSubmitted',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'winningCombinationGenerated',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'randomNumberRequested',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawJackpot',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawOperationsBalance',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawOwnerBalance',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
