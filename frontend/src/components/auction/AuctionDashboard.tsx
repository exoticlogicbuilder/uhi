'use client'

import { useState, useEffect } from 'react'
import { EncryptedAuction } from '@/shared/types'

interface AuctionDashboardProps {
  currentAuction: EncryptedAuction | null
}

export function AuctionDashboard({ currentAuction }: AuctionDashboardProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [currentPrice, setCurrentPrice] = useState<string>('Encrypted')

  useEffect(() => {
    if (!currentAuction) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, currentAuction.endTime - now)
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [currentAuction])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else {
      return `${minutes}m ${seconds % 60}s`
    }
  }

  const getStatusColor = () => {
    if (!currentAuction?.active) return 'text-gray-500'
    if (timeRemaining === 0) return 'text-red-500'
    return 'text-green-500'
  }

  const getStatusText = () => {
    if (!currentAuction) return 'No Active Auction'
    if (!currentAuction.active) return 'Auction Ended'
    if (timeRemaining === 0) return 'Time Expired'
    return 'Active'
  }

  if (!currentAuction) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Auction</h3>
          <p className="text-gray-600 mb-6">Create an auction to see the dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Dashboard</h2>
        <p className="text-gray-600">Monitor your encrypted Dutch auction in real-time</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Status</p>
              <p className={`text-lg font-bold ${getStatusColor()}`}>{getStatusText()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Current Price</p>
              <p className="text-lg font-bold text-green-900">{currentPrice}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600">Time Remaining</p>
              <p className="text-lg font-bold text-orange-900">{formatTime(timeRemaining)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Bids</p>
              <p className="text-lg font-bold text-purple-900">Encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Pool Address</label>
            <p className="text-sm text-gray-900 font-mono break-all">{currentAuction.poolAddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Creator</label>
            <p className="text-sm text-gray-900 font-mono break-all">{currentAuction.creator}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Start Time</label>
            <p className="text-sm text-gray-900">{new Date(currentAuction.startTime).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">End Time</label>
            <p className="text-sm text-gray-900">{new Date(currentAuction.endTime).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Encrypted Start Price</label>
            <p className="text-sm text-gray-900 font-mono break-all">{currentAuction.startPrice}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Encrypted Floor Price</label>
            <p className="text-sm text-gray-900 font-mono break-all">{currentAuction.floorPrice}</p>
          </div>
        </div>
      </div>

      {/* FHE Operations Status */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">FHE Operations Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-blue-800">Price calculations are homomorphically encrypted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-blue-800">Bid comparisons performed in encrypted domain</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-blue-800">No sensitive data exposed on-chain</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-blue-800">Anti-sniping protection active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
