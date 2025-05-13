import { FC } from 'react';

import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

export const MoreDetailsNotice: FC = () => (
  <p className='mt-1 md:mt-5 xlg:mt-12 place-self-center'>
    <Trans
      i18nKey={'home.details_note'}
      components={[<small key={0} />, <Link key={1} className='link text-[0.8rem]' to='/faq' />]}
    />
  </p>
);
