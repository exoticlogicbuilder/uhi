// Environment-specific configuration
export const ENVIRONMENT = {
  NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME || 'local',
  FHE_GATEWAY_URL: process.env.NEXT_PUBLIC_FHE_GATEWAY_URL || 'http://localhost:4000',
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TESTNET: process.env.NEXT_PUBLIC_NETWORK_NAME === 'sepolia',
};

// Contract ABIs (simplified for demo)
export const HOOK_ABI = [
  {
    inputs: [
      { name: 'startPrice', type: 'euint32' },
      { name: 'floorPrice', type: 'euint32' },
      { name: 'decayPerSecond', type: 'euint32' },
      { name: 'duration', type: 'uint256' },
    ],
    name: 'createAuction',
    outputs: [{ name: 'pool', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'pool', type: 'address' }],
    name: 'getCurrentPrice',
    outputs: [{ name: 'currentPrice', type: 'euint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'pool', type: 'address' }],
    name: 'hasActiveAuction',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// UI Constants
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  POLLING_INTERVAL: 10000,
  REFRESH_THRESHOLD: 30000,
  MAX_DECIMAL_PLACES: 6,
};

// Network Configuration
export const NETWORKS = {
  LOCAL: {
    chainId: '0x1a4',
    name: 'Local',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: 'http://localhost:8545',
  },
  SEPOLIA: {
    chainId: '0xaa36a7',
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/your_project_id',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
};
