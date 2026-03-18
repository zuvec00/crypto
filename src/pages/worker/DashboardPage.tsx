import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Coins, Wallet, ArrowUpDown, Activity, Loader2, Eye, EyeOff, Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useBTCWallet } from '../../hooks/useBTCWallet';
import { useETHWallet } from '../../hooks/useETHWallet';
import { useNGNWallet } from '../../hooks/useNGNWallet';
import { useUSDTWallet } from '../../hooks/useUSDTWallet';
import { useTransactions } from '../../hooks/useTransactions';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showBalances, setShowBalances] = useState(true);
  const { wallet: btcWallet, loading: btcLoading } = useBTCWallet();
  const { wallet: ethWallet, loading: ethLoading } = useETHWallet();
  const { wallet: ngnWallet, loading: ngnLoading } = useNGNWallet();
  const { wallet: usdtWallet, loading: usdtLoading } = useUSDTWallet();
  const { trasactions, loading: transactionsLoading } = useTransactions();

  const recentTransactions = trasactions.slice(0, 5);

  const getCryptoIcon = (market: string) => {
    if (market?.includes('btc')) return <Bitcoin className="h-5 w-5 text-orange-500" />;
    if (market?.includes('eth')) return <Coins className="h-5 w-5 text-electric-blue" />;
    if (market?.includes('usdt')) return <DollarSign className="h-5 w-5 text-metallic-gold" />;
    return <Activity className="h-5 w-5 text-gray-400" />;
  };

  const totalPortfolioValue = (
    parseFloat(ngnWallet?.balance || '0') +
    parseFloat(btcWallet?.convertedBalance || '0') +
    parseFloat(ethWallet?.convertedBalance || '0') +
    parseFloat(usdtWallet?.convertedBalance || '0')
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.name.split(' ')[0]}!</p>
      </div>

      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-soft-white">Portfolio Overview</h2>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center space-x-2 text-gray-400 hover:text-soft-white transition-colors"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="text-sm">{showBalances ? 'Hide' : 'Show'}</span>
          </button>
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-2">Total Portfolio Value</p>
          <p className="text-4xl font-bold text-metallic-gold">
            {showBalances ? `₦${totalPortfolioValue.toLocaleString()}` : '••••••••'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">NGN Balance</p>
              {ngnLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mt-2" />
              ) : (
                <p className="text-2xl font-bold text-soft-white">
                  {showBalances ? `₦${parseFloat(ngnWallet?.balance || '0').toLocaleString()}` : '••••••••'}
                </p>
              )}
            </div>
            <div className="h-12 w-12 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-metallic-gold" />
            </div>
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Bitcoin</p>
              {btcLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-orange-500 mt-2" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-soft-white">
                    {showBalances ? `${parseFloat(btcWallet?.balance || '0').toFixed(8)} BTC` : '••••••••'}
                  </p>
                </>
              )}
            </div>
            <div className="h-12 w-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Bitcoin className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ethereum</p>
              {ethLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-electric-blue mt-2" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-soft-white">
                    {showBalances ? `${parseFloat(ethWallet?.balance || '0').toFixed(8)} ETH` : '••••••••'}
                  </p>
                </>
              )}
            </div>
            <div className="h-12 w-12 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <Coins className="h-6 w-6 text-electric-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">USDT</p>
              {usdtLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mt-2" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-soft-white">
                    {showBalances ? `${parseFloat(usdtWallet?.balance || '0').toFixed(2)} USDT` : '••••••••'}
                  </p>
                </>
              )}
            </div>
            <div className="h-12 w-12 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-metallic-gold" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => navigate('/worker/trade')}
          className="bg-metallic-gold text-primary-black p-6 rounded-xl hover:bg-gold-hover transition-all text-left group"
        >
          <TrendingUp className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Buy Crypto</h3>
          <p className="text-primary-black text-opacity-80 text-sm">Purchase with NGN</p>
        </button>

        <button
          onClick={() => navigate('/worker/trade')}
          className="bg-electric-blue text-soft-white p-6 rounded-xl hover:bg-blue-hover transition-all text-left group"
        >
          <TrendingDown className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Sell Crypto</h3>
          <p className="text-soft-white text-opacity-80 text-sm">Convert to NGN</p>
        </button>

        <button
          onClick={() => navigate('/worker/withdraw')}
          className="bg-green-600 text-soft-white p-6 rounded-xl hover:bg-green-700 transition-all text-left group"
        >
          <Send className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Withdraw</h3>
          <p className="text-soft-white text-opacity-80 text-sm">To bank account</p>
        </button>

        <button
          onClick={() => navigate('/worker/wallets')}
          className="bg-dark-gray border border-medium-gray text-soft-white p-6 rounded-xl hover:border-metallic-gold hover:bg-metallic-gold hover:bg-opacity-10 transition-all text-left group"
        >
          <Wallet className="h-6 w-6 mb-3 text-metallic-gold group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold mb-2">Manage Wallets</h3>
          <p className="text-gray-400 text-sm">View addresses & balances</p>
        </button>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-gray">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Crypto Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medium-gray">
              {transactionsLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mx-auto" />
                  </td>
                </tr>
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            tx.side === "buy"
                              ? "bg-metallic-gold bg-opacity-20"
                              : "bg-red-500 bg-opacity-20"
                          }`}
                        >
                          {tx.side === "buy" ? (
                            <TrendingUp className="h-4 w-4 text-metallic-gold" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-soft-white capitalize">
                            {tx.side} {tx.market?.base_unit?.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-400">
                            #{tx.id?.toString().slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(parseFloat(tx.naira || tx.total || "0"))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
                      {tx.amount || tx.volume} {tx.coin?.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tx.status === "done"
                            ? "bg-green-500 bg-opacity-20 text-green-400"
                            : tx.status === "wait"
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                            : tx.status === "completed"
                            ? "bg-blue-500 bg-opacity-20 text-blue-400"
                            : "bg-red-500 bg-opacity-20 text-red-400"
                        }`}
                      >
                        {tx.status === "done" ? "COMPLETED" : tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(tx.date).toLocaleString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {recentTransactions.length > 0 && (
          <div className="p-4 border-t border-medium-gray text-center">
            <button
              onClick={() => navigate('/worker/transactions')}
              className="text-metallic-gold hover:text-gold-hover transition-colors text-sm font-medium"
            >
              View All Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}