import { Log, parseAbiItem, decodeEventLog } from 'viem';
import { LOTTERY_CONTRACT_ADDRESS } from '../constants';

const randomNumberGeneratedEvent = parseAbiItem(
  'event RandomNumberGenerated(uint256 indexed requestId, uint256 indexed ticketNumber, uint256 number)',
);

export interface RandomNumberGeneratedData {
  ticketNumber: number;
}

export const getRandomNumberGeneratedLog = (logs: Log[]): RandomNumberGeneratedData => {
  for (const log of logs) {
    if (log.address.toLowerCase() !== LOTTERY_CONTRACT_ADDRESS.toLowerCase()) continue;

    try {
      const parsed = decodeEventLog({
        abi: [randomNumberGeneratedEvent],
        data: log.data,
        topics: log.topics,
      });

      if (parsed.eventName === 'RandomNumberGenerated') {
        return {
          ticketNumber: Number(parsed.args.ticketNumber),
        };
      }
    } catch (err) {
      console.warn('Failed to decode RandomNumberGenerated log:', log, err);
    }
  }

  throw new Error('RandomNumberGenerated event not found in logs');
};
