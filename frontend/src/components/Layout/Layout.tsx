import { Outlet } from 'react-router-dom';

import { Header } from '../Header';
import { useNotifications } from '../../providers';
import Notification from '../Notification/Notification';

export const Layout = () => {
  const { notification } = useNotifications();
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
