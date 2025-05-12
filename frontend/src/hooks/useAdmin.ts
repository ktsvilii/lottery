import { useAccount, useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../constants';
import { Ticket } from '../types';

interface AdminReturns {
  isAdmin: boolean;
  allTickets: Ticket[];
}

export const useAdmin = (): AdminReturns => {
  const { address } = useAccount();
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);

  const { data: adminAddress } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getContractOwner',
    account: address,
  });

  const { data: ticketsData } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getAllTickets',
    account: address,
  });

  const isAdmin = adminAddress === address;

  useEffect(() => {
    if (ticketsData) {
      setAllTickets(ticketsData as Ticket[]);
    }
  }, [ticketsData]);

  return {
    isAdmin,
    allTickets,
  };
};
