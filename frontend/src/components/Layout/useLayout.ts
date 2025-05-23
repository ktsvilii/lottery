import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useWatchContractEvent } from 'wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS, THEME_KEY } from '@constants';
import { getRandomNumberGeneratedLog } from '@logReaders';
import { useNotifications, useTheme } from '@providers';
import { Theme } from '@types';

const tKey = 'notifications.random_number_generated';

export const useLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          content: t(`${tKey}.content`, { ticketId }),
          type: 'success',
          button: {
            title: t(`${tKey}.button`),
            action: () => navigate('/tickets'),
          },
        });
      } catch (err) {
        console.warn('Could not decode RandomNumberGenerated event:', err);
      }
    },
  });
};
