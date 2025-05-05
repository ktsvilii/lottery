import { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { useGameContext, useStepper } from '../../providers';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '../../constants';

import { config } from '../../wagmi';

import { FallbackUI } from '../FallbackUI';
import { Loader } from '../Loader';

export const CheckResultsStep: FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const { setCurrentStep } = useStepper();
  const { ticket, setTicketState } = useGameContext();
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);

  const claimRewardHandler = async () => {
    setIsClaimingRewards(true);
    try {
      const { request } = await simulateContract(config, {
        abi: LOTTERY_ABI,
        address: LOTTERY_CONTRACT_ADDRESS,
        functionName: 'claimReward',
        args: [BigInt(ticket?.id as number)],
        account: address,
      });

      const txHash = await writeContract(config, request);

      await waitForTransactionReceipt(config, { hash: txHash });
      setTicketState({ isRewardClaimed: true });

      return txHash;
    } catch (err) {
      console.error('Submitting combination failed:', err);
      setTicketState({ isRewardClaimed: true });
      throw err;
    } finally {
      setIsClaimingRewards(false);
    }
  };

  const goHomeHandler = () => {
    navigate('/');
    setTicketState(undefined);
  };

  const playAgainHandler = () => {
    setTicketState(undefined);
    setCurrentStep(0);
  };

  if (!ticket) {
    return <FallbackUI />;
  }

  const { id, playerCombination, winningCombination, reward, matchingNumbers, isRewardClaimed } = ticket;

  console.log(ticket);

  const playerCombinationResult = playerCombination?.join(', ');
  const winningCombinationResult = winningCombination?.join(', ');

  const buttonsContent = isRewardClaimed ? (
    <button disabled className='btn btn-neutral'>
      Reward is already claimed
    </button>
  ) : (
    <button
      disabled={isClaimingRewards}
      className='btn btn-neutral shadow-none hover:bg-white hover:text-black '
      onClick={claimRewardHandler}
    >
      {isClaimingRewards ? <Loader size='xl' /> : 'Claim Reward'}
    </button>
  );

  const resultsContent = reward ? (
    <div className='container flex flex-col gap-3'>
      <p>
        You matched {matchingNumbers} number. Your reward is {formatEther(reward)} ETH.
      </p>
      {buttonsContent}
    </div>
  ) : (
    <p>You have 0 matches. Better luck next time.</p>
  );

  return (
    <div className='flex flex-col items-center justify-start h-full w-full gap-5 md:pt-20 pt-8'>
      <h1 className='text-3xl text-center'>
        <strong>Step 4.</strong> Check Results for ticket #{id}
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-black border-1 border-white p-4 min-w-80 text-xl md:text-2xl text-white'>
          <p>Your combination</p>
          <p>{playerCombinationResult}</p>
        </div>
        <div className='bg-white  border-1 border-white p-4 min-w-80 text-xl md:text-2xl text-black'>
          <p>Winning combination</p>
          <p>{winningCombinationResult}</p>
        </div>
      </div>

      <h2 className='py-5 text-center'>{resultsContent}</h2>

      <button className='btn btn-sm btn-outline min-w-72 text-xl h-16' onClick={playAgainHandler}>
        Play again
      </button>

      <div className='divider divider-neutral'>OR</div>

      <button className='btn btn-sm btn-outline min-w-60 text-xl h-12' onClick={goHomeHandler}>
        Return to homepage
      </button>
    </div>
  );
};
