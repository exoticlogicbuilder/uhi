'use client'

import { useState } from 'react'
import { EncryptedAuction } from '@/shared/types'

interface BidSubmissionProps {
  currentAuction: EncryptedAuction | null
}

export function BidSubmission({ currentAuction }: BidSubmissionProps) {
  const [bidAmount, setBidAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAuction) {
      setError('No active auction')
      return
    }

    if (!currentAuction.active) {
      setError('Auction is not active')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const bidAmountNum = parseFloat(bidAmount)
      
      if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
        throw new Error('Please enter a valid bid amount')
      }

      // TODO: Replace with actual FHE encryption and contract interaction
      // This would involve:
      // 1. Encrypt the bid amount using FHE
      // 2. Submit the encrypted bid to the smart contract
      // 3. Handle the response

      const mockEncryptedBid = '0x' + (bidAmountNum * 1000).toString(16).padStart(64, '0')
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3
      
      if (isSuccess) {
        setSuccess(`Bid submitted successfully! Amount: ${bidAmountNum} USDC (encrypted)`)
        setBidAmount('')
      } else {
        throw new Error('Bid was too low or auction has ended')
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit bid')
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentAuction) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Auction</h3>
          <p className="text-gray-600">Create an auction first to submit bids</p>
        </div>
      </div>
    )
  }

  if (!currentAuction.active) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Auction Ended</h3>
          <p className="text-gray-600">This auction is no longer accepting bids</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Encrypted Bid</h2>
        <p className="text-gray-600">Place a confidential bid in the ongoing Dutch auction</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auction Info */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Current Auction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-blue-700">Pool Address:</span>
            <p className="text-sm text-blue-900 font-mono break-all">{currentAuction.poolAddress}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-blue-700">Time Remaining:</span>
            <p className="text-sm text-blue-900">
              {Math.max(0, Math.floor((currentAuction.endTime - Date.now()) / 1000 / 60))} minutes
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bid Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your bid amount"
              min="0"
              step="0.01"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500 text-sm">USDC</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your bid will be encrypted before submission using FHE
          </p>
        </div>

        {/* Security Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">🔒 Security Features</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Bid amount is encrypted using Fully Homomorphic Encryption</li>
            <li>• Comparison against current price happens in encrypted domain</li>
            <li>• No sensitive data is revealed on-chain</li>
            <li>• Anti-sniping protection prevents front-running</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !bidAmount}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Encrypting & Submitting...' : 'Submit Encrypted Bid'}
          </button>
        </div>
      </form>

      {/* How It Works */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 How Bidding Works</h4>
        <div className="text-xs text-yellow-800 space-y-2">
          <p><strong>1. Current Price Calculation:</strong> Hidden price = Start Price - (Decay Rate × Time Elapsed)</p>
          <p><strong>2. Encrypted Bid:</strong> Your bid amount is encrypted using FHE</p>
          <p><strong>3. Comparison:</strong> Contract compares encrypted bid against encrypted current price</p>
          <p><strong>4. Execution:</strong> Only bids ≥ current price are executed</p>
        </div>
      </div>
    </div>
  )
}
