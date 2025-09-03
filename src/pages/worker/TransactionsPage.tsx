import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';


export default function TransactionsPage() {
  const { dailyTransaction, loading, error, refetch } = useTransactions();
  const [typeFilter, setTypeFilter] = useState('all');
  const [coinFilter, setCoinFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    if (!dailyTransaction) return [];

    return dailyTransaction.filter((tx) => {
      const typeMatch = typeFilter === 'all' || tx.type === typeFilter;
      const coinMatch = coinFilter === 'all' || tx.coin === coinFilter;
      return typeMatch && coinMatch;
    });
  }, [dailyTransaction, typeFilter, coinFilter]);

  const exportToCSV = () => {
    if (!filteredTransactions.length) return;

    const headers = ['ID', 'Type', 'Coin', 'Amount', 'Total (NGN)', 'Status', 'Date', 'Fee'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map((tx) => [
        tx.id,
        tx.type.toUpperCase(),
        tx.coin,
        tx.amount,
        tx.totalAmount,
        tx.status.toUpperCase(),
        new Date(tx.date).toLocaleString(),
        tx.fee || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Transaction History</h1>
        <p className="text-gray-400">View and manage all your cryptocurrency transactions</p>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
              >
                <option value="all">All Types</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              <select
                value={coinFilter}
                onChange={(e) => setCoinFilter(e.target.value)}
                className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
              >
                <option value="all">All Coins</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={refetch}
                className="bg-medium-gray text-soft-white px-4 py-2 rounded-lg hover:bg-light-gray transition-all flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={!filteredTransactions.length}
                className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-h-[350px]">
            <thead className="bg-medium-gray">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crypto Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medium-gray">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-metallic-gold mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-red-400 mb-4">Error loading transactions: {error}</p>
                    <button 
                      onClick={refetch}
                      className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${tx.side === 'buy' ? 'bg-metallic-gold bg-opacity-20' : 'bg-red-500 bg-opacity-20'
                          }`}>
                          {tx.side === 'buy' ?
                            <TrendingUp className="h-4 w-4 text-metallic-gold" /> :
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-soft-white capitalize">{tx.side} {tx.market.base_unit}</p>
                          <p className="text-sm text-gray-400">#{tx.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
                      {formatCurrency(tx.total.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
                      {tx.volume.amount} {tx.market.base_unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tx.status === 'done' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                        tx.status === 'wait' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                          tx.status === 'confirm' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                            'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(tx.updated_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}