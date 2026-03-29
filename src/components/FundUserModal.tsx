import React, { useState, useMemo } from 'react';
import { X, Loader2, Wallet, ChevronDown, ArrowRight } from 'lucide-react';
import { useRates } from '../hooks/useRates';

interface FundUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    quidaxSubAccountId?: string;
  };
  onFund: (data: { quidaxSubAccountId: string; amount: string; currency: string }) => Promise<{ success: boolean; error?: string }>;
}

export default function FundUserModal({ isOpen, onClose, user, onFund }: FundUserModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'btc'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { rates, loading: ratesLoading } = useRates();

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
    setError(null);

    const result = await onFund({
      quidaxSubAccountId: user.quidaxSubAccountId || '',
      amount: equivalentAmount || formData.amount,
      currency: formData.currency
    });

    if (result.success) {
      setFormData({ amount: '', currency: 'btc' });
      onClose();
    } else {
      setError(result.error || 'Failed to fund user');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-96 bg-dark-gray border-l border-medium-gray transform transition-transform duration-300 z-50">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-soft-white">Fund User Wallet</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-soft-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-medium-gray rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 bg-metallic-gold rounded-full flex items-center justify-center">
                <span className="text-primary-black font-bold">
                  {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-soft-white">{user.firstname} {user.lastname}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-light-gray">
              <p className="text-xs text-gray-400 mb-1">Sub Account ID</p>
              <p className="text-sm font-mono text-soft-white break-all">
                {user.quidaxSubAccountId || 'Not available'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-soft-white mb-1">Amount (NGN)</label>
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
              <label className="block text-sm font-medium text-soft-white mb-1">Currency to Receive</label>
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

            {error && (
              <div className="text-red-400 text-sm p-3 bg-red-500 bg-opacity-10 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-light-gray text-gray-400 rounded-lg hover:bg-medium-gray transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Fund Wallet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
