import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useTranslation } from 'react-i18next';
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

const tKey = 'notifications.buy_ticket';

export const useBuyTicket = (): UseBuyTicketReturn => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      toggleNotification({ content: t(`${tKey}.error_message`), type: 'error' });
    } finally {
      setIsPurchasingTicket(false);
    }
  };

  const buyTicketHandler = () =>
    handleBuy({
      functionName: 'buyTicket',
      value: TICKET_PRICE_WEI,
      onSuccess: () => nextStep(),
      successMessage: t(`${tKey}.success_1_ticket`),
    });

  const buyBatchTicketsHandler = () =>
    handleBuy({
      functionName: 'buyBatchTickets',
      value: BATCH_TICKET_PRICE_WEI,
      onSuccess: () => navigate('/tickets'),
      successMessage: t(`${tKey}.success_10_ticket`),
    });

  return {
    isPurchasingTicket,
    buyTicketHandler,
    buyBatchTicketsHandler,
  };
};
