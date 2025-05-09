import { ReactNode } from 'react';
import { BuyTicketStep, CheckResultsStep, CountdownStep, SubmitCombinationStep } from '..';

interface Step {
  id: number;
  content: ReactNode;
}

export const StepsSchema: Step[] = [
  { id: 1, content: <BuyTicketStep /> },
  { id: 2, content: <SubmitCombinationStep /> },
  { id: 3, content: <CountdownStep /> },
  { id: 4, content: <CheckResultsStep /> },
];
