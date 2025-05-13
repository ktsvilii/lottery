import { Outlet } from 'react-router-dom';

import { Header } from '../Header';
import { useLayout } from './useLayout';
import { useNotifications } from '@providers';
import { Notification } from '../Notification';

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
