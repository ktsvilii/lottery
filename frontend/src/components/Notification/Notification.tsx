import { FC, useEffect } from 'react';

import { NotificationProps, useNotifications } from '@providers';
import { NOTIFICATION_TIMEOUT } from '@constants';
import { NotificationIcon } from '@assets';

export const Notification: FC<NotificationProps> = ({ content, type, button }) => {
  const { toggleNotification } = useNotifications();

  useEffect(() => {
    setTimeout(() => {
      toggleNotification();
    }, NOTIFICATION_TIMEOUT);
  }, []);

  return (
    <div role='alert' className={`alert alert-${type} fixed bottom-4 right-4 min-w-48 w-auto h-12 flex`}>
      <NotificationIcon iconType={type} />
      <span>{content}</span>
      {button ? (
        <div className='ml-auto'>
          <button onClick={button.action} className='btn btn-sm h-8 self-end'>
            {button.title}
          </button>
        </div>
      ) : null}
    </div>
  );
};
