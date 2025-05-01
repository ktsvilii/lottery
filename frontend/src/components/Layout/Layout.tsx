import { Outlet } from 'react-router-dom';

import { Header } from '../Header';

export const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-grow p-6'>
        <Outlet />
      </main>
    </div>
  );
};
