import { FC, RefObject, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { InstructionModal } from '../InstructionModal';
import { useStartGame } from './useStartGame';

const faucetLinks = [
  {
    label: 'Google Cloud Faucet',
    href: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
  },
  {
    label: 'POW Faucet',
    href: 'https://sepolia-faucet.pk910.de/',
  },
];

export const StartGame: FC = () => {
  const navigate = useNavigate();

  const {
    isGameStarted,
    address,
    hasEnoughEth,
    faucetVisited,
    isRescanning,
    handleFaucetVisited,
    handleRescan,
    handleConnectWallet,
  } = useStartGame();

  const handleStartGame = useCallback(() => {
    if (hasEnoughEth) {
      navigate('/game');
    } else {
      (modalRef as React.RefObject<HTMLDialogElement>).current?.showModal();
    }
  }, [hasEnoughEth, navigate]);

  const modalRef = useRef<HTMLDialogElement>(null);

  const heading = address ? (isGameStarted ? 'Return to your game' : 'Ready to play?') : 'Connect your wallet';
  const buttonLabel = address ? "Let's start!" : 'Connect MetaMask';
  const buttonHandler = address ? handleStartGame : handleConnectWallet;

  return (
    <div className='max-w-8xl md:col-span-2 space-y-5 place-items-center mb-5'>
      <h1 className='text-3xl text-center place-self-center'>{heading}</h1>
      <button className='btn btn-sm btn-neutral min-w-72 w-full text-xl h-16' type='submit' onClick={buttonHandler}>
        {buttonLabel}
      </button>

      <InstructionModal refObj={modalRef as RefObject<HTMLDialogElement>}>
        <h3 className='text-xl font-bold text-center'>Not enough Sepolia ETH</h3>
        <p className='text-lg mt-5 text-center'>You can get Sepolia ETH at faucets for free!</p>

        <div className='container mt-5 flex flex-wrap justify-center gap-4'>
          {faucetLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-sm btn-neutral h-10 w-full sm:w-[48%]'
              onClick={handleFaucetVisited}
            >
              {label}
            </a>
          ))}

          <button
            className='btn btn-md btn-neutral h-12 w-full'
            disabled={!faucetVisited || isRescanning}
            onClick={handleRescan}
          >
            {isRescanning ? 'Rescanning...' : 'Rescan Sepolia ETH balance'}
          </button>
        </div>
      </InstructionModal>
    </div>
  );
};
