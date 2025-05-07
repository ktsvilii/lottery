import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { readContract } from '@wagmi/core';
import { useAccount } from 'wagmi';

import { config } from '../wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../constants';

import { Ticket } from '../types';

interface UseFetchTicketsReturn {
  tickets: Ticket[] | null;
  isFetchingTickets: boolean;
  goToTicketsPage: () => void;
  fetchUserTicketsHandler: () => Promise<void>;
}

export const useFetchTickets = (): UseFetchTicketsReturn => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const [isFetchingTickets, setIsFetchingTickets] = useState(false);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  const fetchUserTickets = async () => {
    setIsFetchingTickets(true);

    try {
      const tickets = (await readContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'getPlayerTickets',
        args: [],
        account: address,
      })) as Ticket[];

      return tickets;
    } catch (err) {
      console.error('Fetching user tickets failed:', err);
      throw err;
    } finally {
      setIsFetchingTickets(false);
    }
  };

  const goToTicketsPage = () => {
    navigate('/tickets');
  };

  const fetchUserTicketsHandler = async () => {
    try {
      const tickets = await fetchUserTickets();
      setTickets(tickets);
    } catch (error) {
      console.error('Error during ticket purchase:', error);
    }
  };

  return {
    tickets,
    isFetchingTickets,
    goToTicketsPage,
    fetchUserTicketsHandler,
  };
};
