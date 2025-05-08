import React, { createContext, useContext, useState } from 'react';

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

  return (
    <NotificationsContext.Provider value={{ notification, toggleNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
