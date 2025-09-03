import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function USDTBEP20Page() {
  const navigate = useNavigate();
  const balance = 250;
  const walletAddress = "0x8894E0a0c962CB723c1976a4421c95949bE2D4E6";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">USDT BEP-20 Wallet</h1>
        <p className="text-gray-400">Manage your USDT on Binance Smart Chain</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-400 text-2xl font-bold">B</span>
          </div>
          <h2 className="text-3xl font-bold text-soft-white">{balance} USDT</h2>
          <p className="text-gray-400">BEP-20 Network • ≈ ₦{(balance * 1540).toLocaleString()}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">BEP-20 Address:</p>
          <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
            <span className="text-sm font-mono text-soft-white">{walletAddress}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(walletAddress)}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" />
            Receive USDT
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-yellow-400 hover:bg-yellow-500 hover:bg-opacity-10 transition-colors text-soft-white">
            <TrendingDown className="h-5 w-5 mr-2" />
            Send USDT
          </button>
          <button 
            onClick={() => navigate('/worker/trade')}
            className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Sell USDT
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">BEP-20 Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-400">No BEP-20 transactions yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}