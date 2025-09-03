import React from 'react';
import { Bitcoin, TrendingUp, TrendingDown, ArrowUpDown, Copy, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBTCWallet } from '../../hooks/useBTCWallet';
import { useRates } from '../../hooks/useRates';
import { useTransactions } from '../../hooks/useTransactions';

export default function BTCWalletPage() {
  const navigate = useNavigate();
  const { wallet, loading: walletLoading, error: walletError, refetch, createWallet } = useBTCWallet();
  const { rates } = useRates();
  const { trasactions, loading: transactionsLoading } = useTransactions();

  const btcTransactions = trasactions.filter(tx => 
    tx.market?.id === 'btcngn' || tx.market === 'btcngn'
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatBTCAmount = (amount: string) => {
    return parseFloat(amount).toFixed(8);
  };



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Bitcoin Wallet</h1>
        <p className="text-gray-400">Manage your Bitcoin holdings</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        {walletLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading wallet...</p>
          </div>
        ) : walletError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{walletError}</p>
            <button
              onClick={refetch}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        ) : wallet?.status === 'pending' ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-soft-white mb-2">Wallet Being Created</h2>
            <p className="text-gray-400 mb-4">Your Bitcoin wallet is being generated. This may take a few moments.</p>
            <button
              onClick={refetch}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </button>
          </div>
        ) : !wallet ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bitcoin className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-soft-white mb-2">No Bitcoin Wallet</h2>
            <p className="text-gray-400 mb-4">You don't have a Bitcoin wallet yet. Create one to start trading.</p>
            <button
              onClick={createWallet}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create Bitcoin Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bitcoin className="h-8 w-8 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-soft-white">{formatBTCAmount(wallet.balance || '0')} BTC</h2>
              <p className="text-gray-400">≈ ₦{parseFloat(wallet.convertedBalance || '0').toLocaleString()}</p>
              {wallet.lockedBalance && parseFloat(wallet.lockedBalance) > 0 && (
                <p className="text-sm text-yellow-400 mt-1">Locked: {formatBTCAmount(wallet.lockedBalance)} BTC</p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Wallet Address:</p>
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
            <button className="flex items-center justify-center p-4 bg-orange-500 bg-opacity-20 text-orange-500 rounded-lg hover:bg-opacity-30 transition-colors">
              <TrendingUp className="h-5 w-5 mr-2" />
              Receive BTC
            </button>
            <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-orange-500 hover:bg-orange-500 hover:bg-opacity-10 transition-colors text-soft-white">
              <TrendingDown className="h-5 w-5 mr-2" />
              Send BTC
            </button>
            <button
              onClick={() => navigate('/worker/trade')}
              className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
            >
              <ArrowUpDown className="h-5 w-5 mr-2" />
              Trade BTC
            </button>
          </div>
        )}
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Bitcoin Transaction History</h3>
        </div>
        <div className="p-6">
          {transactionsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {btcTransactions.length > 0 ? (
                btcTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <Bitcoin className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-soft-white">{tx.side} Bitcoin</p>
                        <p className="text-sm text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-soft-white">{tx.volume} BTC</p>
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
                  <Bitcoin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No transactions yet</p>
                  <p className="text-sm text-gray-500">Your Bitcoin transactions will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}