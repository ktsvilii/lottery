// localStorage keys
export const THEME_KEY = 'theme';
export const COUNTDOWN_STORAGE_KEY = 'countdown_end_time';
export const CURRENT_STEP = 'currentStep';

// utility constants
export const COUNTDOWN_DURATION = 120;
export const STEPPER_STEPS_COUNT = 4;
export const NOTIFICATION_TIMEOUT = 5000;

export const TICKET_PRICE_WEI = 1_000_000_000_000_000n;
export const BATCH_TICKET_PRICE_WEI = TICKET_PRICE_WEI * 9n;

export const ROWS_PER_PAGE = 25;

export const BRIEF_INSTRUCTIONS_STEPS = [
  'Connect MetaMask wallet',
  'Get some Sepolia ETH',
  'Buy a ticket',
  'Submit your 5 Lucky Numbers',
  'Check results and Claim your prize',
];

export const FAUCET_LINKS = [
  {
    label: 'Google Cloud Faucet',
    href: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
  },
  {
    label: 'POW Faucet',
    href: 'https://sepolia-faucet.pk910.de/',
  },
];
