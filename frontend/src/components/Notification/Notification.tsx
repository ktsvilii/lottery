import { FC, useEffect } from 'react';

import { NotificationIcon } from '@assets';
import { NOTIFICATION_TIMEOUT } from '@constants';
import { NotificationProps, useNotifications } from '@providers';

export const Notification: FC<NotificationProps> = ({ content, type, button }) => {
  const { toggleNotification } = useNotifications();
  const notifClassName = type === 'error' ? 'alert-error' : 'alert-success';

  useEffect(() => {
    setTimeout(() => {
      toggleNotification();
    }, NOTIFICATION_TIMEOUT);
  }, []);

  return (
    <div role='alert' className={`alert ${notifClassName} fixed bottom-4 right-4 min-w-48 w-auto h-12 flex`}>
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
