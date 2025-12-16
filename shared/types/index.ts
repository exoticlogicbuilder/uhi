// Shared types for the Encrypted Dutch Auction Hook

export interface EncryptedAuction {
  poolAddress: string;
  startPrice: string; // Encrypted price as hex string
  floorPrice: string; // Encrypted price as hex string
  decayPerSecond: string; // Encrypted price as hex string
  startTime: number;
  endTime: number;
  active: boolean;
  creator: string;
  encryptedData?: string;
}

export interface AuctionFormData {
  startPrice: number;
  floorPrice: number;
  decayPerSecond: number;
  duration: number; // in seconds
  token0: string;
  token1: string;
  fee: number;
}

export interface EncryptedBid {
  amount: string; // Encrypted amount as hex string
  poolAddress: string;
  user: string;
}

export interface ContractAddresses {
  hook: string;
  poolManager: string;
}

export interface AuctionEvent {
  event: string;
  pool: string;
  creator?: string;
  bidder?: string;
  winner?: string;
  executionPrice?: number;
  timestamp: number;
}

export type AuctionStatus = 'inactive' | 'active' | 'ended' | 'cancelled';

export interface AuctionInfo {
  poolAddress: string;
  status: AuctionStatus;
  timeRemaining: number;
  currentPrice?: string; // Encrypted
  hasActiveAuction: boolean;
}
