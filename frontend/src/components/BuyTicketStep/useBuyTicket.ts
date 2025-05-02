import { useState } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';

import { config } from '../../wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../constants';

import { getTicketPurchasedLog } from './getTicketPurchasedLog';
import { useGameContext, useStepper } from '../../providers';

const TICKET_PRICE_WEI = BigInt(1e14);

interface UseBuyTicketReturn {
  activeTicket: bigint | undefined;
  isPurchasingTicket: boolean;
  isLoadingActiveTicket: boolean;
  refetchTicketHandler: () => Promise<void>;
  buyTicketHandler: () => Promise<void>;
}

export const useBuyTicket = (): UseBuyTicketReturn => {
  const { address } = useAccount();
  const { nextStep } = useStepper();
  const { setTicketNumber } = useGameContext();

  const [isPurchasingTicket, setIsPurchasingTicket] = useState(false);

  const buyTicket = async () => {
    setIsPurchasingTicket(true);
    try {
      const { request } = await simulateContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'buyTicket',
        args: [],
        value: TICKET_PRICE_WEI,
        account: address,
      });

      const txHash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      const ticketId = getTicketPurchasedLog(receipt.logs);
      console.log('Purchased ticket ID:', ticketId);
      setTicketNumber(ticketId);

      return txHash;
    } catch (err) {
      console.error('Purchase ticket failed:', err);
      throw err;
    } finally {
      setIsPurchasingTicket(false);
    }
  };

  const {
    data: activeTicketData,
    refetch: refetchActiveTicket,
    isLoading: isLoadingActiveTicket,
  } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getActiveTicketNumber',
    account: address,
    args: [address],
  });

  const activeTicket = activeTicketData ? BigInt(activeTicketData.toString()) : undefined;

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'TicketPurchased',
    onLogs() {
      refetchActiveTicket();
    },
  });

  const buyTicketHandler = async () => {
    try {
      await buyTicket();
      nextStep();
    } catch (error) {
      console.error('Error during ticket purchase:', error);
    }
  };

  const refetchTicketHandler = async () => {
    await refetchActiveTicket();
    nextStep();
  };

  return {
    activeTicket,
    isPurchasingTicket,
    isLoadingActiveTicket,
    refetchTicketHandler,
    buyTicketHandler,
  };
};
