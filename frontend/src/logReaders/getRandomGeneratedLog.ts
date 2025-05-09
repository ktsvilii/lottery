import { Log, parseAbiItem, decodeEventLog } from 'viem';
import { LOTTERY_CONTRACT_ADDRESS } from '../constants';

const randomNumberGeneratedEvent = parseAbiItem('event RandomNumberGenerated(uint256 indexed ticketId)');

export interface RandomNumberGeneratedData {
  ticketId: bigint;
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
          ticketId: parsed.args.ticketId,
        };
      }
    } catch (err) {
      console.warn('Failed to decode RandomNumberGenerated log:', log, err);
    }
  }

  throw new Error('RandomNumberGenerated event not found in logs');
};
