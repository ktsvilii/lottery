import { create } from 'zustand';

export interface NotificationProps {
  content: string;
  type: 'success' | 'error';
  button?: {
    title: string;
    action: () => void | Promise<void>;
  };
}

interface NotificationContextType {
  notification: NotificationProps | null;
  toggleNotification: (notification?: NotificationProps) => void;
}

export const useNotifications = create<NotificationContextType>(set => ({
  notification: null,
  toggleNotification: (notification: NotificationProps | null = null) => set(() => ({ notification })),
}));
