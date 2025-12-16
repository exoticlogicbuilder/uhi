'use client'

import { useState } from 'react'
import { AuctionCreator } from '@/components/auction/AuctionCreator'
import { AuctionDashboard } from '@/components/auction/AuctionDashboard'
import { BidSubmission } from '@/components/auction/BidSubmission'
import { EncryptedAuction, AuctionFormData } from '@/shared/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'dashboard' | 'bid'>('create')
  const [currentAuction, setCurrentAuction] = useState<EncryptedAuction | null>(null)

  const handleAuctionCreated = (auction: EncryptedAuction) => {
    setCurrentAuction(auction)
    setActiveTab('dashboard')
  }

  return (
    <div className="px-4 py-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Encrypted Dutch Auction Hook
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Confidential token auctions on Uniswap v4 using Fully Homomorphic Encryption
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anti-Sniping</h3>
            <p className="text-gray-600">Hidden price curve prevents bot manipulation and ensures fair participation</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FHE Encryption</h3>
            <p className="text-gray-600">Fully homomorphic encryption enables confidential price calculations</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Price Discovery</h3>
            <p className="text-gray-600">Natural Dutch auction mechanics without revealing strategy</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 justify-center">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Auction
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Auction Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bid')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bid'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit Bid
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'create' && (
          <AuctionCreator onAuctionCreated={handleAuctionCreated} />
        )}
        
        {activeTab === 'dashboard' && (
          <AuctionDashboard currentAuction={currentAuction} />
        )}
        
        {activeTab === 'bid' && (
          <BidSubmission currentAuction={currentAuction} />
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Encrypted Setup</h3>
              <p className="text-gray-600 mb-4">
                Auction parameters (start price, floor, decay rate) are encrypted using FHE before deployment.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Hidden Price Curve</h3>
              <p className="text-gray-600">
                Current price is calculated homomorphically: P = StartPrice - (DecayRate × TimeElapsed)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Encrypted Bids</h3>
              <p className="text-gray-600 mb-4">
                Traders submit encrypted bids that are compared against the hidden current price.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Conditional Execution</h3>
              <p className="text-gray-600">
                Only winning bids are executed, ensuring fair price discovery without revealing strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
