import { useState } from 'react';

import { useConnectWallet } from '@hooks';

interface UseStartGameReturn {
  address?: string;
  isEnoughETH: boolean;
  isFaucetVisited: boolean;
  isRescanning: boolean;
  handleIsFaucetVisited: () => void;
  handleRescan: () => void;
}

export const useStartGame = (): UseStartGameReturn => {
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

  const handleIsFaucetVisited = () => {
    setIsFaucetVisited(true);
  };

  return {
    address,
    isEnoughETH,
    isFaucetVisited,
    isRescanning,
    handleIsFaucetVisited,
    handleRescan,
  };
};
