import { FC } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Loader } from '@components';

import { useBuyTicket } from './useBuyTicket';

const tKey = 'game.step_1';

export const BuyTicketStep: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isPurchasingTicket, buyTicketHandler, buyBatchTicketsHandler } = useBuyTicket();

  const goToTicketsPage = () => {
    navigate('/tickets');
  };

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20'>
      <h1 className='text-3xl text-center'>
        <Trans i18nKey={`${tKey}.title`} components={[<strong key={0} />]} />
      </h1>
      <div className='flex flex-col gap-2 md:flex-row'>
        <button
          className='btn btn-sm btn-outline min-w-72 text-xl md:h-16 h-12'
          disabled={isPurchasingTicket}
          onClick={buyTicketHandler}
        >
          {isPurchasingTicket ? <Loader size='xl' /> : t(`${tKey}.button_1`)}
        </button>

        <button
          className='btn btn-sm btn-outline min-w-72 text-xl md:h-16 h-12'
          disabled={isPurchasingTicket}
          onClick={buyBatchTicketsHandler}
        >
          {isPurchasingTicket ? <Loader size='xl' /> : t(`${tKey}.button_2`)}
        </button>
      </div>
      <Trans
        i18nKey={`${tKey}.divider_content`}
        components={[<div className='divider divider-neutral' key={0} />, <p />]}
      />
      <button className='btn btn-sm btn-outline min-w-60 text-xl h-10 md:h-12' onClick={goToTicketsPage}>
        {t(`${tKey}.button_3`)}
      </button>
    </div>
  );
};
