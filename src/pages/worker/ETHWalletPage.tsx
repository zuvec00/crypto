import { Coins, TrendingUp, TrendingDown, ArrowUpDown, Copy, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useETHWallet } from '../../hooks/useETHWallet';
import { useTransactions } from '../../hooks/useTransactions';
import { useEffect } from 'react';

export default function ETHWalletPage() {
  const navigate = useNavigate();
  const { wallet, loading: walletLoading, error: walletError, refetch, createWallet } = useETHWallet();
  const { trasactions, loading: transactionsLoading } = useTransactions();

  const ethTransactions = trasactions.filter(
    (tx) => tx.coin === "eth" || tx.market?.base_unit === "eth"
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatETHAmount = (amount: string) => {
    return parseFloat(amount).toFixed(8);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleString('en-NG', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  // const exportToCSV = () => {
  //   if (!ethTransactions.length) return;

  //   const headers = ['ID', 'Type', 'Amount (ETH)', 'Total (NGN)', 'Status', 'Date'];
  //   const csvContent = [
  //     headers.join(','),
  //     ...ethTransactions.map((tx) =>
  //       [
  //         tx.id,
  //         (tx.side || tx.type).toUpperCase(),
  //         tx.volume?.amount || tx.volume,
  //         tx.total?.amount || tx.total,
  //         (tx.state || tx.status).toUpperCase(),
  //         new Date(tx.updated_at || tx.created_at).toLocaleString(),
  //       ].join(',')
  //     ),
  //   ].join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `eth-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };



  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soft-white mb-2">Ethereum Wallet</h1>
          <p className="text-gray-400">
            Manage your Ethereum holdings and transactions
            {ethTransactions.length > 0 && (
              <span className="ml-2 text-metallic-gold">
                • {ethTransactions.length} transaction{ethTransactions.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h2 className="text-lg font-semibold text-soft-white mb-4">Wallet Overview</h2>
          {walletLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-electric-blue mx-auto mb-4" />
              <p className="text-gray-400">Loading wallet...</p>
            </div>
          ) : walletError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{walletError}</p>
              <button
                onClick={refetch}
                className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all"
              >
                Retry
              </button>
            </div>
          ) : wallet?.status === 'pending' ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 text-electric-blue animate-spin mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Wallet being created...</p>
              <button
                onClick={refetch}
                className="bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Check Status
              </button>
            </div>
          ) : !wallet ? (
            <div className="text-center py-8">
              <Coins className="h-8 w-8 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No Ethereum wallet found</p>
              <button
                onClick={createWallet}
                className="bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Wallet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-medium-gray p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Balance</span>
                  <Coins className="h-4 w-4 text-electric-blue" />
                </div>
                <p className="text-xl font-bold text-soft-white">{formatETHAmount(wallet.balance || '0')} ETH</p>
                <p className="text-sm text-gray-400">≈ {formatCurrency(parseFloat(wallet.convertedBalance || '0'))}</p>
              </div>

              {wallet.lockedBalance && parseFloat(wallet.lockedBalance) > 0 && (
                <div className="bg-medium-gray p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Locked</span>
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  </div>
                  <p className="text-xl font-bold text-yellow-400">{formatETHAmount(wallet.lockedBalance)} ETH</p>
                </div>
              )}

              <div className="bg-medium-gray p-4 rounded-lg md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Wallet Address</span>
                  <button
                    onClick={() => copyToClipboard(wallet.address || '')}
                    className="text-gray-400 hover:text-metallic-gold transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-mono text-soft-white break-all">{wallet.address}</p>
              </div>
            </div>
          )}
        </div>

        {wallet && wallet.status === 'ready' && (
          <div className="p-6 border-b border-medium-gray">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-4 bg-electric-blue bg-opacity-20 text-electric-blue rounded-lg hover:bg-opacity-30 transition-colors">
                <TrendingUp className="h-5 w-5 mr-2" />
                Receive ETH
              </button>
              <button className="flex items-center justify-center p-4 bg-medium-gray text-soft-white rounded-lg hover:bg-light-gray transition-colors">
                <TrendingDown className="h-5 w-5 mr-2" />
                Send ETH
              </button>
              <button
                onClick={() => navigate('/worker/trade?currency=eth')}
                className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all"
              >
                <ArrowUpDown className="h-5 w-5 mr-2" />
                Trade ETH
              </button>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Ethereum Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-h-[350px]">
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
              ) : ethTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No Ethereum transactions found
                  </td>
                </tr>
              ) : (
                ethTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${tx.side === "buy"
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
                        className={`px-2 py-1 text-xs font-medium rounded-full ${tx.status === "done"
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
      </div>
    </div>
  );
}