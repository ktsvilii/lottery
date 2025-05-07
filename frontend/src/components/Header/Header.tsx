import { FC } from 'react';
import { NavbarCenter, NavbarEnd, NavbarStart } from './components';
// import { useNotifications } from '../../providers';

export const Header: FC = () => {
  // const { notification, toggleNotification } = useNotifications();

  // const showNotification = () =>
  //   toggleNotification({ content: 'test', type: 'error', button: { title: 'button', action: () => {} } });

  // console.log('notifciations', notification);
  return (
    <div className='navbar bg-base-100 shadow-sm'>
      {/* <div onClick={showNotification}>CLICK HERE</div> */}

      <NavbarStart />
      <NavbarCenter />
      <NavbarEnd />
    </div>
  );
};

// Remove comments for Notification testing
