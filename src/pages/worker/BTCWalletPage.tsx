import { Bitcoin, TrendingUp, TrendingDown, ArrowUpDown, Copy, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBTCWallet } from '../../hooks/useBTCWallet';
import { useTransactions } from '../../hooks/useTransactions';

export default function BTCWalletPage() {
  const navigate = useNavigate();
  const { wallet, loading: walletLoading, error: walletError, refetch, createWallet } = useBTCWallet();
  const { trasactions, loading: transactionsLoading } = useTransactions();



  const btcTransactions = trasactions.filter(
    (tx) => tx.coin === "btc" || tx.market?.base_unit === "btc"
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
              onClick={() => navigate('/worker/trade?currency=btc')}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-soft-white">Bitcoin Transaction History</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Add refetch logic here if needed
                }}
                disabled={transactionsLoading}
                className="bg-medium-gray text-soft-white px-4 py-2 rounded-lg hover:bg-light-gray transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${transactionsLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
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
              ) : btcTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No Bitcoin transactions found
                  </td>
                </tr>
              ) : (
                btcTransactions.map((tx) => (
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