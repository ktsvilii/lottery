import type { AbiEvent } from 'viem';
import { decodeEventLog, Log, parseAbiItem } from 'viem';

import { LOTTERY_CONTRACT_ADDRESS } from '../constants';

const ticketPurchasedEvent = parseAbiItem(
  'event TicketPurchased(address indexed player, uint256 indexed ticketNumber)',
) as AbiEvent;

const distributeEvent = parseAbiItem('event Distribute(address indexed owner, uint256 indexed amount)') as AbiEvent;

const abi = [ticketPurchasedEvent, distributeEvent];

export const getTicketPurchasedLog = (logs: Log[]): bigint => {
  for (const log of logs) {
    if (log.address.toLowerCase() !== LOTTERY_CONTRACT_ADDRESS.toLowerCase()) continue;

    try {
      const parsed = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
      }) as
        | {
            eventName: 'TicketPurchased';
            args: {
              player: `0x${string}`;
              ticketNumber: bigint;
            };
          }
        | {
            eventName: 'Distribute';
            args: {
              owner: `0x${string}`;
              amount: bigint;
            };
          };

      if (parsed.eventName === 'TicketPurchased') {
        return parsed.args.ticketNumber;
      }
    } catch (err) {
      console.warn('Failed to decode log:', log, err);
      continue;
    }
  }

  throw new Error('TicketPurchased event not found in logs');
};
