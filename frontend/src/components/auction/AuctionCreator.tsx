'use client'

import { useState } from 'react'
import { AuctionFormData } from '@/shared/types'
import { AUCTION_CONSTANTS } from '@/shared/constants'

interface AuctionCreatorProps {
  onAuctionCreated: (auction: any) => void
}

export function AuctionCreator({ onAuctionCreated }: AuctionCreatorProps) {
  const [formData, setFormData] = useState<AuctionFormData>({
    startPrice: 1000,
    floorPrice: 100,
    decayPerSecond: 10,
    duration: 3600, // 1 hour
    token0: '',
    token1: '',
    fee: 3000 // 0.3%
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form data
      if (formData.startPrice < AUCTION_CONSTANTS.MIN_START_PRICE || 
          formData.startPrice > AUCTION_CONSTANTS.MAX_START_PRICE) {
        throw new Error(`Start price must be between ${AUCTION_CONSTANTS.MIN_START_PRICE} and ${AUCTION_CONSTANTS.MAX_START_PRICE}`)
      }

      if (formData.floorPrice < AUCTION_CONSTANTS.MIN_FLOOR_PRICE || 
          formData.floorPrice > AUCTION_CONSTANTS.MAX_FLOOR_PRICE) {
        throw new Error(`Floor price must be between ${AUCTION_CONSTANTS.MIN_FLOOR_PRICE} and ${AUCTION_CONSTANTS.MAX_FLOOR_PRICE}`)
      }

      if (formData.startPrice <= formData.floorPrice) {
        throw new Error('Start price must be greater than floor price')
      }

      if (formData.duration < AUCTION_CONSTANTS.MIN_AUCTION_DURATION || 
          formData.duration > AUCTION_CONSTANTS.MAX_AUCTION_DURATION) {
        throw new Error(`Duration must be between ${AUCTION_CONSTANTS.MIN_AUCTION_DURATION / 60} and ${AUCTION_CONSTANTS.MAX_AUCTION_DURATION / 3600} hours`)
      }

      // TODO: Replace with actual FHE encryption and contract interaction
      const mockAuction = {
        poolAddress: '0x1234567890123456789012345678901234567890',
        startPrice: '0x' + (formData.startPrice * 1000).toString(16).padStart(64, '0'),
        floorPrice: '0x' + (formData.floorPrice * 1000).toString(16).padStart(64, '0'),
        decayPerSecond: '0x' + (formData.decayPerSecond * 1000).toString(16).padStart(64, '0'),
        startTime: Date.now(),
        endTime: Date.now() + formData.duration * 1000,
        active: true,
        creator: '0x742d35cc6aF5F46c2c9a3B3B5B4B5B5B5B5B5B5B5',
        encryptedData: '0x'
      }

      onAuctionCreated(mockAuction)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create auction')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof AuctionFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Encrypted Dutch Auction</h2>
        <p className="text-gray-600">Set up a confidential token auction with encrypted price parameters</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Pair */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token 0 Address
            </label>
            <input
              type="text"
              value={formData.token0}
              onChange={(e) => handleInputChange('token0', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token 1 Address
            </label>
            <input
              type="text"
              value={formData.token1}
              onChange={(e) => handleInputChange('token1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
              required
            />
          </div>

          {/* Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fee (bps)
            </label>
            <select
              value={formData.fee}
              onChange={(e) => handleInputChange('fee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={100}>0.01% (1 bps)</option>
              <option value={500}>0.05% (5 bps)</option>
              <option value={1000}>0.1% (10 bps)</option>
              <option value={3000}>0.3% (30 bps)</option>
              <option value={10000}>1% (100 bps)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={300}>5 minutes</option>
              <option value={900}>15 minutes</option>
              <option value={1800}>30 minutes</option>
              <option value={3600}>1 hour</option>
              <option value={7200}>2 hours</option>
              <option value={21600}>6 hours</option>
              <option value={86400}>24 hours</option>
            </select>
          </div>

          {/* Start Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Price
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.startPrice}
                onChange={(e) => handleInputChange('startPrice', parseFloat(e.target.value))}
                min={AUCTION_CONSTANTS.MIN_START_PRICE}
                max={AUCTION_CONSTANTS.MAX_START_PRICE}
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">USDC</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Range: {AUCTION_CONSTANTS.MIN_START_PRICE} - {AUCTION_CONSTANTS.MAX_START_PRICE} USDC
            </p>
          </div>

          {/* Floor Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floor Price
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.floorPrice}
                onChange={(e) => handleInputChange('floorPrice', parseFloat(e.target.value))}
                min={AUCTION_CONSTANTS.MIN_FLOOR_PRICE}
                max={AUCTION_CONSTANTS.MAX_FLOOR_PRICE}
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">USDC</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Range: {AUCTION_CONSTANTS.MIN_FLOOR_PRICE} - {AUCTION_CONSTANTS.MAX_FLOOR_PRICE} USDC
            </p>
          </div>

          {/* Decay Rate */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decay Rate per Second
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.decayPerSecond}
                onChange={(e) => handleInputChange('decayPerSecond', parseFloat(e.target.value))}
                min={AUCTION_CONSTANTS.MIN_DECAY_RATE}
                max={AUCTION_CONSTANTS.MAX_DECAY_RATE}
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">USDC/sec</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Range: {AUCTION_CONSTANTS.MIN_DECAY_RATE} - {AUCTION_CONSTANTS.MAX_DECAY_RATE} USDC per second
            </p>
          </div>
        </div>

        {/* Auction Preview */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Auction Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Start Price:</span>
              <p className="text-blue-900">{formData.startPrice.toLocaleString()} USDC</p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Floor Price:</span>
              <p className="text-blue-900">{formData.floorPrice.toLocaleString()} USDC</p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Duration:</span>
              <p className="text-blue-900">{Math.floor(formData.duration / 60)} minutes</p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Decay Rate:</span>
              <p className="text-blue-900">{formData.decayPerSecond} USDC/sec</p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Max Price Drop:</span>
              <p className="text-blue-900">
                {((formData.duration * formData.decayPerSecond)).toLocaleString()} USDC
              </p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Final Price:</span>
              <p className="text-blue-900">
                {Math.max(formData.floorPrice, formData.startPrice - (formData.duration * formData.decayPerSecond)).toLocaleString()} USDC
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !formData.token0 || !formData.token1}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Auction...' : 'Create Encrypted Auction'}
          </button>
        </div>
      </form>
    </div>
  )
}
