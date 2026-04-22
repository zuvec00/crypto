import { useState, useMemo } from 'react';
import { Loader2, Wallet, ChevronDown, ArrowRight, CheckCircle, XCircle, Info, RefreshCw } from 'lucide-react';
import { useRates } from '../../hooks/useRates';
import { useAuthStore } from '../../store/authStore';
import { useParentBalance } from '../../hooks/useParentBalance';

export default function FundPage() {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'btc'
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { rates, loading: ratesLoading } = useRates();
  const { user } = useAuthStore();
  const { balance: parentBalance, loading: balanceLoading, refetch: refetchBalance } = useParentBalance();

  const equivalentAmount = useMemo(() => {
    if (!formData.amount || !rates.length) return null;
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return null;

    const currencyMap: { [key: string]: string } = {
      btc: 'btcngn',
      eth: 'ethngn',
      usdt: 'usdtngn'
    };

    const marker = currencyMap[formData.currency];
    const rate = rates.find(r => r.marker === marker);
    
    if (!rate || !rate.buy) return null;

    const buyPrice = parseFloat(rate.buy);
    const cryptoAmount = amount / buyPrice;

    return cryptoAmount.toFixed(8);
  }, [formData.amount, formData.currency, rates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/wallet/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quidaxSubAccountId: user?.quidaxSubAccountId,
          amount: equivalentAmount || formData.amount,
          currency: formData.currency
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setNotification({ type: 'error', message: result.message || 'Failed to fund wallet' });
        setTimeout(() => setNotification(null), 5000);
      } else {
        setNotification({ type: 'success', message: result.message || 'Wallet funded successfully' });
        setTimeout(() => setNotification(null), 5000);
        setFormData({ amount: '', currency: 'btc' });
        refetchBalance();
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Network error occurred. Please try again.' });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 bg-opacity-20 border border-green-500' : 'bg-red-500 bg-opacity-20 border border-red-500'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400" />
          )}
          <p className={notification.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {notification.message}
          </p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Fund Wallet</h1>
        <p className="text-gray-400">Transfer funds from the parent account to your wallet</p>
      </div>

      <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4 flex items-start space-x-3">
        <Info className="h-5 w-5 text-electric-blue flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <p className="font-medium text-soft-white mb-1">How Funding Works</p>
          <p>This feature allows you to move funds from the main parent account to your worker wallet. Enter the amount in Naira (NGN) you wish to transfer, select the cryptocurrency you want to receive, and the system will automatically convert and credit your wallet.</p>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-soft-white">Available Parent Balance</h3>
          <button
            onClick={refetchBalance}
            disabled={balanceLoading}
            className="text-metallic-gold hover:text-gold-hover transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${balanceLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {balanceLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-metallic-gold" />
          </div>
        ) : parentBalance ? (
          <div className="bg-medium-gray rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">NGN Balance</p>
            <p className="text-3xl font-bold text-metallic-gold">
              ₦{parseFloat(parentBalance.balance).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-red-400 text-sm">Failed to load balance</p>
        )}
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray p-6">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Amount (NGN)
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
                placeholder="Enter amount in Naira"
              />
              {equivalentAmount && (
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <span>≈ {equivalentAmount} {formData.currency.toUpperCase()}</span>
                  <ArrowRight className="h-3 w-3 mx-2" />
                  <span className="text-metallic-gold">₦{parseFloat(formData.amount).toLocaleString()}</span>
                </div>
              )}
              {ratesLoading && formData.amount && (
                <div className="mt-2 text-sm text-gray-400 flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  Fetching rate...
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Currency to Receive
              </label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent appearance-none text-soft-white"
                >
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                  <option value="usdt">USDT</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
              className="w-full py-3 px-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Wallet className="h-5 w-5" />
                  <span>Fund Wallet</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
