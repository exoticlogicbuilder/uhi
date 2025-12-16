# Encrypted Dutch Auction Hook

This project implements an Encrypted Dutch Auction Hook for Uniswap v4 that enables confidential token auctions using Fully Homomorphic Encryption (FHE).

## Project Structure

- `smart-contracts/` - Uniswap v4 Hook smart contracts
- `frontend/` - React/Next.js frontend application
- `shared/` - Shared types and utilities

## Features

- **Confidential Price Discovery**: Dutch auction parameters are encrypted
- **Anti-Sniping Protection**: Hidden price curve prevents bot manipulation
- **Fair Liquidations**: Private auctions for lending protocol liquidations
- **FHE Operations**: Homomorphic price calculations and bid comparisons

## Architecture

The hook implements a beforeSwap hook that:
1. Calculates the current hidden price using homomorphic math
2. Compares encrypted bids against the current price
3. Only executes swaps for winning bids
4. Maintains auction state with encrypted parameters

## Business Impact

- Execute large token sales without revealing strategy
- Enable fair liquidation auctions for protocols
- Support treasury diversification with encrypted reserves
- Protection from coordination attacks and front-running