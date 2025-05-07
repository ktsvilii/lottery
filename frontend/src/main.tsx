import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';

import { ThemeProvider, GameStepperProvider, GameProvider, NotificationsProvider } from './providers';
import App from './App.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationsProvider>
            <GameProvider>
              <GameStepperProvider>
                <App />
              </GameStepperProvider>
            </GameProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
