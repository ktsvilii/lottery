import { useState, useEffect, useCallback } from 'react';

import { useAccount, useBalance, useConnect, useSwitchChain } from 'wagmi';
import { sepolia } from 'viem/chains';
import { QueryObserverResult } from '@tanstack/react-query';
import { GetBalanceErrorType } from 'viem';

interface ConnectWalletReturns {
  address: string | undefined;
  isEnoughETH: boolean;
  isConnected: boolean;
  refetch: () => Promise<
    QueryObserverResult<
      {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
      },
      GetBalanceErrorType
    >
  >;
  handleConnectWallet: () => void;
}

export const useConnectWallet = (): ConnectWalletReturns => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading, refetch } = useBalance({ address });
  const { connectors, connect } = useConnect();
  const { switchChain } = useSwitchChain();

  const [isEnoughETH, setIsEnoughETH] = useState(false);

  const checkEthBalance = useCallback(() => {
    if (balance?.value && balance.value > 1e14 * 3) {
      setIsEnoughETH(true);
    } else {
      setIsEnoughETH(false);
    }
  }, [balance?.value]);

  const requestSwitchChain = useCallback(() => {
    switchChain({ chainId: sepolia.id });
  }, [switchChain]);

  useEffect(() => {
    if (isConnected && address && !isLoading) {
      if (chain?.id !== sepolia.id) {
        requestSwitchChain();
      }
      checkEthBalance();
    }
  }, [isConnected, address, balance, isLoading, chain, requestSwitchChain, checkEthBalance]);

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
    isConnected,
    refetch,
    handleConnectWallet,
  };
};
