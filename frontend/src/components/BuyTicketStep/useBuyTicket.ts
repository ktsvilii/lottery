import { useState } from 'react';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useAccount } from 'wagmi';

import { config } from '../../wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../constants';

import { getTicketPurchasedLog } from './getTicketPurchasedLog';
import { useGameContext, useStepper } from '../../providers';

const TICKET_PRICE_WEI = BigInt(1e14);

interface UseBuyTicketReturn {
  isPurchasingTicket: boolean;
  buyTicketHandler: () => Promise<void>;
}

export const useBuyTicket = (): UseBuyTicketReturn => {
  const { address } = useAccount();
  const { nextStep } = useStepper();
  const { setTicketState } = useGameContext();

  const [isPurchasingTicket, setIsPurchasingTicket] = useState(false);

  const buyTicket = async () => {
    setIsPurchasingTicket(true);
    try {
      const { request } = await simulateContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'buyTicket',
        value: TICKET_PRICE_WEI,
        account: address,
      });

      const txHash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      const ticketId = getTicketPurchasedLog(receipt.logs);
      setTicketState({ id: ticketId });

      return txHash;
    } catch (err) {
      console.error('Purchase ticket failed:', err);
      throw err;
    } finally {
      setIsPurchasingTicket(false);
    }
  };

  const buyTicketHandler = async () => {
    try {
      await buyTicket();
      nextStep();
    } catch (error) {
      console.error('Error during ticket purchase:', error);
    }
  };

  return {
    isPurchasingTicket,
    buyTicketHandler,
  };
};
