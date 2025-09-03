import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpDown, 
  History, 
  Settings, 
  LogOut, 
  Copy, 
  QrCode, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Bitcoin,
  Coins,
  Network
} from 'lucide-react';
import type { User } from '../App';

interface WorkerDashboardProps {
  user: User;
  onLogout: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Wallet, label: 'All Wallets', id: 'wallets' },
  { icon: DollarSign, label: 'NGN Wallet', id: 'ngn-wallet' },
  { icon: Bitcoin, label: 'Bitcoin Wallet', id: 'btc-wallet' },
  { icon: Coins, label: 'Ethereum Wallet', id: 'eth-wallet' },
  { icon: Network, label: 'USDT TRC-20', id: 'usdt-trc20' },
  { icon: Network, label: 'USDT ERC-20', id: 'usdt-erc20' },
  { icon: Network, label: 'USDT BEP-20', id: 'usdt-bep20' },
  { icon: ArrowUpDown, label: 'Buy/Sell', id: 'trade' },
  { icon: History, label: 'Transactions', id: 'transactions' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const mockTransactions = [
  { id: '1', type: 'Buy', coin: 'BTC', amount: '₦500,000', crypto: '0.025 BTC', status: 'Completed', date: '2024-01-15 14:30' },
  { id: '2', type: 'Sell', coin: 'ETH', amount: '₦200,000', crypto: '0.5 ETH', status: 'Pending', date: '2024-01-15 12:15' },
  { id: '3', type: 'Buy', coin: 'USDT-TRC20', amount: '₦100,000', crypto: '65 USDT', status: 'Failed', date: '2024-01-14 16:45' },
  { id: '4', type: 'Buy', coin: 'USDT-ERC20', amount: '₦75,000', crypto: '48 USDT', status: 'Completed', date: '2024-01-14 10:20' },
];

export default function WorkerDashboard({ user, onLogout }: WorkerDashboardProps) {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const cryptoRates = {
    BTC: 20000000, // 20M NGN per BTC
    ETH: 800000,   // 800K NGN per ETH
    USDT: 1540     // 1540 NGN per USDT
  };

  // Sidebar Component
  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-gray border-r border-medium-gray transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-medium-gray">
          <h1 className="text-xl font-bold text-metallic-gold">CryptoChoice Bank</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold border-r-2 border-metallic-gold'
                    : 'text-gray-400 hover:bg-medium-gray'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-medium-gray">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );

  // Header Component
  const Header = () => (
    <header className="bg-dark-gray border-b border-medium-gray">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300 mr-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-sm w-64 text-soft-white placeholder-gray-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full">
            <CheckCircle className="h-4 w-4 text-electric-blue" />
            <span className="text-sm font-medium text-electric-blue">API Connected</span>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-300 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-soft-white">{user.name}</p>
              <p className="text-xs text-gray-400">Worker Account</p>
            </div>
            <div className="h-8 w-8 bg-metallic-gold rounded-full flex items-center justify-center">
              <span className="text-primary-black text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.name.split(' ')[0]}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">NGN Balance</p>
              <p className="text-2xl font-bold text-soft-white">₦{user.balance?.ngn.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-soft-white">{user.balance?.btc} BTC</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Bitcoin className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ethereum</p>
              <p className="text-2xl font-bold text-soft-white">{user.balance?.eth} ETH</p>
            </div>
            <div className="h-12 w-12 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <Coins className="h-6 w-6 text-electric-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">USDT (All Networks)</p>
              <p className="text-2xl font-bold text-soft-white">{user.balance?.usdt} USDT</p>
            </div>
            <div className="h-12 w-12 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-metallic-gold" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => {setActiveView('trade'); setTradeType('buy');}}
          className="bg-metallic-gold text-primary-black p-8 rounded-xl hover:bg-gold-hover transition-all text-left group"
        >
          <TrendingUp className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Buy Cryptocurrency</h3>
          <p className="text-primary-black text-opacity-80">Purchase crypto with your NGN balance</p>
        </button>

        <button 
          onClick={() => {setActiveView('trade'); setTradeType('sell');}}
          className="bg-electric-blue text-soft-white p-8 rounded-xl hover:bg-blue-hover transition-all text-left group"
        >
          <TrendingDown className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Sell Cryptocurrency</h3>
          <p className="text-soft-white text-opacity-80">Convert your crypto to NGN</p>
        </button>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Recent Transactions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    tx.type === 'Buy' ? 'bg-metallic-gold bg-opacity-20' : 'bg-red-500 bg-opacity-20'
                  }`}>
                    {tx.type === 'Buy' ? 
                      <TrendingUp className={`h-5 w-5 ${tx.type === 'Buy' ? 'text-metallic-gold' : 'text-red-400'}`} /> :
                      <TrendingDown className={`h-5 w-5 ${tx.type === 'Buy' ? 'text-metallic-gold' : 'text-red-400'}`} />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-soft-white">{tx.type} {tx.coin}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-soft-white">{tx.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'Completed' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                    tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveView('transactions')}
            className="w-full mt-4 py-2 text-metallic-gold hover:bg-metallic-gold hover:bg-opacity-10 rounded-lg transition-colors"
          >
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );

  const renderWallets = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Wallet Management</h1>
        <p className="text-gray-400">Manage your cryptocurrency wallets and addresses</p>
      </div>

      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <h3 className="text-lg font-semibold text-soft-white mb-6">Primary Wallet Address</h3>
        <div className="flex items-center justify-between p-4 bg-medium-gray rounded-lg mb-4">
          <span className="text-sm font-mono text-soft-white">{user.walletAddress}</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigator.clipboard.writeText(user.walletAddress || '')}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-metallic-gold transition-colors">
              <QrCode className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-medium-gray rounded-lg flex items-center justify-center border-2 border-dashed border-light-gray">
            <QrCode className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">NGN Wallet</h4>
            <DollarSign className="h-5 w-5 text-metallic-gold" />
          </div>
          <p className="text-2xl font-bold text-soft-white mb-2">₦{user.balance?.ngn.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Nigerian Naira</p>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">Bitcoin</h4>
            <Bitcoin className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-soft-white mb-2">{user.balance?.btc} BTC</p>
          <p className="text-sm text-gray-400">≈ ₦{((user.balance?.btc || 0) * cryptoRates.BTC).toLocaleString()}</p>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">Ethereum</h4>
            <Coins className="h-5 w-5 text-electric-blue" />
          </div>
          <p className="text-2xl font-bold text-soft-white mb-2">{user.balance?.eth} ETH</p>
          <p className="text-sm text-gray-400">≈ ₦{((user.balance?.eth || 0) * cryptoRates.ETH).toLocaleString()}</p>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-soft-white">USDT (All Networks)</h4>
            <DollarSign className="h-5 w-5 text-metallic-gold" />
          </div>
          <p className="text-2xl font-bold text-soft-white mb-2">{user.balance?.usdt} USDT</p>
          <p className="text-sm text-gray-400">≈ ₦{((user.balance?.usdt || 0) * cryptoRates.USDT).toLocaleString()}</p>
        </div>
      </div>

      {/* USDT Network Options */}
      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <h3 className="text-lg font-semibold text-soft-white mb-6">USDT Network Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-medium-gray rounded-lg border border-light-gray">
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
            <p className="text-sm text-gray-400 mb-2">Balance: 500 USDT</p>
            <p className="text-xs text-gray-500 font-mono">TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE</p>
            <button className="w-full mt-3 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors text-sm">
              View TRC-20 Wallet
            </button>
          </div>

          <div className="p-4 bg-medium-gray rounded-lg border border-light-gray">
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
            <p className="text-sm text-gray-400 mb-2">Balance: 750 USDT</p>
            <p className="text-xs text-gray-500 font-mono">0x742d35Cc6634C0532925a3b8D4</p>
            <button className="w-full mt-3 py-2 bg-electric-blue bg-opacity-20 text-electric-blue rounded-lg hover:bg-opacity-30 transition-colors text-sm">
              View ERC-20 Wallet
            </button>
          </div>

          <div className="p-4 bg-medium-gray rounded-lg border border-light-gray">
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
            <p className="text-sm text-gray-400 mb-2">Balance: 250 USDT</p>
            <p className="text-xs text-gray-500 font-mono">0x8894E0a0c962CB723c1976a4421c95949bE2D4E6</p>
            <button className="w-full mt-3 py-2 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-colors text-sm">
              View BEP-20 Wallet
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
            onClick={() => setActiveView('trade')}
            className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            <span className="font-medium">Trade</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTrade = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Buy & Sell Cryptocurrency</h1>
        <p className="text-gray-400">Trade cryptocurrencies with competitive rates</p>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <div className="flex space-x-4">
            <button
              onClick={() => setTradeType('buy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tradeType === 'buy' 
                  ? 'bg-metallic-gold text-primary-black' 
                  : 'text-gray-400 hover:bg-medium-gray'
              }`}
            >
              Buy Crypto
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tradeType === 'sell' 
                  ? 'bg-electric-blue text-soft-white' 
                  : 'text-gray-400 hover:bg-medium-gray'
              }`}
            >
              Sell Crypto
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">Select Cryptocurrency</label>
              <div className="relative">
                <select 
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent appearance-none text-soft-white"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT-TRC20">USDT TRC-20 (Tron)</option>
                  <option value="USDT-ERC20">USDT ERC-20 (Ethereum)</option>
                  <option value="USDT-BEP20">USDT BEP-20 (BSC)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Amount ({tradeType === 'buy' ? 'NGN' : selectedCoin})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500"
                placeholder={`Enter amount in ${tradeType === 'buy' ? 'NGN' : selectedCoin}`}
              />
            </div>

            {amount && (
              <div className="p-4 bg-medium-gray rounded-lg border border-light-gray">
                <p className="text-sm text-gray-400 mb-2">Transaction Summary:</p>
                {tradeType === 'buy' ? (
                  <>
                    <p className="text-lg font-semibold text-soft-white">
                      You will receive: {(parseFloat(amount) / cryptoRates[selectedCoin.split('-')[0] as keyof typeof cryptoRates]).toFixed(6)} {selectedCoin}
                    </p>
                    <p className="text-sm text-gray-400">Rate: ₦{cryptoRates[selectedCoin.split('-')[0] as keyof typeof cryptoRates].toLocaleString()} per {selectedCoin}</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-soft-white">
                      You will receive: ₦{(parseFloat(amount) * cryptoRates[selectedCoin.split('-')[0] as keyof typeof cryptoRates]).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">Rate: ₦{cryptoRates[selectedCoin.split('-')[0] as keyof typeof cryptoRates].toLocaleString()} per {selectedCoin}</p>
                  </>
                )}
              </div>
            )}

            <button 
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                tradeType === 'buy' 
                  ? 'bg-metallic-gold text-primary-black hover:bg-gold-hover' 
                  : 'bg-electric-blue text-soft-white hover:bg-blue-hover'
              }`}
            >
              {tradeType === 'buy' ? `Buy ${selectedCoin.split('-')[0]}` : `Sell ${selectedCoin.split('-')[0]}`}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <h3 className="font-semibold text-soft-white mb-4">Current Rates</h3>
          <div className="space-y-3">
            {Object.entries(cryptoRates).map(([coin, rate]) => (
              <div key={coin} className="flex justify-between">
                <span className="text-gray-400">{coin}</span>
                <span className="font-medium text-soft-white">₦{rate.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <h3 className="font-semibold text-soft-white mb-4">Your Balances</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">NGN</span>
              <span className="font-medium text-soft-white">₦{user.balance?.ngn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">BTC</span>
              <span className="font-medium text-soft-white">{user.balance?.btc} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ETH</span>
              <span className="font-medium text-soft-white">{user.balance?.eth} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">USDT</span>
              <span className="font-medium text-soft-white">{user.balance?.usdt} USDT</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
          <h3 className="font-semibold text-soft-white mb-4">Trading Limits</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Limit</span>
              <span className="font-medium text-soft-white">₦5,000,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Used Today</span>
              <span className="font-medium text-soft-white">₦700,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remaining</span>
              <span className="font-medium text-metallic-gold">₦4,300,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNGNWallet = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">NGN Wallet</h1>
        <p className="text-gray-400">Manage your Nigerian Naira balance</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-metallic-gold" />
          </div>
          <h2 className="text-3xl font-bold text-soft-white">₦{user.balance?.ngn.toLocaleString()}</h2>
          <p className="text-gray-400">Available Balance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all">
            <TrendingUp className="h-5 w-5 mr-2" />
            Deposit NGN
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-metallic-gold hover:bg-metallic-gold hover:bg-opacity-10 transition-colors text-soft-white">
            <TrendingDown className="h-5 w-5 mr-2" />
            Withdraw NGN
          </button>
          <button 
            onClick={() => setActiveView('trade')}
            className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Buy Crypto
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Recent NGN Transactions</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-400">No NGN transactions yet</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBTCWallet = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Bitcoin Wallet</h1>
        <p className="text-gray-400">Manage your Bitcoin holdings</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-soft-white">{user.balance?.btc} BTC</h2>
          <p className="text-gray-400">≈ ₦{((user.balance?.btc || 0) * 20000000).toLocaleString()}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Wallet Address:</p>
          <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
            <span className="text-sm font-mono text-soft-white">{user.walletAddress}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(user.walletAddress || '')}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
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
            onClick={() => {setActiveView('trade'); setTradeType('sell');}}
            className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Sell BTC
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Bitcoin Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.filter(tx => tx.coin === 'BTC').map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-soft-white">{tx.type} Bitcoin</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-soft-white">{tx.crypto}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'Completed' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                    tx.status === 'Pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                    'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderETHWallet = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Ethereum Wallet</h1>
        <p className="text-gray-400">Manage your Ethereum holdings</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="h-8 w-8 text-electric-blue" />
          </div>
          <h2 className="text-3xl font-bold text-soft-white">{user.balance?.eth} ETH</h2>
          <p className="text-gray-400">≈ ₦{((user.balance?.eth || 0) * 800000).toLocaleString()}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Ethereum Address:</p>
          <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
            <span className="text-sm font-mono text-soft-white">0x742d35Cc6634C0532925a3b8D4</span>
            <button 
              onClick={() => navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D4')}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-electric-blue bg-opacity-20 text-electric-blue rounded-lg hover:bg-opacity-30 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" />
            Receive ETH
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-electric-blue hover:bg-electric-blue hover:bg-opacity-10 transition-colors text-soft-white">
            <TrendingDown className="h-5 w-5 mr-2" />
            Send ETH
          </button>
          <button 
            onClick={() => {setActiveView('trade'); setTradeType('sell');}}
            className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Sell ETH
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">Ethereum Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.filter(tx => tx.coin === 'ETH').map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center">
                    <Coins className="h-5 w-5 text-electric-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-soft-white">{tx.type} Ethereum</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-soft-white">{tx.crypto}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'Completed' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                    tx.status === 'Pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                    'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUSDTTRC20Wallet = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">USDT TRC-20 Wallet</h1>
        <p className="text-gray-400">Manage your USDT on Tron Network</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl font-bold">T</span>
          </div>
          <h2 className="text-3xl font-bold text-soft-white">500 USDT</h2>
          <p className="text-gray-400">TRC-20 Network • ≈ ₦770,000</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">TRC-20 Address:</p>
          <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
            <span className="text-sm font-mono text-soft-white">TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE</span>
            <button 
              onClick={() => navigator.clipboard.writeText('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE')}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" />
            Receive USDT
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-colors text-soft-white">
            <TrendingDown className="h-5 w-5 mr-2" />
            Send USDT
          </button>
          <button 
            onClick={() => {setActiveView('trade'); setTradeType('sell');}}
            className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Sell USDT
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">TRC-20 Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.filter(tx => tx.coin === 'USDT-TRC20').map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 font-bold">T</span>
                  </div>
                  <div>
                    <p className="font-medium text-soft-white">{tx.type} USDT TRC-20</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-soft-white">{tx.crypto}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'Completed' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                    tx.status === 'Pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                    'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUSDTERC20Wallet = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">USDT ERC-20 Wallet</h1>
        <p className="text-gray-400">Manage your USDT on Ethereum Network</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-electric-blue text-2xl font-bold">E</span>
          </div>
          <h2 className="text-3xl font-bold text-soft-white">750 USDT</h2>
          <p className="text-gray-400">ERC-20 Network • ≈ ₦1,155,000</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">ERC-20 Address:</p>
          <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
            <span className="text-sm font-mono text-soft-white">0x742d35Cc6634C0532925a3b8D4</span>
            <button 
              onClick={() => navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D4')}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-electric-blue bg-opacity-20 text-electric-blue rounded-lg hover:bg-opacity-30 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" />
            Receive USDT
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-electric-blue hover:bg-electric-blue hover:bg-opacity-10 transition-colors text-soft-white">
            <TrendingDown className="h-5 w-5 mr-2" />
            Send USDT
          </button>
          <button 
            onClick={() => {setActiveView('trade'); setTradeType('sell');}}
            className="flex items-center justify-center p-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Sell USDT
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">ERC-20 Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockTransactions.filter(tx => tx.coin === 'USDT-ERC20').map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-electric-blue font-bold">E</span>
                  </div>
                  <div>
                    <p className="font-medium text-soft-white">{tx.type} USDT ERC-20</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-soft-white">{tx.crypto}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tx.status === 'Completed' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                    tx.status === 'Pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                    'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUSDTBEP20Wallet = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">USDT BEP-20 Wallet</h1>
        <p className="text-gray-400">Manage your USDT on Binance Smart Chain</p>
      </div>

      <div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-400 text-2xl font-bold">B</span>
          </div>
          <h2 className="text-3xl font-bold text-soft-white">250 USDT</h2>
          <p className="text-gray-400">BEP-20 Network • ≈ ₦385,000</p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">BEP-20 Address:</p>
          <div className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
            <span className="text-sm font-mono text-soft-white">0x8894E0a0c962CB723c1976a4421c95949bE2D4E6</span>
            <button 
              onClick={() => navigator.clipboard.writeText('0x8894E0a0c962CB723c1976a4421c95949bE2D4E6')}
              className="p-2 text-gray-400 hover:text-metallic-gold transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" />
            Receive USDT
          </button>
          <button className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-yellow-400 hover:bg-yellow-500 hover:bg-opacity-10 transition-colors text-soft-white">
            <TrendingDown className="h-5 w-5 mr-2" />
            Send USDT
          </button>
          <button 
            onClick={() => {setActiveView('trade'); setTradeType('sell');}}
            className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Sell USDT
          </button>
        </div>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <h3 className="text-lg font-semibold text-soft-white">BEP-20 Transaction History</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-400">No BEP-20 transactions yet</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Transaction History</h1>
        <p className="text-gray-400">View and manage all your cryptocurrency transactions</p>
      </div>
      
      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="p-6 border-b border-medium-gray">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <select className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white">
                <option>All Types</option>
                <option>Buy</option>
                <option>Sell</option>
              </select>
              <select className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white">
                <option>All Coins</option>
                <option>BTC</option>
                <option>ETH</option>
                <option>USDT</option>
              </select>
            </div>
            <button className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all">
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
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
              {mockTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        tx.type === 'Buy' ? 'bg-metallic-gold bg-opacity-20' : 'bg-red-500 bg-opacity-20'
                      }`}>
                        {tx.type === 'Buy' ? 
                          <TrendingUp className="h-4 w-4 text-metallic-gold" /> :
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-soft-white">{tx.type} {tx.coin}</p>
                        <p className="text-sm text-gray-400">#{tx.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">{tx.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">{tx.crypto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tx.status === 'Completed' ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold' :
                      tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-500 bg-opacity-20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security settings</p>
      </div>
      <div className="text-center py-12"><p className="text-gray-400">Settings panel coming soon</p></div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'wallets':
        return renderWallets();
      case 'ngn-wallet':
        return renderNGNWallet();
      case 'btc-wallet':
        return renderBTCWallet();
      case 'eth-wallet':
        return renderETHWallet();
      case 'usdt-trc20':
        return renderUSDTTRC20Wallet();
      case 'usdt-erc20':
        return renderUSDTERC20Wallet();
      case 'usdt-bep20':
        return renderUSDTBEP20Wallet();
      case 'trade':
        return renderTrade();
      case 'transactions':
        return renderTransactions();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-primary-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}