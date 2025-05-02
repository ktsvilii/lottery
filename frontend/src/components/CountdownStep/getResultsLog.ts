import { Log, decodeEventLog } from 'viem';

interface LotteryResults {
  playerCombination: [bigint, bigint, bigint, bigint, bigint];
  winningCombination: [bigint, bigint, bigint, bigint, bigint];
  matchingNumbers: number;
  rewardAmount: bigint;
}

interface LotteryResultsArgs extends LotteryResults {
  owner: `0x${string}`;
  ticketNumber: bigint;
}

const eventAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'ticketNumber', type: 'uint256' },
      { indexed: false, internalType: 'uint256[5]', name: 'playerCombination', type: 'uint256[5]' },
      { indexed: false, internalType: 'uint256[5]', name: 'winningCombination', type: 'uint256[5]' },
      { indexed: false, internalType: 'uint8', name: 'matchingNumbers', type: 'uint8' },
      { indexed: true, internalType: 'uint256', name: 'rewardAmount', type: 'uint256' },
    ],
    name: 'LotteryResults',
    type: 'event',
  },
];

export function getResultsLog(logs: Log[]): LotteryResults {
  for (const log of logs) {
    try {
      const parsed = decodeEventLog({
        abi: eventAbi,
        data: log.data,
        topics: log.topics,
      });

      console.log(parsed);

      if (parsed.eventName === 'LotteryResults' && parsed.args) {
        const { playerCombination, winningCombination, rewardAmount, matchingNumbers } =
          parsed.args as unknown as LotteryResultsArgs;

        return {
          playerCombination,
          winningCombination,
          rewardAmount,
          matchingNumbers,
        };
      }
    } catch (err) {
      console.error('Error parsing event log:', err);
      continue;
    }
  }

  throw new Error('LotteryResults event not found in logs');
}
