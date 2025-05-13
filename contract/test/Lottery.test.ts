import { ethers } from 'hardhat';
import { parseEther, Signer } from 'ethers';
import { expect } from 'chai';

import {
  LotteryTest,
  LotteryTest__factory,
  VRFCoordinatorV2_5Mock,
  VRFCoordinatorV2_5Mock__factory,
} from '../typechain-types/';

describe('Lottery contract', () => {
  let VRFCoordinatorMock: VRFCoordinatorV2_5Mock__factory;
  let VrfCoordinatorMock: VRFCoordinatorV2_5Mock;
  let LotteryFactory: LotteryTest__factory;
  let lottery: LotteryTest;
  let owner: Signer;
  let player: Signer;
  let stranger: Signer;

  const TICKET_PRICE_WEI = 1000000000000000;

  beforeEach(async () => {
    [owner, player, stranger] = await ethers.getSigners();

    VRFCoordinatorMock = await ethers.getContractFactory('VRFCoordinatorV2_5Mock');
    VrfCoordinatorMock = await VRFCoordinatorMock.deploy(1n, 1n, 1n);
    await VrfCoordinatorMock.waitForDeployment();
    const tx = await VrfCoordinatorMock.createSubscription();
    const receipt = await tx.wait();

    const subscriptionCreatedEvent = receipt?.logs
      .map(log => VrfCoordinatorMock.interface.parseLog(log))
      .find(parsedLog => parsedLog?.name === 'SubscriptionCreated');

    const subId = subscriptionCreatedEvent?.args.subId;

    LotteryFactory = await ethers.getContractFactory('LotteryTest');
    lottery = await LotteryFactory.deploy(VrfCoordinatorMock.target, subId);
    await lottery.waitForDeployment();

    await VrfCoordinatorMock.addConsumer(subId, await lottery.getAddress());
  });

  it('Should deploy the contract with proper address', async () => {
    expect(await lottery.getAddress()).to.be.properAddress;
    expect(await lottery.getContractOwner()).to.equal(owner);
    expect(await lottery.getJackpot()).to.equal(0);
    expect(await lottery.getOperationsBalance()).to.equal(0);
    expect(await lottery.getOwnerBalance()).to.equal(0);
  });

  describe('Ticket Purchase', () => {
    it('Should allow a user to buy a ticket, update mappings and emit event', async () => {
      const tx = await lottery.connect(player).buyTicket({ value: TICKET_PRICE_WEI });

      const ticket = await lottery.connect(player).getPlayerTickets();
      const ticketId = ticket[0].id;
      expect(ticketId).to.equal(1);

      expect(ticket[0].isRewardClaimed).to.be.false;
      expect(ticket[0].randomNumberRequested).to.be.false;
      expect(ticket[0].playerCombinationSubmitted).to.be.false;
      expect(ticket[0].winningCombinationGenerated).to.be.false;
      expect(ticket[0].owner).to.equal(player);
      expect(ticket[0].matchingNumbers).to.equal(0);
      expect(ticket[0].potentialReward).to.equal(0);
      expect(ticket[0].actualReward).to.equal(0);

      await expect(tx).to.emit(lottery, 'TicketPurchased').withArgs(player, 1);
      await expect(tx).to.emit(lottery, 'Distribute').withArgs(player, TICKET_PRICE_WEI);
    });

    it('Should allow a user to buy a batch of rickets', async () => {
      const tx = await lottery.connect(player).buyBatchTickets({ value: TICKET_PRICE_WEI * 9 });

      const tickets = await lottery.connect(player).getPlayerTickets();

      expect(tickets.length).to.eq(10);

      await expect(tx).to.emit(lottery, 'TicketPurchased').withArgs(player, 1);
      await expect(tx)
        .to.emit(lottery, 'Distribute')
        .withArgs(player, TICKET_PRICE_WEI * 9);
    });

    it('Should revert if wrong value sent', async () => {
      await expect(lottery.connect(player).buyTicket({ value: ethers.parseEther('0.0000001') })).to.be.revertedWith(
        'Incorrect transaction value!',
      );
      await expect(
        lottery.connect(player).buyBatchTickets({ value: ethers.parseEther('0.0000001') }),
      ).to.be.revertedWith('Incorrect transaction value!');
    });
  });

  describe('Submit Combination', () => {
    beforeEach(async () => {
      await lottery.connect(player).assignTestTicket();
    });

    it('Should allow submitting a valid combination', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;

      const combo: [bigint, bigint, bigint, bigint, bigint] = [1n, 2n, 3n, 4n, 5n];

      await expect(lottery.connect(player).submitCombination(ticketId, combo))
        .to.emit(lottery, 'PlayerCombinationSubmitted')
        .withArgs(player, combo);

      const ticketAfter = await lottery.tickets(ticketId);
      expect(ticketAfter.playerCombinationSubmitted).to.be.true;
      expect(ticketAfter.randomNumberRequested).to.be.true;
    });

    it('Should revert if you submit twice', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;
      const combo = [1n, 2n, 3n, 4n, 5n] as [bigint, bigint, bigint, bigint, bigint];

      await lottery.connect(player).submitCombination(ticketId, combo);
      await expect(lottery.connect(player).submitCombination(ticketId, combo)).to.be.revertedWith('Already submitted');
    });

    it('Should revert on duplicate numbers', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;
      const badCombo = [1n, 2n, 3n, 4n, 1n] as [bigint, bigint, bigint, bigint, bigint];

      await expect(lottery.connect(player).submitCombination(ticketId, badCombo)).to.be.revertedWith(
        'Duplicate numbers not allowed',
      );
    });

    it('Should revert on number out of range', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;
      const badCombo = [0n, 10n, 20n, 36n, 37n] as [bigint, bigint, bigint, bigint, bigint];

      await expect(lottery.connect(player).submitCombination(ticketId, badCombo)).to.be.revertedWith(
        'Number out of range (0-36)',
      );
    });

    it('Should revert if non-owner tries to submit', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;
      const combo = [1n, 2n, 3n, 4n, 5n] as [bigint, bigint, bigint, bigint, bigint];

      await expect(lottery.connect(stranger).submitCombination(ticketId, combo)).to.be.revertedWith(
        'You are not the owner',
      );
    });

    it('Should revert if combination is already submitted', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;
      const combination = [1n, 2n, 3n, 4n, 5n] as [bigint, bigint, bigint, bigint, bigint];

      await lottery.connect(player).submitCombination(ticketId, combination);

      await expect(lottery.connect(player).submitCombination(ticketId, combination)).to.be.revertedWith(
        'Already submitted',
      );
    });
  });

  describe('Claim reward', () => {
    beforeEach(async () => {
      const fund = await owner.sendTransaction({ to: lottery.getAddress(), value: parseEther('0.01') });
      await fund.wait();
      const tx = await lottery.connect(player).buyTicket({ value: TICKET_PRICE_WEI });
      await tx.wait();
    });

    const playerCombination = [
      [1n, 2n, 3n, 4n, 5n] as [bigint, bigint, bigint, bigint, bigint],
      [1n, 2n, 3n, 10n, 11n] as [bigint, bigint, bigint, bigint, bigint],
    ];
    playerCombination.forEach(combination => {
      it('should allow the ticket owner to claim reward', async () => {
        const tickets = await lottery.connect(player).getPlayerTickets();
        const ticketId = tickets[0].id;

        await lottery.connect(player).test_setWinningCombination(ticketId, [1, 2, 3, 10, 11]);
        await lottery.connect(player).submitCombination(ticketId, combination);
        const updatedTicket = await lottery.connect(player).getTicketById(ticketId);

        const tx = await lottery.connect(player).claimReward(updatedTicket.id);
        await tx.wait();

        const updatedTicket2 = await lottery.connect(player).getTicketById(1n);
        expect(updatedTicket2.isRewardClaimed).to.be.true;
      });
    });

    it('should revert if reward combination is not submitted', async () => {
      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;

      await expect(lottery.connect(player).claimReward(ticketId)).to.be.revertedWith('Combination not submitted');
    });

    it('should revert if reward already claimed', async () => {
      const ticket = await lottery.connect(player).getTicketById(1n);

      await lottery.connect(player).submitCombination(ticket.id, [1, 2, 3, 4, 5]);

      await lottery.connect(player).test_setWinningCombination(ticket.id, [1, 2, 3, 10, 11]);

      await lottery.connect(player).claimReward(ticket.id);
      await expect(lottery.connect(player).claimReward(ticket.id)).to.be.revertedWith('Reward already claimed');
    });

    it('should revert if non-owner tries to claim', async () => {
      const ticket = await lottery.connect(player).getTicketById(1n);

      await lottery.connect(player).submitCombination(ticket.id, [1, 2, 3, 4, 5]);

      await lottery.connect(player).test_setWinningCombination(ticket.id, [1, 2, 3, 10, 11]);

      await expect(lottery.connect(stranger).claimReward(ticket.id)).to.be.revertedWith('Only ticket owner can claim');
    });

    it('should revert if no reward is available', async () => {
      const ticket = await lottery.connect(player).getTicketById(1n);

      await lottery.connect(player).submitCombination(ticket.id, [1, 2, 3, 4, 5]);

      await lottery.connect(owner).test_setWinningCombination(ticket.id, [10, 11, 12, 13, 14]);

      await expect(lottery.connect(player).claimReward(ticket.id)).to.be.revertedWith('No reward to claim');
    });
  });

  describe('Util functions', () => {
    it('Should change balance of contract properly', async () => {
      const lotteryAddress = await lottery.getAddress();
      const amount = ethers.parseEther('1.0');

      const initialJackpot = 0n;
      const initialOwnerBalance = 0n;
      const initialOperationsBalance = 0n;

      const jackpot = await lottery.jackpot();
      const ownerBalance = await lottery.getOwnerBalance();
      const operationsBalance = await lottery.getOperationsBalance();

      expect(jackpot).to.eq(initialJackpot);
      expect(ownerBalance).to.eq(initialOwnerBalance);
      expect(operationsBalance).to.eq(initialOperationsBalance);

      const tx = await owner.sendTransaction({ to: lotteryAddress, value: amount });
      await tx.wait();

      await expect(tx).to.changeEtherBalances([owner, lotteryAddress], [-amount, amount]);

      const jackpotAfter = await lottery.jackpot();
      const ownerBalanceAfter = await lottery.getOwnerBalance();
      const operationsBalanceAfter = await lottery.getOperationsBalance();

      expect(jackpotAfter).to.eq((amount * 90n) / 100n);
      expect(ownerBalanceAfter).to.eq((amount * 5n) / 100n);
      expect(operationsBalanceAfter).to.eq((amount * 5n) / 100n);

      await expect(tx).to.emit(lottery, 'Distribute').withArgs(owner, amount);
    });

    it('Should revert transaction on fallback', async () => {
      const lotteryAddress = await lottery.getAddress();
      const data = ethers.encodeBytes32String('Hello world!');

      await expect(owner.sendTransaction({ to: lotteryAddress, value: 0n, data })).to.be.revertedWith('Invalid call');
    });

    const balances = [{ fund: true, amount: ethers.parseEther('1.0') }, { fund: false }];
    balances.forEach(({ fund, amount }) => {
      it(`Should ${fund ? 'allow' : 'disallow'} withdrawal of owner balance`, async () => {
        if (fund && amount) {
          const lotteryAddress = await lottery.getAddress();

          await owner.sendTransaction({
            to: lotteryAddress,
            value: amount,
          });

          const tx = await lottery.withdrawOwnerBalance();
          await tx.wait();
          expect(await lottery.getOwnerBalance()).to.eq(0);
          await expect(tx)
            .to.emit(lottery, 'OwnerBalanceWithdraw')
            .withArgs(owner, (amount * 5n) / 100n);
        } else {
          await expect(lottery.withdrawOwnerBalance()).to.be.revertedWith('Nothing to withdraw');
        }
      });
    });

    balances.forEach(({ fund, amount }) => {
      it(`Should ${fund ? 'allow' : 'disallow'} withdrawal of operations balance`, async () => {
        if (fund && amount) {
          const lotteryAddress = await lottery.getAddress();

          await owner.sendTransaction({ to: lotteryAddress, value: amount });

          const tx = await lottery.withdrawOperationsBalance();
          await tx.wait();

          expect(await lottery.getOperationsBalance()).to.eq(0);
          await expect(tx)
            .to.emit(lottery, 'OperationsBalanceWithdraw')
            .withArgs(owner, (amount * 5n) / 100n);
        } else {
          await expect(lottery.withdrawOperationsBalance()).to.be.revertedWith('Nothing to withdraw');
        }
      });
    });

    it('Should not allow withdraw balances for non-owners', async () => {
      await expect(lottery.connect(player).withdrawOperationsBalance()).to.be.revertedWith('Only for owner');
      await expect(lottery.connect(player).withdrawOwnerBalance()).to.be.revertedWith('Only for owner');
      await expect(lottery.connect(player).withdrawJackpot()).to.be.revertedWith('Only for owner');
    });

    const rewards = [{ amount: '1.0' }, { amount: '0' }];
    rewards.forEach(({ amount }) => {
      it('Should _sendReward properly', async () => {
        const convertedAmount = ethers.parseEther(amount);
        if (convertedAmount > 0n) {
          await owner.sendTransaction({
            to: await lottery.getAddress(),
            value: convertedAmount,
          });

          await expect(lottery.test_sendReward(player, convertedAmount)).to.changeEtherBalances(
            [lottery, player],
            [-convertedAmount, convertedAmount],
          );
        } else {
          await expect(lottery.test_sendReward(player, convertedAmount)).to.be.revertedWith('No reward to send');
        }
      });
    });

    const matchedNumbers = [
      { matched: 0 },
      { matched: 1 },
      { matched: 2 },
      { matched: 3 },
      { matched: 4 },
      { matched: 5 },

      // too many matches
      { matched: 255 },

      //out-of-bounds
      { matched: 999 },
    ];
    matchedNumbers.forEach(({ matched }) => {
      it(`Should _calculateReward properly for ${matched} matches`, async () => {
        const amount = ethers.parseEther('1.0');
        await owner.sendTransaction({ to: await lottery.getAddress(), value: amount });
        const jackpot = await lottery.getJackpot();

        if (matched < 6) {
          let expectedReward;
          if (matched === 0) {
            expectedReward = 0n;
          } else if (matched === 1) {
            expectedReward = parseEther('0.0007');
          } else if (matched === 2) {
            expectedReward = parseEther('0.0012');
          } else if (matched === 3) {
            expectedReward = parseEther('0.01');
          } else if (matched === 4) {
            expectedReward = parseEther('0.1');
          } else if (matched === 5) {
            expectedReward = jackpot;
          }

          const reward = await lottery.test_calculateReward(matched);
          expect(reward).to.eq(expectedReward);
        } else if (matched > 6 && matched < 256) {
          await expect(lottery.test_calculateReward(matched)).to.be.revertedWith('Unexpected matching number count');
        } else if (matched >= 256) {
          await expect(lottery.test_calculateReward(matched)).to.be.rejectedWith('value out-of-bounds');
        }
      });
    });

    const combinations = [
      // 0 matches
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [5, 6, 7, 8, 9], expectedMatches: 0 },

      // 1 match
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [5, 6, 7, 8, 0], expectedMatches: 1 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [5, 6, 7, 1, 9], expectedMatches: 1 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [5, 6, 3, 8, 9], expectedMatches: 1 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [5, 2, 7, 8, 9], expectedMatches: 1 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [4, 6, 7, 8, 9], expectedMatches: 1 },

      // 2 matches
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 7, 8, 9], expectedMatches: 2 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [7, 6, 2, 0, 9], expectedMatches: 2 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [7, 1, 8, 9, 4], expectedMatches: 2 },

      // 3 matches
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 2, 8, 9], expectedMatches: 3 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 7, 2, 9], expectedMatches: 3 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 7, 8, 2], expectedMatches: 3 },

      // 4 matches
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 2, 9, 3], expectedMatches: 4 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 2, 3, 5], expectedMatches: 4 },

      // 5 matches (perfect match)
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [4, 2, 3, 1, 0], expectedMatches: 5 },
      { playerCombination: [0, 1, 2, 3, 4], generatedCombination: [0, 1, 2, 3, 4], expectedMatches: 5 },
    ];
    combinations.forEach(({ playerCombination, generatedCombination, expectedMatches }) => {
      it(`Should return ${expectedMatches} matches for player ${playerCombination} vs winning ${generatedCombination}`, async () => {
        expect(
          await lottery.test_checkWinningCombination(
            playerCombination as [number, number, number, number, number],
            generatedCombination as [number, number, number, number, number],
          ),
        ).to.eq(expectedMatches);
      });
    });

    it(`Should generate unique array of 5 numbers in range 0 to 37 properly`, async () => {
      const combination = await lottery.test_generateWinningCombination(1);

      expect(combination.length).to.equal(5);
      combination.forEach(num => {
        expect(num).to.be.at.least(0n);
        expect(num).to.be.below(37n);
      });

      const uniqueNumbers = new Set(combination);
      expect(uniqueNumbers.size).to.equal(5);
    });

    it('Should request random number and map requestId to ticketId', async () => {
      const ticketId = 0;

      const tx = await lottery.test_requestRandomNumber(ticketId);
      const receipt = await tx.wait();

      const requestId = receipt?.logs
        .map(log => lottery.interface.parseLog(log))
        .find(parsedLog => parsedLog?.name === 'RandomWordsRequested')?.args.requestId;

      const mappedTicketId = await lottery.requestIdToTicketId(requestId);
      expect(mappedTicketId).to.equal(ticketId);
    });

    it('Should fulfill winning combination with random words', async () => {
      const randomWord = 1;
      await lottery.connect(player).buyTicket({ value: TICKET_PRICE_WEI });

      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;

      const tx = await lottery.test_requestRandomNumber(ticketId);
      const receipt = await tx.wait();

      const requestId = receipt?.logs
        .map(log => lottery.interface.parseLog(log))
        .find(parsedLog => parsedLog?.name === 'RandomWordsRequested')?.args.requestId;

      await expect(lottery.connect(owner).test_fulfillRandomWords(requestId, [randomWord]))
        .to.emit(lottery, 'RandomNumberGenerated')
        .withArgs(ticketId);
    });

    it(`Should return all tickets`, async () => {
      const allTickets = await lottery.connect(owner).getAllTickets();
      expect(allTickets.length).to.equal(0);

      const tx = await lottery.connect(player).buyTicket({ value: TICKET_PRICE_WEI });
      await tx.wait();

      const allTicketsUpd = await lottery.connect(owner).getAllTickets();
      expect(allTicketsUpd.length).to.equal(1);
    });

    it(`Should not return all tickets for non-owner`, async () => {
      await expect(lottery.connect(stranger).getAllTickets()).to.be.revertedWith('Only for owner');
    });

    balances.forEach(({ fund, amount }) => {
      it(`Should ${fund ? 'allow' : 'disallow'} withdrawal of jackpot balance`, async () => {
        if (fund && amount) {
          const lotteryAddress = await lottery.getAddress();

          await owner.sendTransaction({ to: lotteryAddress, value: amount });

          const tx = await lottery.withdrawJackpot();
          await tx.wait();

          expect(await lottery.getJackpot()).to.eq(0);
          await expect(tx)
            .to.emit(lottery, 'JackpotWithdraw')
            .withArgs(owner, (amount * 90n) / 100n);
        } else {
          await expect(lottery.withdrawJackpot()).to.be.revertedWith('Nothing to withdraw');
        }
      });
    });

    it('Should fund jackpot', async () => {
      const amount = parseEther('1.0');
      const oldJackpot = await lottery.getJackpot();
      expect(oldJackpot).to.eq(0);

      const tx = await lottery.connect(owner).fundJackpot(amount, { value: amount });

      const newJackpot = await lottery.getJackpot();
      expect(newJackpot).to.eq(amount);

      await expect(tx).to.emit(lottery, 'FundJackpot').withArgs(owner, amount);
    });

    it('Should not fund jackpot if value is deffer from the sent amount', async () => {
      const amount = parseEther('1.0');
      const oldJackpot = await lottery.getJackpot();
      expect(oldJackpot).to.eq(0);

      await expect(lottery.connect(owner).fundJackpot(amount, { value: parseEther('0.01') })).to.be.revertedWith(
        'Incorrect ETH amount sent',
      );
    });

    it('Should return ticket info for ticket owner', async () => {
      const tx = await lottery.connect(player).buyTicket({ value: TICKET_PRICE_WEI });

      await tx.wait();

      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;

      const ticket = await lottery.connect(player).getTicketById(ticketId);

      expect(ticket).to.be.exist;
    });

    it('Should not return ticket info for non ticket owner', async () => {
      const tx = await lottery.connect(player).buyTicket({ value: TICKET_PRICE_WEI });

      await tx.wait();

      const tickets = await lottery.connect(player).getPlayerTickets();
      const ticketId = tickets[0].id;

      await expect(lottery.connect(stranger).getTicketById(ticketId)).to.be.rejectedWith(
        'You are not the ticket owner',
      );
    });
  });
});
