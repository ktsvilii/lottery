import React, { createContext, useContext, useState } from 'react';

import { useWatchContractEvent } from 'wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../constants';
import { getRandomNumberGeneratedLog } from '../logReaders';

export interface NotificationProps {
  content: string;
  type: 'success' | 'error';
  button?: {
    title: string;
    action: () => void;
  };
}

interface NotificationContextType {
  notification: NotificationProps | null;
  toggleNotification: (notification?: NotificationProps) => void;
}

const NotificationsContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const toggleNotification = (notification?: NotificationProps) => setNotification(notification || null);

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'RandomNumberGenerated',
    onLogs(logs) {
      try {
        const { ticketNumber } = getRandomNumberGeneratedLog(logs);
        toggleNotification({
          content: `Winning combination was generated for ticket #${ticketNumber}`,
          type: 'success',
        });
      } catch (err) {
        console.warn('Could not decode RandomNumberGenerated event:', err);
      }
    },
  });

  return (
    <NotificationsContext.Provider value={{ notification, toggleNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider');
  return ctx;
};
