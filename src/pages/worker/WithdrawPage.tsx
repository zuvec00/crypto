//THIS IS JUST A TEST< FOR KYC SETUP, DO NOT RELY ON ANY DETAIL HERE FOR NOW
import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  ChevronDown,
  ArrowLeft,
  DollarSign,
  Bitcoin,
  Coins,
  Loader2,
  Search,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWalletBalances } from '../../hooks/useWalletBalances';
import { useRates } from '../../hooks/useRates';
import banksData from '../../utils/banks.json';
import { apiService } from '../../services/api';
declare global {
  interface Window {
    ramp: {
      initialize: (config: {
        public_key: string;
        reference: string;
        from_currency: string;
        to_currency: string;
        from_amount: string;
        mode: string;
        network: string;
        enableWalletConnect: boolean;
        onClose?: (ref: string) => void;
        onReceiveWalletDetails?: (details: { amount: string; network: string; walletAddress: string }) => void;
        onSuccess?: (transaction: any) => void;
      }) => void;
    };
  }
}

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { balances, loading: balancesLoading, refetch: refetchBalances } = useWalletBalances();
  const { rates, loading: ratesLoading } = useRates();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('USDT');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    bankName: '',
    accountName: ''
  });
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  // Prevents double-recording when both the SDK onSuccess callback and the
  // window message listener fire for the same transaction
  const hasLoggedRampRef = useRef(false);
  // Prevents sending USDT twice if the widget re-emits wallet details
  const hasSentRampRef = useRef(false);
  // Non-null while a Ramp withdrawal is in flight; the text describes the current step
  const [rampStatus, setRampStatus] = useState<string | null>(null);
  const rampProcessing = rampStatus !== null;
  // Recipient details for the withdrawal currently in flight. Kept in a ref so the
  // message-listener effect (registered once on mount) always sees the latest values.
  // Mirrored to localStorage so a page refresh mid-withdrawal doesn't lose the bank
  // details before the withdrawal request is created for the admin.
  const pendingWithdrawalRef = useRef<{
    ngnAmount: number;
    bankDetails: { accountNumber: string; bankName: string; accountName: string };
  } | null>(null);

  const PENDING_WITHDRAWAL_KEY = 'pending_withdrawal_v1';
  const PENDING_WITHDRAWAL_MAX_AGE_MS = 60 * 60 * 1000; // stale after 1 hour

  const savePendingWithdrawal = (pending: NonNullable<typeof pendingWithdrawalRef.current>) => {
    pendingWithdrawalRef.current = pending;
    try {
      localStorage.setItem(PENDING_WITHDRAWAL_KEY, JSON.stringify({ ...pending, savedAt: Date.now() }));
    } catch {
      // Storage full/unavailable — the in-memory ref still covers the normal flow
    }
  };

  const clearPendingWithdrawal = () => {
    pendingWithdrawalRef.current = null;
    localStorage.removeItem(PENDING_WITHDRAWAL_KEY);
  };

  // Restore an in-flight withdrawal after a refresh so a late Ramp success
  // event can still create the admin withdrawal request with bank details
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_WITHDRAWAL_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (
        Date.now() - (saved?.savedAt ?? 0) < PENDING_WITHDRAWAL_MAX_AGE_MS &&
        saved?.ngnAmount > 0 &&
        saved?.bankDetails?.accountNumber
      ) {
        pendingWithdrawalRef.current = {
          ngnAmount: saved.ngnAmount,
          bankDetails: saved.bankDetails,
        };
      } else {
        localStorage.removeItem(PENDING_WITHDRAWAL_KEY);
      }
    } catch {
      localStorage.removeItem(PENDING_WITHDRAWAL_KEY);
    }
  }, []);

  const logRampSuccess = async (payload?: any) => {
    if (hasLoggedRampRef.current) return;
    hasLoggedRampRef.current = true;
    const pending = pendingWithdrawalRef.current;
    try {
      const normalizedPayload = {
        coin: payload?.from_currency || payload?.coin || 'usdt',
        amount: payload?.amount || payload?.from_amount || payload?.volume || '0',
        naira: payload?.naira || payload?.to_amount || payload?.fiat_amount || (pending ? String(pending.ngnAmount) : '0'),
        reference: payload?.reference || payload?.id || payload?.transactionId || payload?.transaction_id,
        transactionId: payload?.id || payload?.transactionId || payload?.transaction_id,
        status: payload?.status || 'completed',
        mode: payload?.mode || 'sell',
        network: payload?.network || 'BEP20',
        source: 'ramp',
        ngnAmount: pending ? String(pending.ngnAmount) : undefined,
        bankDetails: pending?.bankDetails,
      };

      await apiService.recordRampTransaction(normalizedPayload);
      console.log('Ramp transaction logged successfully.');
      setRampStatus(null);
      clearPendingWithdrawal();
      void refetchBalances();

      if (pending) {
        alert(
          `Withdrawal request created! ₦${pending.ngnAmount.toLocaleString()} will be sent to ` +
          `${pending.bankDetails.accountName} — ${pending.bankDetails.accountNumber} (${pending.bankDetails.bankName}), ` +
          'typically within 6–15 minutes.'
        );
        setWithdrawAmount('');
        setBankDetails({ accountNumber: '', bankName: '', accountName: '' });
        setBankSearch('');
      } else {
        alert('Ramp transaction completed successfully.');
      }
    } catch (error) {
      // Allow the other event path (or a retry) to attempt logging again
      hasLoggedRampRef.current = false;
      setRampStatus(null);
      console.error('Failed to log Ramp transaction:', error);
      alert('Ramp transaction completed, but the transaction log could not be updated. Please contact support.');
    }
  };

  const autoSendToRampAddress = async (details: { amount: string; network: string; walletAddress: string }) => {
    if (hasSentRampRef.current) return;
    hasSentRampRef.current = true;

    const sendAmount = parseFloat(details?.amount || '0');
    if (!details?.walletAddress || !sendAmount || sendAmount <= 0) {
      hasSentRampRef.current = false;
      alert('Ramp did not provide valid wallet details. Please close the widget and try again.');
      return;
    }

    // Fetch a fresh balance — the hook's cached list is stale right after a swap.
    // Best-effort: if the fetch fails, proceed and let the backend enforce the balance.
    try {
      const fresh = await apiService.getWalletBalance('usdt');
      const usdtBalance = parseFloat(String(fresh?.balance || '0'));
      if (usdtBalance < sendAmount) {
        hasSentRampRef.current = false;
        alert(`Insufficient USDT balance for this withdrawal. Required: ${sendAmount}, Available: ${usdtBalance}`);
        return;
      }
    } catch {
      console.warn('Could not verify USDT balance before sending; continuing.');
    }

    setRampStatus('Your USDT is being sent to Ramp. Please do not close or refresh this page until you see the confirmation.');
    alert('Your withdrawal is now processing. Please do not close or refresh this page until you see the confirmation.');

    try {
      await apiService.withdrawCrypto({
        currency: 'usdt',
        amount: details.amount,
        fund_uid: details.walletAddress,
        network: (details.network || 'bep20').toLowerCase(),
        reference: `RAMP-${Date.now()}`,
        transaction_note: 'Ramp instant withdrawal',
        narration: `Send ${details.amount} USDT to Ramp`,
      });
      console.log('USDT sent to Ramp address. Waiting for Ramp to confirm the deposit...');
      setRampStatus('USDT sent — waiting for Ramp to confirm the deposit and pay out. Please keep this page open.');
    } catch (error) {
      hasSentRampRef.current = false;
      setRampStatus(null);
      console.error('Failed to send USDT to Ramp address:', error);
      alert(
        `Automatic transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        `You can still send ${details.amount} USDT manually to ${details.walletAddress} (${details.network}).`
      );
    }
  };

  useEffect(() => {
    // Fallback in case the SDK's onSuccess callback doesn't fire: the widget
    // iframe posts events to the parent window via postMessage
    const RAMP_WIDGET_ORIGIN = 'https://ramp.quidax.io';

    const handleRampMessage = (event: MessageEvent) => {
      if (event.origin !== RAMP_WIDGET_ORIGIN) return;

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      console.log('Ramp event received:', data);

      if (String(data.type || data.event || '') === 'quidaxRampTransactionSuccess') {
        void logRampSuccess(data.payload || data.transaction || data);
      }
    };

    window.addEventListener('message', handleRampMessage);
    return () => window.removeEventListener('message', handleRampMessage);
  }, []);

  // Warn before leaving the page while a Ramp withdrawal is in flight
  useEffect(() => {
    if (!rampProcessing) return;
    const warnBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [rampProcessing]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.accountName) {
      alert('Please fill in all required fields and verify the bank account');
      return;
    }

    if (!window.ramp) {
      alert('Ramp widget not loaded. Please refresh the page.');
      return;
    }

    const ngnAmount = parseFloat(withdrawAmount);
    if (!ngnAmount || ngnAmount <= 0) {
      alert('Enter a valid NGN amount.');
      return;
    }

    const usdtNgnRate = getRateForCurrency('USDT');
    if (!usdtNgnRate) {
      alert('Exchange rates are still loading. Please try again in a moment.');
      return;
    }

    // Round up to USDT's 2dp precision so the NGN target is covered
    const usdtNeeded = Math.ceil((ngnAmount / usdtNgnRate) * 100) / 100;
    // Ramp's minimum sell is 2 USDT; anything below makes the widget fail
    if (usdtNeeded < 2) {
      alert(`The minimum withdrawal is 2 USDT (about ₦${Math.ceil(2 * usdtNgnRate).toLocaleString()}).`);
      return;
    }

    const coin = withdrawCurrency.toLowerCase();

    try {
      // Use existing USDT first (e.g. left over from an earlier conversion);
      // only swap when the balance doesn't cover the withdrawal
      const fresh = await apiService.getWalletBalance('usdt').catch(() => null);
      const usdtBalance = parseFloat(String(
        fresh?.balance ?? balances.find(b => b.currency.toLowerCase() === 'usdt')?.balance ?? '0'
      ));

      let volumeToSwap: string | null = null;
      if (usdtBalance < usdtNeeded) {
        if (coin === 'usdt') {
          alert(`Insufficient USDT balance. Required: ${usdtNeeded.toFixed(2)}, Available: ${usdtBalance}`);
          return;
        }

        const coinNgnRate = getRateForCurrency(withdrawCurrency);
        if (!coinNgnRate) {
          alert(`No exchange rate available for ${withdrawCurrency}. Please try again later.`);
          return;
        }

        const coinUsdtPrice = coinNgnRate / usdtNgnRate;
        // 1% buffer so trade fees/slippage don't leave us short of USDT;
        // any leftover USDT stays in the user's wallet
        volumeToSwap = ((usdtNeeded * 1.01) / coinUsdtPrice).toFixed(coin === 'btc' ? 8 : 6);

        const coinBalance = parseFloat(String(balances.find(b => b.currency.toLowerCase() === coin)?.balance || '0'));
        if (coinBalance < parseFloat(volumeToSwap)) {
          alert(`Insufficient ${withdrawCurrency} balance. Required: ~${volumeToSwap}, Available: ${coinBalance}`);
          return;
        }
      }

      const confirmed = window.confirm(
        `${volumeToSwap ? `About ${volumeToSwap} ${withdrawCurrency} will be converted to USDT, then ` : ''}` +
        `${usdtNeeded.toFixed(2)} USDT will be sold via Ramp and ₦${ngnAmount.toLocaleString()} sent to ` +
        `${bankDetails.accountName} — ${bankDetails.accountNumber} (${bankDetails.bankName}). Continue?`
      );
      if (!confirmed) return;

      if (volumeToSwap) {
        setRampStatus(`Converting your ${withdrawCurrency} to USDT. Please do not close or refresh this page.`);
        await apiService.swapToUsdt(coin, volumeToSwap);
        void refetchBalances();
      }
    } catch (error) {
      setRampStatus(null);
      alert(
        `Could not convert ${withdrawCurrency} to USDT: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        'Nothing was withdrawn.'
      );
      return;
    }

    // New widget session — allow one send and one log for the upcoming transaction
    hasLoggedRampRef.current = false;
    hasSentRampRef.current = false;
    savePendingWithdrawal({ ngnAmount, bankDetails: { ...bankDetails } });

    window.ramp.initialize({
      public_key: import.meta.env.VITE_RAMP_PUBLIC_KEY,
      reference: `WD-${Date.now()}`,
      from_currency: 'usdt',
      to_currency: 'ngn',
      from_amount: usdtNeeded.toFixed(2),
      mode: 'sell',
      network: 'BEP20',
      enableWalletConnect: false,
      onClose: (ref) => {
        console.log('Ramp closed:', ref);
        setRampStatus(null);
      },
      onReceiveWalletDetails: (walletDetails) => {
        console.log('Ramp wallet details:', walletDetails);
        void autoSendToRampAddress(walletDetails);
      },
      onSuccess: (transaction) => {
        console.log('Transaction successful:', transaction);
        void logRampSuccess(transaction);
      }
    });
  };

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
                  <p className="text-sm text-gray-400 mt-1">Your crypto is converted automatically — the NGN typically arrives within 6–15 minutes</p>
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

                  <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Zap className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-400">Fast Processing</p>
                        <p className="text-xs text-green-300 mt-1">
                          Your crypto is converted automatically and the NGN is sent to the bank account above —
                          typically within 6–15 minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleWithdraw}
                    disabled={rampProcessing || !withdrawAmount || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.accountName}
                    className="w-full py-3 px-4 bg-electric-blue text-soft-white rounded-lg font-medium transition-all hover:bg-blue-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {rampProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing Withdrawal...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Withdrawal Request
                      </>
                    )}
                  </button>

                  {rampStatus && (
                    <div className="mt-3 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-3 flex items-start space-x-2">
                      <Loader2 className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0 animate-spin" />
                      <p className="text-xs text-yellow-300">{rampStatus}</p>
                    </div>
                  )}
                </div>
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
                  <span className="text-gray-400">2. Crypto converted to NGN automatically</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">3. Admin sends NGN to your bank account</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">4. Typically completes in 6–15 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}