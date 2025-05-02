import { useCallback, useState } from 'react';

import { useConnectWallet } from '../../hooks';
import { useConnect } from 'wagmi';
import { useGameContext } from '../../providers';

interface UseStartGameReturn {
  isGameStarted: boolean;
  address?: string;
  hasEnoughEth: boolean;
  faucetVisited: boolean;
  isRescanning: boolean;
  handleFaucetVisited: () => void;
  handleRescan: () => void;
  handleConnectWallet: () => void;
}

export const useStartGame = (): UseStartGameReturn => {
  const { connectors, connect } = useConnect();

  const { isGameStarted } = useGameContext();
  const { address, hasEnoughEth, refetch } = useConnectWallet();

  const [faucetVisited, setFaucetVisited] = useState(false);
  const [isRescanning, setIsRescanning] = useState(false);

  const handleRescan = () => {
    setIsRescanning(true);
    try {
      refetch();
    } catch (error) {
      console.error('Failed to rescan balance:', error);
    }
    setIsRescanning(false);
  };

  const handleFaucetVisited = () => {
    setFaucetVisited(true);
  };

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

  return {
    isGameStarted,
    address,
    hasEnoughEth,
    faucetVisited,
    isRescanning,
    handleFaucetVisited,
    handleRescan,
    handleConnectWallet,
  };
};
