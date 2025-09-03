import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, Bitcoin, Coins, Copy, TrendingUp, TrendingDown, ArrowUpDown, Network, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBTCWallet } from '../../hooks/useBTCWallet';
import { useETHWallet } from '../../hooks/useETHWallet';
import { useNGNWallet } from '../../hooks/useNGNWallet';
import { useUSDTAddresses } from '../../hooks/useUSDTAddresses';
import { useUSDTWallet } from '../../hooks/useUSDTWallet';
import QRCodeStyling from 'qr-code-styling';

export default function WalletsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const qrRef = useRef<HTMLCanvasElement>(null);
  const { wallet: btcWallet, loading: btcLoading } = useBTCWallet();
  const { wallet: ethWallet, loading: ethLoading } = useETHWallet();
  const { wallet: ngnWallet, loading: ngnLoading } = useNGNWallet();
  const { wallet: usdtWallet, loading: usdtLoading } = useUSDTWallet();
  const { getAddressByNetwork, loading: addressesLoading } = useUSDTAddresses();


  useEffect(() => {
    if (user && qrRef.current) {
      // Clear existing QR code
      qrRef.current.innerHTML = '';

      const accountInfo = {
        name: user.name,
        email: user.email,
        subAccountId: user.quidaxSubAccountId,
        platform: 'CryptoTrustBank'
      };

      const qrCode = new QRCodeStyling({
        width: 160,
        height: 160,
        data: JSON.stringify(accountInfo),
        dotsOptions: {
          color: '#D4AF37',
          type: 'rounded'
        },
        backgroundOptions: {
          color: '#1A1A1A'
        },
        cornersSquareOptions: {
          color: '#00BFFF',
          type: 'extra-rounded'
        },
        cornersDotOptions: {
          color: '#D4AF37',
          type: 'dot'
        }
      });

      qrCode.append(qrRef.current);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Wallet Management</h1>
        <p className="text-gray-400">Manage your cryptocurrency wallets and addresses</p>
      </div>

      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <h3 className="text-lg font-semibold text-soft-white mb-6">Account Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Quidax Sub Account ID:</p>
              <div className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <span className="text-sm font-mono text-soft-white">{user?.quidaxSubAccountId}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(user?.quidaxSubAccountId || '')}
                  className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Account Name:</p>
                <p className="text-soft-white font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Email:</p>
                <p className="text-soft-white font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-4">Account QR Code</p>
            <div className="bg-gradient-to-br from-dark-gray to-medium-gray p-4 rounded-xl border border-light-gray">
              <div ref={qrRef} className="w-40 h-40" />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Scan to view account details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">NGN Wallet</h4>
            <DollarSign className="h-5 w-5 text-metallic-gold" />
          </div>
          {ngnLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-metallic-gold" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-soft-white mb-2">₦{parseFloat(ngnWallet?.balance || '0').toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-auto">Nigerian Naira</p>
            </>
          )}
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">Bitcoin</h4>
            <Bitcoin className="h-5 w-5 text-orange-600" />
          </div>
          {btcLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-soft-white mb-2">{parseFloat(btcWallet?.balance || '0').toFixed(8)} BTC</p>
              <p className="text-sm text-gray-400 mt-auto">≈ ₦{parseFloat(btcWallet?.convertedBalance || '0').toLocaleString()}</p>
            </>
          )}
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">Ethereum</h4>
            <Coins className="h-5 w-5 text-electric-blue" />
          </div>
          {ethLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-soft-white mb-2">{parseFloat(ethWallet?.balance || '0').toFixed(8)} ETH</p>
              <p className="text-sm text-gray-400 mt-auto">≈ ₦{parseFloat(ethWallet?.convertedBalance || '0').toLocaleString()}</p>
            </>
          )}
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">USDT (All Networks)</h4>
            <DollarSign className="h-5 w-5 text-metallic-gold" />
          </div>
          {usdtLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-metallic-gold" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-soft-white mb-2">{parseFloat(usdtWallet?.balance || '0').toFixed(2)} USDT</p>
              <p className="text-sm text-gray-400 mt-auto">≈ ₦{parseFloat(usdtWallet?.convertedBalance || '0').toLocaleString()}</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <h3 className="text-lg font-semibold text-soft-white mb-6">USDT Network Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-medium-gray rounded-lg border border-light-gray flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div>
                  <h4 className="font-semibold text-soft-white">USDT TRC-20</h4>
                  <p className="text-xs text-gray-400">Tron Network</p>
                </div>
              </div>
              <Network className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mb-2">Balance: {parseFloat(usdtWallet?.balance || '0').toFixed(2)} USDT</p>
            {addressesLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-red-400" />
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-mono break-all">
                {getAddressByNetwork('trc20') || 'Generating...'}
              </p>
            )}
            <button
              onClick={() => navigate('/worker/usdt-wallet')}
              className="w-full mt-auto py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
            >
              View USDT Wallet
            </button>
          </div>

          <div className="p-4 bg-medium-gray rounded-lg border border-light-gray flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-electric-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <div>
                  <h4 className="font-semibold text-soft-white">USDT ERC-20</h4>
                  <p className="text-xs text-gray-400">Ethereum Network</p>
                </div>
              </div>
              <Network className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mb-2">Balance: {parseFloat(usdtWallet?.balance || '0').toFixed(2)} USDT</p>
            {addressesLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-electric-blue" />
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-mono break-all">
                {getAddressByNetwork('erc20') || 'Generating...'}
              </p>
            )}
            <button
              onClick={() => navigate('/worker/usdt-wallet')}
              className="w-full mt-auto py-2 bg-electric-blue bg-opacity-20 text-electric-blue rounded-lg hover:bg-opacity-30 transition-colors text-sm"
            >
              View USDT Wallet
            </button>
          </div>

          <div className="p-4 bg-medium-gray rounded-lg border border-light-gray flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <div>
                  <h4 className="font-semibold text-soft-white">USDT BEP-20</h4>
                  <p className="text-xs text-gray-400">BSC Network</p>
                </div>
              </div>
              <Network className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mb-2">Balance: {parseFloat(usdtWallet?.balance || '0').toFixed(2)} USDT</p>
            {addressesLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-mono break-all">
                {getAddressByNetwork('bep20') || 'Generating...'}
              </p>
            )}
            <button
              onClick={() => navigate('/worker/usdt-wallet')}
              className="w-full mt-auto py-2 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
            >
              View USDT Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <h3 className="text-lg font-semibold text-soft-white mb-4">Wallet Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-metallic-gold hover:bg-metallic-gold hover:bg-opacity-10 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2 text-metallic-gold" />
            <span className="font-medium text-soft-white">Deposit</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-gray-400 hover:bg-medium-gray transition-colors">
            <TrendingDown className="h-5 w-5 mr-2 text-gray-400" />
            <span className="font-medium text-soft-white">Withdraw</span>
          </button>
          <button
            onClick={() => navigate('/worker/trade')}
            className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            <span className="font-medium">Trade</span>
          </button>
        </div>
      </div>
    </div>
  );
}