import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount } from 'wagmi';

import { BATCH_TICKET_PRICE_WEI, LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS, TICKET_PRICE_WEI } from '@constants';
import { getTicketPurchasedLog } from '@logReaders';
import { useGameContext, useNotifications, useStepper } from '@providers';

import { config } from '../../../wagmi';

interface UseBuyTicketReturn {
  isPurchasingTicket: boolean;
  buyTicketHandler: () => Promise<void>;
  buyBatchTicketsHandler: () => Promise<void>;
}

export const useBuyTicket = (): UseBuyTicketReturn => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { nextStep } = useStepper();
  const { setTicketState } = useGameContext();
  const { toggleNotification } = useNotifications();
  const [isPurchasingTicket, setIsPurchasingTicket] = useState(false);

  const executeContractCall = async (functionName: 'buyTicket' | 'buyBatchTickets', value: bigint): Promise<string> => {
    const { request } = await simulateContract(config, {
      abi: LOTTERY_ABI,
      address: LOTTERY_CONTRACT_ADDRESS,
      functionName,
      value,
      account: address,
    });

    const txHash = await writeContract(config, request);
    await waitForTransactionReceipt(config, { hash: txHash });

    return txHash;
  };

  const handleBuy = async ({
    functionName,
    value,
    onSuccess,
    successMessage,
  }: {
    functionName: 'buyTicket' | 'buyBatchTickets';
    value: bigint;
    onSuccess?: (txHash: string) => void | Promise<void>;
    successMessage: string;
  }) => {
    setIsPurchasingTicket(true);
    try {
      const txHash = (await executeContractCall(functionName, value)) as `0x${string}`;

      if (functionName === 'buyTicket') {
        const receipt = await waitForTransactionReceipt(config, { hash: txHash });
        const ticketId = getTicketPurchasedLog(receipt.logs);
        setTicketState({ id: ticketId });
      }

      toggleNotification({ content: successMessage, type: 'success' });
      onSuccess?.(txHash);
    } catch (error) {
      console.error(`Error during ${functionName} purchase:`, error);
      toggleNotification({ content: 'Error during ticket purchase', type: 'error' });
    } finally {
      setIsPurchasingTicket(false);
    }
  };

  const buyTicketHandler = () =>
    handleBuy({
      functionName: 'buyTicket',
      value: TICKET_PRICE_WEI,
      onSuccess: () => nextStep(),
      successMessage: 'Ticket purchased successfully',
    });

  const buyBatchTicketsHandler = () =>
    handleBuy({
      functionName: 'buyBatchTickets',
      value: BATCH_TICKET_PRICE_WEI,
      onSuccess: () => navigate('/tickets'),
      successMessage: 'Batch of 10 tickets purchased successfully',
    });

  return {
    isPurchasingTicket,
    buyTicketHandler,
    buyBatchTicketsHandler,
  };
};
