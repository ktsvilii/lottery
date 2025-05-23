import { FC, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { formatEther } from 'viem';

import { BurgerMenuIcon } from '@assets';
import { Loader } from '@components';
import { useGetJackpot } from '@hooks';

export const NavbarStart: FC = () => {
  const { jackpot, refetchJackpot } = useGetJackpot();
  const [parsedJackpot, setParsedJackpot] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    refetchJackpot();
  }, []);

  useEffect(() => {
    if (typeof jackpot === 'bigint') {
      try {
        const jackpotInEth = formatEther(BigInt(jackpot));
        setParsedJackpot(jackpotInEth);
      } catch (error) {
        console.error('Error parsing jackpot:', error);
        setParsedJackpot(null);
      }
    }
  }, [jackpot]);

  return (
    <div className='navbar-start'>
      <div className='dropdown'>
        <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
          <BurgerMenuIcon />
        </div>
        <ul tabIndex={0} className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'>
          <li>
            <Link to='/'>{t('header.nav.home')}</Link>
          </li>
          <li>
            <Link to='/FAQ'>{t('header.nav.FAQ')}</Link>
          </li>
        </ul>
      </div>

      <div className='flex flex-col 2xl:ml-60 xl:ml-44 lg:ml-36 md:ml-28 sm:ml-20'>
        <h2 className='text-center'>{t('header.jackpot')}</h2>
        <strong className='self-center'>
          {parsedJackpot ? `${Number(parsedJackpot).toFixed(3)} ETH` : <Loader size='md' />}
        </strong>
      </div>
    </div>
  );
};
