import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS, THEME_KEY } from '@constants';
import { getRandomNumberGeneratedLog } from '@logReaders';
import { useNotifications, useTheme } from '@providers';
import { Theme } from '@types';
import { useWatchContractEvent } from 'wagmi';

export const useLayout = () => {
  const navigate = useNavigate();

  const { toggleNotification } = useNotifications.getState();
  const { setTheme } = useTheme.getState();

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

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
