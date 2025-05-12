import { FC, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { formatEther } from 'viem';

import { useGetJackpot } from '../../../hooks';

import { Loader } from '../../Loader';

export const NavbarStart: FC = () => {
  const { jackpot, refetchJackpot } = useGetJackpot();
  const [parsedJackpot, setParsedJackpot] = useState<string | null>(null);

  useEffect(() => {
    refetchJackpot();
    if (jackpot) {
      try {
        const jackpotInEth = formatEther(BigInt(jackpot as bigint));
        setParsedJackpot(jackpotInEth);
      } catch (error) {
        console.error('Error parsing jackpot:', error);
        setParsedJackpot(null);
      }
    }
  }, [jackpot, refetchJackpot]);

  return (
    <div className='navbar-start'>
      <div className='dropdown'>
        <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h7' />{' '}
          </svg>
        </div>
        <ul tabIndex={0} className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/FAQ'>FAQ</Link>
          </li>
        </ul>
      </div>

      <div className='flex flex-col 2xl:ml-60 xl:ml-44 lg:ml-36 md:ml-28 sm:ml-20'>
        <h2 className='text-center'>Jackpot</h2>
        <strong className='self-center'>{parsedJackpot ? `${parsedJackpot} ETH` : <Loader size='md' />}</strong>
      </div>
    </div>
  );
};
