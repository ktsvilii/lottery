import { create } from 'zustand';

import { Ticket } from '../types';

interface GameContextType {
  ticket: Ticket | null;
  setTicketState: (newValues: Partial<Ticket> | undefined) => void;
}

export const useGameContext = create<GameContextType>(set => ({
  ticket: null,
  setTicketState: (newValues: Partial<Ticket> | undefined) =>
    set(state => {
      if (!newValues) {
        return { ticket: null };
      } else {
        if (!state.ticket) {
          return { ticket: newValues as Ticket };
        }
        return {
          ticket: { ...state.ticket, ...newValues },
        };
      }
    }),
}));
