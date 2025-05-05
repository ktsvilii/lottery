import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Ticket } from '../types';

type GameContextType = {
  ticket: Ticket | undefined;
  setTicketState: (newValues: Partial<Ticket> | undefined) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const [ticket, setTicket] = useState<Ticket | undefined>();

  const setTicketState = useCallback((newValues: Partial<Ticket> | undefined) => {
    if (newValues === undefined) {
      setTicket(undefined);
    } else {
      setTicket(prev => {
        if (!prev) return newValues as Ticket;
        return { ...prev, ...newValues };
      });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      ticket,
      setTicketState,
    }),
    [ticket, setTicketState],
  );

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
