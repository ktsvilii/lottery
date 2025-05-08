import { FC, useEffect } from 'react';
import { NotificationProps, useNotifications } from '../../providers';

const NOTIFICATION_TIMEOUT = 5000;

const Notification: FC<NotificationProps> = ({ content, type, button }) => {
  const { toggleNotification } = useNotifications();

  console.log(content, type, button);
  useEffect(() => {
    setTimeout(() => {
      toggleNotification();
    }, NOTIFICATION_TIMEOUT);
  }, []);

  return (
    <div role='alert' className={`alert alert-${type} absolute bottom-4 right-4 min-w-48 w-auto h-12 flex`}>
      {type === 'error' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 shrink-0 stroke-current'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 shrink-0 stroke-current'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      )}
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

export default Notification;
