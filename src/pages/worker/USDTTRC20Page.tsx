import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function USDTTRC20Page() {
  const navigate = useNavigate();
  const balance = 500;
  const walletAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  const mockTransactions = [
    { id: '3', type: 'Buy', coin: 'USDT-TRC20', amount: '₦100,000', crypto: '65 USDT', status: 'Failed', date: '2024-01-14 16:45' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">USDT TRC-20 Wallet</h1>
        <p className="text-gray-400">Manage your USDT on Tron Network</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl font-bold">T</span>
          </div>
          <h2 className="text-3xl font-bold text-soft-white">{balance} USDT</h2>
          <p className="text-gray-400">TRC-20 Network • ≈ ₦{(balance * 1540).toLocaleString()}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">TRC-20 Address:</p>
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
          <button className="flex items-center justify-center p-4 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" />
            Receive USDT
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-colors text-soft-white">
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
          <h3 className="text-lg font-semibold text-soft-white">TRC-20 Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 font-bold">T</span>
                  </div>
                  <div>
                    <p className="font-medium text-soft-white">{tx.type} USDT TRC-20</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-soft-white">{tx.crypto}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500 bg-opacity-20 text-red-400">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}