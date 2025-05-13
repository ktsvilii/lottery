import { ReactNode } from 'react';

export const faqData: { question: string; answer: ReactNode }[] = [
  {
    question: 'What is this game about?',
    answer: (
      <>
        This is a blockchain-based lottery game where players purchase a ticket, submit a set of 5 numbers, and have a
        chance to win rewards depending on how many of their numbers match a randomly generated winning combination.
      </>
    ),
  },
  {
    question: 'How do I participate?',
    answer: (
      <ol className='list-decimal list-inside'>
        <li>Buy a ticket by paying exactly 0.001 ETH.</li>
        <li>Submit your combination of 5 unique numbers (0–36).</li>
        <li>Wait for the Chainlink VRF to generate the winning combination.</li>
        <li>Get your result and see if you’ve won!</li>
      </ol>
    ),
  },
  {
    question: 'How are the winning numbers chosen?',
    answer: (
      <>
        The contract uses Chainlink VRF to securely generate a random number. This number is used to derive 5 unique
        winning numbers between 0 and 36.
      </>
    ),
  },
  {
    question: 'What are the rules for choosing my numbers?',
    answer: (
      <>
        You must submit 5 unique numbers between 0 and 36. Duplicates or invalid ranges will cause your entry to be
        rejected.
      </>
    ),
  },
  {
    question: 'How much does a ticket cost?',
    answer: <>Each ticket costs exactly 0.001 ETH.</>,
  },
  {
    question: 'What are the prizes?',
    answer: (
      <ul className='list-disc list-inside'>
        <li>1 match: 0.0007 ETH</li>
        <li>2 matches: 0.0012 ETH</li>
        <li>3 matches: 0.01 ETH</li>
        <li>4 matches: 0.1 ETH</li>
        <li>5 matches: 100% of the current jackpot!</li>
      </ul>
    ),
  },
  {
    question: 'Where does the ticket money go?',
    answer: (
      <ul className='list-disc list-inside'>
        <li>90% goes to the jackpot</li>
        <li>5% to operations expenses</li>
        <li>5% to the contract owner</li>
      </ul>
    ),
  },
  {
    question: 'How do I claim my reward?',
    answer: (
      <>
        When the results are ready, you will automatically get a transaction to your MetaMask with amount of your reward
        if you’ve won.
      </>
    ),
  },
  {
    question: "What happens if I don't win?",
    answer: (
      <>
        If you match fewer than 2 numbers, you won’t receive a reward — but you can try again by purchasing a new
        ticket!
      </>
    ),
  },
  {
    question: 'Is the lottery fair and secure?',
    answer: <>Yes. It uses Chainlink VRF to ensure tamper-proof and verifiable randomness.</>,
  },
  {
    question: 'Can the contract owner withdraw funds?',
    answer: (
      <>
        The owner can only withdraw their 5% share and the 10% operations fund. The jackpot can only be won by players.
      </>
    ),
  },
  {
    question: 'Can I send ETH directly to the contract?',
    answer: (
      <>
        Yes, but this only increases the jackpot and doesn't buy you a ticket. Always use the "Buy Ticket" function to
        enter the game.
      </>
    ),
  },
];
