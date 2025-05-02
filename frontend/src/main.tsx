import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';

import { ThemeProvider, GameStepperProvider, GameProvider } from './providers';
import App from './App.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GameProvider>
            <GameStepperProvider>
              <App />
            </GameStepperProvider>
          </GameProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
