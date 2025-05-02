import { useState, useEffect, useCallback } from 'react';

import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { sepolia } from 'viem/chains';
import { QueryObserverResult } from '@tanstack/react-query';
import { GetBalanceErrorType } from 'viem';

interface ConnectWalletReturns {
  address: string | undefined;
  hasEnoughEth: boolean;
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
}

export const useConnectWallet = (): ConnectWalletReturns => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading, refetch } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  const [hasEnoughEth, setHasEnoughEth] = useState(false);

  // Check if the user has enough ETH (>= 2 USD equivalent)
  const checkEthBalance = useCallback(() => {
    if (balance?.value && balance.value > 1e14 * 3) {
      setHasEnoughEth(true);
    } else {
      setHasEnoughEth(false);
    }
  }, [balance?.value]);

  // Request to switch the chain to Sepolia if not already connected
  const requestSwitchChain = useCallback(() => {
    switchChain({ chainId: sepolia.id });
  }, [switchChain]);

  // Side effect to handle chain switching and balance check
  useEffect(() => {
    if (isConnected && address && !isLoading) {
      if (chain?.id !== sepolia.id) {
        requestSwitchChain();
      }
      checkEthBalance();
    }
  }, [isConnected, address, balance, isLoading, chain, requestSwitchChain, checkEthBalance]);

  return {
    address,
    hasEnoughEth,
    isConnected,
    refetch,
  };
};
