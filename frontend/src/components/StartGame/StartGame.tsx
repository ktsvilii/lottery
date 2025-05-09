import { FC, RefObject, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { InstructionModal } from '../InstructionModal';
import { useStartGame } from './useStartGame';
import { useConnectWallet } from '../../hooks';
import { FAUCET_LINKS } from '../../constants/constants';

export const StartGame: FC = () => {
  const navigate = useNavigate();

  const { address, isEnoughETH, isFaucetVisited, isRescanning, handleRescan, handleIsFaucetVisited } = useStartGame();
  const { handleConnectWallet } = useConnectWallet();

  const handleStartGame = useCallback(() => {
    if (isEnoughETH) {
      navigate('/game');
    } else {
      (modalRef as React.RefObject<HTMLDialogElement>).current?.showModal();
    }
  }, [isEnoughETH, navigate]);

  const modalRef = useRef<HTMLDialogElement>(null);

  const heading = address ? 'Ready to play?' : 'Connect your wallet';
  const buttonLabel = address ? "Let's start!" : 'Connect MetaMask';
  const buttonHandler = address ? handleStartGame : handleConnectWallet;

  return (
    <div className='max-w-8xl md:col-span-2 space-y-5 place-items-center'>
      <h1 className='text-3xl text-center place-self-center mb-2'>{heading}</h1>
      <button className='btn btn-sm btn-neutral min-w-72 w-full text-xl h-16' type='submit' onClick={buttonHandler}>
        {buttonLabel}
      </button>

      <InstructionModal refObj={modalRef as RefObject<HTMLDialogElement>}>
        <h3 className='text-xl font-bold text-center'>Not enough Sepolia ETH</h3>
        <p className='text-lg mt-5 text-center'>You can get Sepolia ETH at faucets for free!</p>

        <div className='container mt-5 flex flex-wrap justify-center gap-4'>
          {FAUCET_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-sm btn-neutral h-10 w-full sm:w-[48%]'
              onClick={handleIsFaucetVisited}
            >
              {label}
            </a>
          ))}

          <button
            className='btn btn-md btn-neutral h-12 w-full'
            disabled={!isFaucetVisited || isRescanning}
            onClick={handleRescan}
          >
            {isRescanning ? 'Rescanning...' : 'Rescan Sepolia ETH balance'}
          </button>
        </div>
      </InstructionModal>
    </div>
  );
};
