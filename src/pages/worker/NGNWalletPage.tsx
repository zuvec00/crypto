import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpDown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNGNWallet } from '../../hooks/useNGNWallet';
import { useTransactions } from '../../hooks/useTransactions';

export default function NGNWalletPage() {
  const navigate = useNavigate();
  const { wallet, loading: walletLoading, error: walletError, refetch } = useNGNWallet();
  const { trasactions, loading: transactionsLoading } = useTransactions();

  const ngnTransactions = trasactions.filter(tx => 
    tx.market?.id?.includes('ngn') || tx.market?.includes('ngn')
  );

  const formatNGNAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">NGN Wallet</h1>
        <p className="text-gray-400">Manage your Nigerian Naira balance</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        {walletLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-metallic-gold mx-auto mb-4" />
            <p className="text-gray-400">Loading wallet...</p>
          </div>
        ) : walletError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{walletError}</p>
            <button
              onClick={refetch}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-metallic-gold" />
              </div>
              <h2 className="text-3xl font-bold text-soft-white">₦{formatNGNAmount(wallet?.balance || '0')}</h2>
              <p className="text-gray-400">Available Balance</p>
              {wallet?.lockedBalance && parseFloat(wallet.lockedBalance) > 0 && (
                <p className="text-sm text-yellow-400 mt-1">Locked: ₦{formatNGNAmount(wallet.lockedBalance)}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all">
                <TrendingUp className="h-5 w-5 mr-2" />
                Deposit NGN
              </button>
              <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-metallic-gold hover:bg-metallic-gold hover:bg-opacity-10 transition-colors text-soft-white">
                <TrendingDown className="h-5 w-5 mr-2" />
                Withdraw NGN
              </button>
              <button 
                onClick={() => navigate('/worker/trade')}
                className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
              >
                <ArrowUpDown className="h-5 w-5 mr-2" />
                Buy Crypto
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Recent NGN Transactions</h3>
        </div>
        <div className="p-6">
          {transactionsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mx-auto mb-4" />
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ngnTransactions.length > 0 ? (
                ngnTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-metallic-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-soft-white">{tx.side} {tx.market?.replace('ngn', '').toUpperCase()}</p>
                        <p className="text-sm text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-soft-white">₦{formatNGNAmount(tx.funds || '0')}</p>
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
                  <DollarSign className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No NGN transactions yet</p>
                  <p className="text-sm text-gray-500">Your NGN transactions will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}