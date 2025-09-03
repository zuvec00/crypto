import { useMemo } from 'react';
import { Users, TrendingUp, DollarSign, Calendar, BarChart3, ArrowUp, Bitcoin, Coins, Loader2 } from 'lucide-react';
import { useTransactionStats } from '../../hooks/useTransactionStats';
import { useVolumeTraded } from '../../hooks/useVolumeTraded';
import { useUsers } from '../../hooks/useUsers';
import { useTransactionTrend } from '../../hooks/useTransactionTrend';
import { TransactionTrendChart } from '../../components/TransactionTrendChart';
import { CryptoDistributionChart } from '../../components/CryptoDistributionChart';

export default function AdminDashboardPage() {
  const { stats, loading, error } = useTransactionStats();
  const { volumeData, loading: volumeLoading } = useVolumeTraded();
  const { users, loading: usersLoading } = useUsers();
  const { trendData, loading: trendLoading } = useTransactionTrend();

  const activeUsers = useMemo(() => 
    users.filter(user => user.status === 'active').length, [users]
  );

  const totalVolume = useMemo(() => volumeData ? 
    (volumeData.btc?.total || 0) + (volumeData.eth?.total || 0) + (volumeData.usdt?.total || 0) : 0, 
    [volumeData]
  );

  const calculateVolume = useMemo(() => (transactions: any[]) => {
    return transactions?.reduce((sum, tx) => sum + parseFloat(tx.total?.amount || '0'), 0) || 0;
  }, []);

  const { dailyVolume, weeklyVolume, monthlyVolume } = useMemo(() => ({
    dailyVolume: calculateVolume(stats?.dailyTransactions),
    weeklyVolume: calculateVolume(stats?.weeklyTransactions),
    monthlyVolume: calculateVolume(stats?.monthlyTransactions)
  }), [stats, calculateVolume]);

  const DAILY_TARGET = 300
  const WEEKLY_TARGET = 2000
  const MONTHLY_TARGET = 10000
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor CryptoChoice Bank of Africa platform activity and manage users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-metallic-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-soft-white">Daily Transactions</h3>
                <p className="text-sm text-gray-400">Last 24 hours</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-metallic-gold" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-soft-white">{stats?.dailyTransactions?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-soft-white font-medium">₦{(dailyVolume / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg per transaction:</span>
                  <span className="text-soft-white font-medium">
                    ₦{stats?.dailyTransactions?.length ? (dailyVolume / stats.dailyTransactions.length).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="w-full bg-medium-gray rounded-full h-2">
                  <div
                    className="bg-metallic-gold h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((stats?.dailyTransactions?.length || 0) / DAILY_TARGET * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <div className="pt-2 border-t border-medium-gray">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Target: {DAILY_TARGET}</span>
                    <span>{Math.round((stats?.dailyTransactions?.length || 0) / DAILY_TARGET * 100)}% achieved</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-soft-white">Weekly Transactions</h3>
                <p className="text-sm text-gray-400">Last 7 days</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-soft-white">{stats?.weeklyTransactions?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-soft-white font-medium">₦{(weeklyVolume / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily average:</span>
                  <span className="text-soft-white font-medium">{Math.round(weeklyVolume / 7)} txns</span>
                </div>
                <div className="w-full bg-medium-gray rounded-full h-2">
                  <div
                    className="bg-metallic-gold h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((stats?.weeklyTransactions?.length || 0) / WEEKLY_TARGET * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <div className="pt-2 border-t border-medium-gray">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Target: {WEEKLY_TARGET}</span>
                    <span>{Math.round((stats?.weeklyTransactions?.length || 0) / WEEKLY_TARGET * 100)}% achieved</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-soft-white">Monthly Transactions</h3>
                <p className="text-sm text-gray-400">Last 30 days</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-soft-white">{stats?.monthlyTransactions?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-soft-white font-medium">₦{(monthlyVolume / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily average:</span>
                  <span className="text-soft-white font-medium">{Math.round(monthlyVolume / 30)} txns</span>
                </div>
                <div className="w-full bg-medium-gray rounded-full h-2">
                  <div
                    className="bg-metallic-gold h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((stats?.monthlyTransactions?.length || 0) / MONTHLY_TARGET * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <div className="pt-2 border-t border-medium-gray">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Target: {MONTHLY_TARGET}</span>
                    <span>{Math.round((stats?.monthlyTransactions?.length || 0) / MONTHLY_TARGET * 100)}% achieved</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
              <Bitcoin className="h-5 w-5 text-metallic-gold" />
            </div>
          </div>
          {volumeLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-metallic-gold" />
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-400">Bitcoin Volume</p>
              <p className="text-2xl font-bold text-soft-white">₦{((volumeData?.btc?.total || 0) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-400 mt-1">{(volumeData?.btc?.volume || 0).toFixed(4)} BTC traded</p>
            </div>
          )}
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <Coins className="h-5 w-5 text-electric-blue" />
            </div>
          </div>
          {volumeLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-electric-blue" />
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-400">Ethereum Volume</p>
              <p className="text-2xl font-bold text-soft-white">₦{((volumeData?.eth?.total || 0) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-400 mt-1">{(volumeData?.eth?.volume || 0).toFixed(2)} ETH traded</p>
            </div>
          )}
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
          </div>
          {volumeLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-green-400" />
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-400">USDT Volume</p>
              <p className="text-2xl font-bold text-soft-white">₦{((volumeData?.usdt?.total || 0) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-400 mt-1">{(volumeData?.usdt?.volume || 0).toLocaleString()} USDT traded</p>
            </div>
          )}
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          {usersLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-soft-white">{activeUsers}</p>
              <p className="text-xs text-gray-400 mt-1">{users.length} total users</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            {volumeLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-400">Total Volume</p>
                <p className="text-3xl font-bold text-soft-white">₦{(totalVolume / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-metallic-gold mt-1">All cryptocurrencies combined</p>
              </div>
            )}
            <div className="h-12 w-12 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-electric-blue" />
            </div>
          </div>
        </div>
        
        <CryptoDistributionChart volumeData={volumeData} loading={volumeLoading} />
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-xl font-bold text-soft-white">Recent Platform Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-gray">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Coin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medium-gray">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mx-auto mb-2" />
                    <p className="text-gray-400">Loading transactions...</p>
                  </td>
                </tr>
              ) : stats?.dailyTransactions?.slice(0, 5).map((tx, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">{tx.user?.name || tx.user?.email || `User ${tx.id || index + 1}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">{tx.market?.base_unit?.toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white capitalize">{tx.side}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">₦{parseFloat(tx.total?.amount || '0').toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${tx.state === 'done' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                      tx.state === 'wait' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                        'bg-red-500 bg-opacity-20 text-red-400'
                      }`}>
                      {tx.state === 'done' ? 'Successful' : tx.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(tx.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}