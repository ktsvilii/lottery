import { FC, RefObject, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useConnect } from 'wagmi';

import { useStep } from '../../providers';
import { InstructionModal } from '../InstructionModal';

export const StartGame: FC = () => {
  const navigate = useNavigate();
  const { connectors, connect } = useConnect();
  const { address, hasEnoughEth } = useStep();

  const modalRef = useRef<HTMLDialogElement>(null);

  const handleConnectWallet = useCallback(() => {
    const metaMaskConnector = connectors.find(connector => connector.name === 'MetaMask');
    if (metaMaskConnector) {
      try {
        connect({ connector: metaMaskConnector });
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask connector not found');
    }
  }, [connectors, connect]);

  const handleStartGame = useCallback(() => {
    if (hasEnoughEth) {
      navigate('/game');
    } else {
      (modalRef as React.RefObject<HTMLDialogElement>).current?.showModal();
    }
  }, [hasEnoughEth, navigate]);

  const heading = address ? 'Ready to play?' : 'Connect your wallet';
  const buttonLabel = address ? "Let's start!" : 'Connect MetaMask';
  const buttonHandler = address ? handleStartGame : handleConnectWallet;

  return (
    <div className='max-w-8xl md:col-span-2 space-y-5 place-items-center mb-5'>
      <h1 className='text-3xl text-center place-self-center'>{heading}</h1>
      <button className='btn btn-sm btn-primary min-w-72 w-full text-xl h-16' type='submit' onClick={buttonHandler}>
        {buttonLabel}
      </button>

      <InstructionModal refObj={modalRef as RefObject<HTMLDialogElement>}>
        <h3 className='text-xl font-bold text-center'>Not enough Sepolia ETH!</h3>
        <p className='text-lg mt-5 text-center'>You can get some at faucets for free!</p>

        <div className='container mt-5 space-x-5 space-y-2 flex flex-wrap justify-center'>
          <a
            href='https://cloud.google.com/application/web3/faucet/ethereum/sepolia'
            target='_blank'
            className='btn btn-sm btn-soft btn-accent mt-1 w-48 h-10'
          >
            Use Google Cloud Faucet
          </a>
          <a
            href='https://sepolia-faucet.pk910.de/'
            target='_blank'
            className='btn btn-sm btn-soft btn-accent mt-1 w-48 h-10'
          >
            Use POW Faucet
          </a>
        </div>
      </InstructionModal>
    </div>
  );
};
