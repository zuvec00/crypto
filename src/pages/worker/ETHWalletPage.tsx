import React from 'react';
import { Coins, TrendingUp, TrendingDown, ArrowUpDown, Copy, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useETHWallet } from '../../hooks/useETHWallet';
import { useRates } from '../../hooks/useRates';
import { useTransactions } from '../../hooks/useTransactions';

export default function ETHWalletPage() {
  const navigate = useNavigate();
  const { wallet, loading: walletLoading, error: walletError, refetch, createWallet } = useETHWallet();
  const { rates } = useRates();
  const { trasactions, loading: transactionsLoading } = useTransactions();

  const ethTransactions = trasactions.filter(tx => 
    tx.market?.id === 'ethngn' || tx.market === 'ethngn'
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatETHAmount = (amount: string) => {
    return parseFloat(amount).toFixed(8);
  };



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Ethereum Wallet</h1>
        <p className="text-gray-400">Manage your Ethereum holdings</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        {walletLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-electric-blue mx-auto mb-4" />
            <p className="text-gray-400">Loading wallet...</p>
          </div>
        ) : walletError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{walletError}</p>
            <button
              onClick={refetch}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        ) : wallet?.status === 'pending' ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-electric-blue animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-soft-white mb-2">Wallet Being Created</h2>
            <p className="text-gray-400 mb-4">Your Ethereum wallet is being generated. This may take a few moments.</p>
            <button
              onClick={refetch}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </button>
          </div>
        ) : !wallet ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="h-8 w-8 text-electric-blue" />
            </div>
            <h2 className="text-xl font-bold text-soft-white mb-2">No Ethereum Wallet</h2>
            <p className="text-gray-400 mb-4">You don't have an Ethereum wallet yet. Create one to start trading.</p>
            <button
              onClick={createWallet}
              className="px-6 py-3 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Ethereum Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-8 w-8 text-electric-blue" />
              </div>
              <h2 className="text-3xl font-bold text-soft-white">{formatETHAmount(wallet.balance || '0')} ETH</h2>
              <p className="text-gray-400">≈ ₦{parseFloat(wallet.convertedBalance || '0').toLocaleString()}</p>
              {wallet.lockedBalance && parseFloat(wallet.lockedBalance) > 0 && (
                <p className="text-sm text-yellow-400 mt-1">Locked: {formatETHAmount(wallet.lockedBalance)} ETH</p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Ethereum Address:</p>
              <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
                <span className="text-sm font-mono text-soft-white break-all">{wallet.address}</span>
                <button
                  onClick={() => copyToClipboard(wallet.address || '')}
                  className="p-2 text-gray-400 hover:text-metallic-gold transition-colors ml-2 flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {wallet && wallet.status === 'ready' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-electric-blue bg-opacity-20 text-electric-blue rounded-lg hover:bg-opacity-30 transition-colors">
              <TrendingUp className="h-5 w-5 mr-2" />
              Receive ETH
            </button>
            <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-electric-blue hover:bg-electric-blue hover:bg-opacity-10 transition-colors text-soft-white">
              <TrendingDown className="h-5 w-5 mr-2" />
              Send ETH
            </button>
            <button
              onClick={() => navigate('/worker/trade')}
              className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all"
            >
              <ArrowUpDown className="h-5 w-5 mr-2" />
              Trade ETH
            </button>
          </div>
        )}
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Ethereum Transaction History</h3>
        </div>
        <div className="p-6">
          {transactionsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-electric-blue mx-auto mb-4" />
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ethTransactions.length > 0 ? (
                ethTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center">
                        <Coins className="h-5 w-5 text-electric-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-soft-white">{tx.side} Ethereum</p>
                        <p className="text-sm text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-soft-white">{tx.volume} ETH</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.state === 'done' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                        tx.state === 'wait' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                        'bg-red-500 bg-opacity-20 text-red-400'
                      }`}>
                        {tx.state}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No transactions yet</p>
                  <p className="text-sm text-gray-500">Your Ethereum transactions will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}