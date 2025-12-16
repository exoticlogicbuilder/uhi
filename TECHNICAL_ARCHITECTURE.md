# Encrypted Dutch Auction Hook - Technical Architecture

## Overview
This project implements a confidential Dutch auction system for Uniswap v4 using Fully Homomorphic Encryption (FHE). The system enables secure token auctions without revealing sensitive pricing information, preventing front-running and bot manipulation.

## System Architecture

### 1. Smart Contract Layer (Solidity)

#### Core Components:
- **EncryptedDutchAuctionHook.sol**: Main Uniswap v4 hook contract
- **IEncryptedDutchAuctionHook.sol**: Interface definition
- **Test Suite**: Comprehensive testing with FHE integration

#### Key Features:
- FHE-based price calculations: `currentPrice = startPrice - (decayRate * timeElapsed)`
- Encrypted bid validation using `FHE.gte()`
- beforeSwap hook integration with Uniswap v4
- Access control and auction lifecycle management

#### FHE Operations:
```solidity
// Homomorphic price calculation
euint32 memory totalDecay = auction.decayPerSecond.mul(uint32(timeElapsed));
euint32 memory currentPrice = auction.startPrice.sub(totalDecay);

// Encrypted bid validation
ebool memory validBid = FHE.gte(encryptedBid, currentPrice);
```

### 2. Frontend Layer (React/Next.js)

#### Structure:
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Main dashboard
│   │   └── globals.css         # Global styles + Tailwind
│   ├── components/
│   │   └── auction/
│   │       ├── AuctionCreator.tsx    # Create auction form
│   │       ├── AuctionDashboard.tsx  # Real-time monitoring
│   │       └── BidSubmission.tsx     # Encrypted bid interface
│   └── lib/
│       └── constants.ts        # Configuration & ABIs
```

#### Key Components:

**AuctionCreator**: 
- Form validation for auction parameters
- FHE encryption integration points
- Preview of auction dynamics
- Real-time parameter validation

**AuctionDashboard**:
- Real-time auction status monitoring
- Time remaining calculations
- FHE operations status display
- Encrypted parameter visualization

**BidSubmission**:
- Encrypted bid input interface
- FHE encryption before submission
- Bid validation feedback
- Security feature explanations

### 3. Shared Resources

#### Type System:
```typescript
// Core types for type safety across frontend/backend
interface EncryptedAuction {
  poolAddress: string;
  startPrice: string;      // FHE encrypted
  floorPrice: string;      // FHE encrypted
  decayPerSecond: string;  // FHE encrypted
  startTime: number;
  endTime: number;
  active: boolean;
  creator: string;
}
```

#### Constants:
- Auction validation rules
- FHE operation parameters
- Network configurations
- UI timing constants

## Security Model

### 1. Confidentiality
- **Price Hiding**: Current price never revealed on-chain
- **Bid Privacy**: Bids encrypted before submission
- **Strategy Protection**: Auction parameters encrypted

### 2. Anti-Sniping
- Hidden price curve prevents timing attacks
- FHE operations happen on-chain
- No mempool exposure of sensitive data

### 3. Fair Execution
- Only bids ≥ current price execute
- Homomorphic comparison ensures correctness
- Automatic auction termination on winning bid

## Flow Diagram

```
1. Auction Creation:
   [Frontend] → [FHE Encrypt] → [Deploy Contract] → [Active Auction]

2. Price Calculation:
   [Time Elapsed] → [FHE Operations] → [Hidden Current Price]

3. Bid Submission:
   [Frontend] → [FHE Encrypt Bid] → [Contract Validation] → [Execute/Reject]

4. Settlement:
   [Winning Bid] → [Execute Swap] → [End Auction] → [Optional Reveal]
```

## Technical Decisions

### 1. FHE Library Choice
- **fhevm** for Solidity operations
- **fhevmjs** for TypeScript integration
- BFV encryption scheme for integer operations

### 2. Uniswap v4 Integration
- beforeSwap hook for bid validation
- IPoolManager integration
- Standard hook interface compliance

### 3. Frontend Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management

## Deployment Architecture

### 1. Development
```bash
# Smart contracts
cd smart-contracts
forge build
forge test

# Frontend
cd frontend
npm install
npm run dev
```

### 2. Production Deployment
- Smart contracts: Foundry deployment scripts
- Frontend: Vercel/Netlify static hosting
- FHE Gateway: Zama network integration

## Scalability Considerations

### 1. FHE Operations
- Current: Simple arithmetic (add, multiply, compare)
- Future: Complex price formulas
- Optimization: Pre-computed lookup tables

### 2. Gas Optimization
- Batch operations where possible
- Minimize on-chain FHE calls
- Efficient storage patterns

### 3. Frontend Performance
- Real-time updates with WebSocket
- Optimistic UI updates
- Efficient re-rendering

## Future Enhancements

### 1. Advanced Features
- Multi-asset auction support
- Dutch auction with reserve prices
- Automated settlement mechanisms

### 2. MEV Protection
- Private mempool integration
- Commit-reveal schemes
- Cross-chain auction support

### 3. Analytics & Monitoring
- Auction performance metrics
- FHE operation monitoring
- User behavior analytics
