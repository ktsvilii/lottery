import { Outlet } from 'react-router-dom';

import { useNotifications } from '@providers';

import { Header } from '../Header';
import { Notification } from '../Notification';

import { useLayout } from './useLayout';

export const Layout = () => {
  const { notification } = useNotifications();
  useLayout();
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-grow p-6'>
        <Outlet />
      </main>
      {notification ? <Notification {...notification} /> : null}
    </div>
  );
};
