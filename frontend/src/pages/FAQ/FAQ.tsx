import { FC } from 'react';

const FAQItem: FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
    <input type='radio' name='lottery-faq' />
    <div className='collapse-title font-semibold'>
      <p>{question}</p>
    </div>
    <div className='collapse-content text-sm'>{children}</div>
  </div>
);

export const FAQ: FC = () => {
  return (
    <div className='max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {/* Column 1 */}
      <div className='space-y-2'>
        <FAQItem question='What is this game about?'>
          This is a blockchain-based lottery game where players purchase a ticket, submit a set of 5 numbers, and have a
          chance to win rewards depending on how many of their numbers match a randomly generated winning combination.
        </FAQItem>

        <FAQItem question='How do I participate?'>
          <ol>
            <li>Buy a ticket by paying exactly 0.0001 ETH.</li>
            <li>Submit your combination of 5 unique numbers (0–36).</li>
            <li>Wait for the Chainlink VRF to generate the winning combination.</li>
            <li>Get your result and see if you’ve won!</li>
          </ol>
        </FAQItem>

        <FAQItem question='How are the winning numbers chosen?'>
          The contract uses Chainlink VRF to securely generate a random number. This number is used to derive 5 unique
          winning numbers between 0 and 36.
        </FAQItem>

        <FAQItem question='What are the rules for choosing my numbers?'>
          You must submit 5 unique numbers between 0 and 36. Duplicates or invalid ranges will cause your entry to be
          rejected.
        </FAQItem>

        <FAQItem question='How much does a ticket cost?'>Each ticket costs exactly 0.0001 ETH.</FAQItem>

        <FAQItem question='What are the prizes?'>
          <ul>
            <li>2 matches: 0.0001 ETH</li>
            <li>3 matches: 5% of the jackpot</li>
            <li>4 matches: 30% of the jackpot</li>
            <li>5 matches: 100% of the jackpot</li>
          </ul>
        </FAQItem>
      </div>

      {/* Column 2 */}
      <div className='space-y-2'>
        <FAQItem question='Where does the ticket money go?'>
          <ul>
            <li>85% goes to the jackpot</li>
            <li>10% to operations</li>
            <li>5% to the contract owner</li>
          </ul>
        </FAQItem>

        <FAQItem question='How do I claim my reward?'>
          When the results are ready, you will automatically get a transaction to your MetaMask with amount of your
          reward if you’ve won.
        </FAQItem>

        <FAQItem question="What happens if I don't win?">
          If you match fewer than 2 numbers, you won’t receive a reward — but you can try again by purchasing a new
          ticket!
        </FAQItem>

        <FAQItem question='Is the lottery fair and secure?'>
          Yes. It uses Chainlink VRF to ensure tamper-proof and verifiable randomness.
        </FAQItem>

        <FAQItem question='Can the contract owner withdraw funds?'>
          The owner can only withdraw their 5% share and the 10% operations fund. The jackpot can only be won by
          players.
        </FAQItem>

        <FAQItem question='Can I send ETH directly to the contract?'>
          Yes, but this only increases the jackpot and doesn't buy you a ticket. Always use the "Buy Ticket" function to
          enter the game.
        </FAQItem>
      </div>
    </div>
  );
};
