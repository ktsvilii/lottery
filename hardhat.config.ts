import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { configDotenv } from 'dotenv';

configDotenv();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_WALLET_PRIVATE_KEY = process.env.SEPOLIA_WALLET_PRIVATE_KEY;

const TESTNET_RPC_URL = process.env.TESTNET_RPC_URL;

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    localhost: { url: TESTNET_RPC_URL, chainId: 31337 },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_WALLET_PRIVATE_KEY!],
      chainId: 11155111,
    },
  },
};

export default config;
