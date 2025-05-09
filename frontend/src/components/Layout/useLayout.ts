import { useNavigate } from 'react-router-dom';

import { useWatchContractEvent } from 'wagmi';

import { useNotifications } from '../../providers';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../constants';
import { getRandomNumberGeneratedLog } from '../../logReaders';

export const useLayout = () => {
  const navigate = useNavigate();

  const { toggleNotification } = useNotifications();

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'RandomNumberGenerated',
    onLogs(logs) {
      try {
        const { ticketId } = getRandomNumberGeneratedLog(logs);

        toggleNotification({
          content: `Winning combination was generated for ticket #${ticketId}`,
          type: 'success',
          button: {
            title: 'See tickets page',
            action: () => navigate('/tickets'),
          },
        });
      } catch (err) {
        console.warn('Could not decode RandomNumberGenerated event:', err);
      }
    },
  });
};
