import { Log, parseAbiItem, decodeEventLog } from 'viem';
import { LOTTERY_CONTRACT_ADDRESS } from '../../constants';

export function getTicketPurchasedLog(logs: Log[]) {
  const ticketPurchasedEvent = parseAbiItem(
    'event TicketPurchased(address indexed player, uint256 indexed ticketNumber)',
  );

  const distributeEvent = parseAbiItem('event Distribute(address indexed owner, uint256 indexed amount)');

  const abi = [ticketPurchasedEvent, distributeEvent];

  for (const log of logs) {
    if (log.address.toLowerCase() !== LOTTERY_CONTRACT_ADDRESS.toLowerCase()) continue;

    try {
      const parsed = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
      });

      if (parsed.eventName === 'TicketPurchased') {
        const ticketNumber = parsed.args.ticketNumber ?? parsed.args[1];
        console.log('Extracted ticketNumber:', ticketNumber);
        return Number(ticketNumber);
      }
    } catch (err) {
      console.warn('Failed to decode log:', log, err);
      continue;
    }
  }

  throw new Error('TicketPurchased event not found in logs');
}
