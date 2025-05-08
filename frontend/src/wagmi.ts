import { http, createConfig, webSocket } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: webSocket('https://eth-sepolia.g.alchemy.com/v2/IGSHwNJ1aS2U0vpxCgwd5vXdO3nRXpRu'),
  },
});
