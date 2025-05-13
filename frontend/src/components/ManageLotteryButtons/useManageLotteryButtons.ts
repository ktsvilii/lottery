import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '@constants';
import { useNotifications } from '@providers';
import { config } from 'src/wagmi';

interface ManageLotteryButtonsReturns {
  isFundingJackpot: boolean;
  isWithdrawingJackpot: boolean;
  isWithdrawingOwnerBalance: boolean;
  isWithdrawingOperationalBalance: boolean;
  fundJackpotHandler: (value: string) => Promise<void>;
  withdrawJackpotHandler: () => Promise<void>;
  withdrawOwnerBalanceHandler: () => Promise<void>;
  withdrawOperationalBalanceHandler: () => Promise<void>;
}

const tKey = 'notifications';

export const useManageLotteryButtons = (): ManageLotteryButtonsReturns => {
  const { t } = useTranslation();

  const { address } = useAccount();

  const [isFundingJackpot, setIsFundingJackpot] = useState(false);
  const [isWithdrawingJackpot, setIsWithdrawingJackpot] = useState(false);
  const [isWithdrawingOwnerBalance, setIsWithdrawingOwnerBalance] = useState(false);
  const [isWithdrawingOperationalBalance, setIsWithdrawingOperationalBalance] = useState(false);

  const { toggleNotification } = useNotifications();

  const writeAction = useCallback(
    async (
      actionName: string,
      functionName: string,
      options: {
        value?: bigint;
        args?: unknown[];
        setLoading: (flag: boolean) => void;
        successMessage: string;
        errorMessage: string;
      },
    ) => {
      const { setLoading, value, args = [], successMessage, errorMessage } = options;
      setLoading(true);
      try {
        const { request } = await simulateContract(config, {
          abi: LOTTERY_ABI,
          address: LOTTERY_CONTRACT_ADDRESS,
          functionName,
          args,
          account: address,
          value,
        });

        const txHash = await writeContract(config, request);
        await waitForTransactionReceipt(config, { hash: txHash });

        toggleNotification({ content: successMessage, type: 'success' });
      } catch (err) {
        console.error(`${actionName} failed:`, err);
        toggleNotification({ content: errorMessage, type: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, toggleNotification],
  );

  const fundJackpotHandler = async (value: string) => {
    await writeAction('funding jackpot', 'fundJackpot', {
      value: parseEther(value),
      args: [parseEther(value)],
      setLoading: setIsFundingJackpot,
      successMessage: t(`${tKey}.funding_jackpot.success_message`),
      errorMessage: t(`${tKey}.funding_jackpot.error_message`),
    });
  };

  const withdrawJackpotHandler = async () => {
    await writeAction('withdrawing jackpot', 'withdrawJackpot', {
      setLoading: setIsWithdrawingJackpot,
      successMessage: t(`${tKey}.withdrawing_jackpot.success_message`),
      errorMessage: t(`${tKey}.withdrawing_jackpot.error_message`),
    });
  };

  const withdrawOwnerBalanceHandler = async () => {
    await writeAction('withdrawing owner balance', 'withdrawOwnerBalance', {
      setLoading: setIsWithdrawingOwnerBalance,
      successMessage: t(`${tKey}.withdrawing_owner_balance.success_message`),
      errorMessage: t(`${tKey}.withdrawing_owner_balance.error_message`),
    });
  };

  const withdrawOperationalBalanceHandler = async () => {
    await writeAction('withdrawing operational balance', 'withdrawOperationsBalance', {
      setLoading: setIsWithdrawingOperationalBalance,
      successMessage: t(`${tKey}.withdrawing_operational_balance.success_message`),
      errorMessage: t(`${tKey}.withdrawing_operational_balance.error_message`),
    });
  };

  return {
    isFundingJackpot,
    isWithdrawingJackpot,
    isWithdrawingOwnerBalance,
    isWithdrawingOperationalBalance,
    fundJackpotHandler,
    withdrawJackpotHandler,
    withdrawOwnerBalanceHandler,
    withdrawOperationalBalanceHandler,
  };
};
