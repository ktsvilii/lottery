import { useCallback, useState } from 'react';

import { useConnectWallet } from '../../hooks';
import { useConnect } from 'wagmi';

interface UseStartGameReturn {
  address?: string;
  isEnoughETH: boolean;
  isFaucetVisited: boolean;
  isRescanning: boolean;
  handleisFaucetVisited: () => void;
  handleRescan: () => void;
  handleConnectWallet: () => void;
}

export const useStartGame = (): UseStartGameReturn => {
  const { connectors, connect } = useConnect();

  const { address, isEnoughETH, refetch } = useConnectWallet();

  const [isFaucetVisited, setIsFaucetVisited] = useState(false);
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

  const handleisFaucetVisited = () => {
    setIsFaucetVisited(true);
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
    address,
    isEnoughETH,
    isFaucetVisited,
    isRescanning,
    handleisFaucetVisited,
    handleRescan,
    handleConnectWallet,
  };
};
