import { FC, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { formatEther } from 'viem';

import { useGetJackpot } from '../../../hooks';

import { Loader } from '../../Loader';
import { BurgerMenuIcon } from '../../../assets';

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
          <BurgerMenuIcon />
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
