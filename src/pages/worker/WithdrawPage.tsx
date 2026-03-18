import React, { useState } from 'react';
import {
  Send,
  ChevronDown,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Bitcoin,
  Coins,
  Loader2,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWalletBalances } from '../../hooks/useWalletBalances';
import { useRates } from '../../hooks/useRates';
import { useWithdraw } from '../../hooks/useWithdraw';
import banksData from '../../utils/banks.json';
import { apiService } from '../../services/api';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { balances, loading: balancesLoading } = useWalletBalances();
  const { rates, loading: ratesLoading } = useRates();
  const { withdrawToBank, loading: isWithdrawing } = useWithdraw();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('BTC');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    bankName: '',
    accountName: ''
  });
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const filteredBanks = banksData.filter(bank =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  ).slice(0, 10);

  const selectBank = (bankName: string) => {
    setBankDetails({ ...bankDetails, bankName, accountName: '' });
    setBankSearch(bankName);
    setShowBankDropdown(false);
    setVerificationError('');
  };

  const verifyBankAccount = async () => {
    if (!bankDetails.accountNumber || !bankDetails.bankName) {
      setVerificationError('Please enter account number and select bank');
      return;
    }

    const selectedBank = banksData.find(b => b.name === bankDetails.bankName);
    if (!selectedBank) {
      setVerificationError('Invalid bank selected');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {

      const data = await apiService.validateBankAccount({
        accountNumber: bankDetails.accountNumber,
        bankCode: selectedBank.code
      })

      if (data.error) {
        setVerificationError(data.error);
      } else if (data?.accountName) {
        setBankDetails({ ...bankDetails, accountName: data?.accountName });
      } else {
        setVerificationError('Could not verify account');
      }
    } catch (error) {
      setVerificationError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const cryptoRates = {
    BTC: 20000000,
    ETH: 800000,
    USDT: 1540
  };

  // Get real rates from API
  const getRateForCurrency = (currency: string) => {
    const rate = rates.find(r => r.marker.toLowerCase().includes(currency.toLowerCase()));
    return rate ? parseFloat(rate.sell) : cryptoRates[currency as keyof typeof cryptoRates] || 0;
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.accountName) {
      alert('Please fill in all required fields');
      return;
    }

    // Check sufficient balance
    const rate = getRateForCurrency(withdrawCurrency);
    const requiredCrypto = parseFloat(withdrawAmount) / rate;
    const currentBalance = balances.find(b => b.currency.toLowerCase() === withdrawCurrency.toLowerCase())?.balance || 0;

    if (currentBalance < requiredCrypto) {
      alert(`Insufficient ${withdrawCurrency} balance. Required: ${requiredCrypto.toFixed(8)}, Available: ${currentBalance}`);
      return;
    }

    const result = await withdrawToBank(
      parseFloat(withdrawAmount),
      withdrawCurrency,
      bankDetails
    );

    if (result.success) {
      alert(`Withdrawal request submitted successfully! Transfer ID: ${result.data?.transfer_id}`);
      setWithdrawAmount('');
      setBankDetails({ accountNumber: '', bankName: '', accountName: '' });
      setBankSearch('');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-primary-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/worker')}
            className="flex items-center text-gray-400 hover:text-metallic-gold transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-soft-white mb-2">Withdraw to Bank Account</h1>
            <p className="text-gray-400">Convert your cryptocurrency to NGN and withdraw to your bank account</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-dark-gray rounded-xl border border-medium-gray">
                <div className="p-6 border-b border-medium-gray">
                  <h3 className="text-lg font-semibold text-soft-white">Withdrawal Request</h3>
                  <p className="text-sm text-gray-400 mt-1">Admin will process your withdrawal manually after crypto conversion</p>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-soft-white mb-2">Select Cryptocurrency to Convert</label>
                    <div className="relative">
                      <select
                        value={withdrawCurrency}
                        onChange={(e) => setWithdrawCurrency(e.target.value)}
                        className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent appearance-none text-soft-white"
                      >
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="USDT">USDT (All Networks)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-white mb-2">NGN Amount to Withdraw</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500"
                      placeholder="Enter amount in NGN"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-soft-white">Bank Account Details</h4>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Account Number</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={bankDetails.accountNumber}
                          onChange={(e) => {
                            setBankDetails({ ...bankDetails, accountNumber: e.target.value, accountName: '' });
                            setVerificationError('');
                          }}
                          maxLength={10}
                          className="flex-1 p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500"
                          placeholder="Enter 10-digit account number"
                        />
                        <button
                          type="button"
                          onClick={verifyBankAccount}
                          disabled={isVerifying || !bankDetails.accountNumber || !bankDetails.bankName}
                          className="px-4 py-3 bg-metallic-gold text-primary-black rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isVerifying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                      {verificationError && (
                        <p className="text-red-500 text-xs mt-1">{verificationError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bank Name</label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="text"
                            value={bankSearch}
                            onChange={(e) => {
                              setBankSearch(e.target.value);
                              setShowBankDropdown(true);
                            }}
                            onFocus={() => setShowBankDropdown(true)}
                            className="w-full pl-10 pr-4 py-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500"
                            placeholder="Search for your bank"
                          />
                        </div>
                        {showBankDropdown && filteredBanks.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-medium-gray border border-light-gray rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredBanks.map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => selectBank(bank.name)}
                                className="w-full px-4 py-3 text-left hover:bg-light-gray text-soft-white border-b border-light-gray last:border-b-0"
                              >
                                {bank.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Account Name</label>
                      <input
                        type="text"
                        value={bankDetails.accountName}
                        readOnly
                        className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg text-soft-white placeholder-gray-500 cursor-not-allowed opacity-75"
                        placeholder="Account name will appear after verification"
                      />
                    </div>
                  </div>
                </div>

                {withdrawAmount && (
                  <div className="p-4 bg-medium-gray rounded-lg border border-light-gray">
                    <p className="text-sm text-gray-400 mb-2">Withdrawal Summary:</p>
                    <div className="space-y-1">
                      <p className="text-sm text-soft-white">
                        NGN Amount: ₦{parseFloat(withdrawAmount).toLocaleString()}
                      </p>
                      <p className="text-sm text-soft-white">
                        Crypto Required: {(parseFloat(withdrawAmount) / getRateForCurrency(withdrawCurrency)).toFixed(6)} {withdrawCurrency}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Rate: ₦{getRateForCurrency(withdrawCurrency).toLocaleString()} per {withdrawCurrency}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400">Processing Notice</p>
                      <p className="text-xs text-yellow-300 mt-1">
                        Your crypto will be transferred to admin for manual conversion to NGN and bank withdrawal. Processing may take 1-2 business days.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || !withdrawAmount || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.accountName}
                  className="w-full py-3 px-4 bg-electric-blue text-soft-white rounded-lg font-medium transition-all hover:bg-blue-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isWithdrawing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Withdrawal Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
              <h3 className="font-semibold text-soft-white mb-4">Your Crypto Balances</h3>
              {balancesLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mx-auto" />
                </div>
              ) : (
                <div className="space-y-3">
                  {balances.map((balance) => {
                    const getIcon = () => {
                      if (balance.currency === 'btc') return <Bitcoin className="h-4 w-4 text-orange-500" />;
                      if (balance.currency === 'eth') return <Coins className="h-4 w-4 text-electric-blue" />;
                      if (balance.currency === 'usdt') return <DollarSign className="h-4 w-4 text-metallic-gold" />;
                      return <DollarSign className="h-4 w-4 text-metallic-gold" />;
                    };

                    return (
                      <div key={balance.currency} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getIcon()}
                          <span className="text-gray-400">{balance.currency.toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-soft-white">
                          {parseFloat(balance.balance).toFixed(balance.currency === 'ngn' ? 0 : balance.currency === 'btc' ? 8 : 6)} {balance.currency.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
              <h3 className="font-semibold text-soft-white mb-4">Withdrawal Process</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-metallic-gold rounded-full"></div>
                  <span className="text-gray-400">1. Submit withdrawal request</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">2. Crypto transferred to admin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">3. Admin converts to NGN</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">4. NGN sent to your bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}