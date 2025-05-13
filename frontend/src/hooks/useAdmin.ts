import { useState } from 'react';

import { readContract } from '@wagmi/core';
import { useAccount, useReadContract } from 'wagmi';

import { config } from 'src/wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../constants';
import { Ticket } from '../types';

interface AdminReturns {
  isAdmin: boolean;
  allTickets: Ticket[];
  fetchAllTickets: () => Promise<void>;
}

export const useAdmin = (): AdminReturns => {
  const { address } = useAccount();
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);

  const { data: adminAddress } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getContractOwner',
  });

  const fetchAllTickets = async () => {
    try {
      const tickets = await readContract(config, {
        address: LOTTERY_CONTRACT_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: 'getAllTickets',
        account: address,
      });
      if (tickets) {
        setAllTickets(tickets as Ticket[]);
      }
    } catch (e) {
      console.error('fetchTickets failed', e);
    }
  };

  const isAdmin = adminAddress === address;

  return {
    isAdmin,
    allTickets,
    fetchAllTickets,
  };
};
