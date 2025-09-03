import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LayoutDashboard, Wallet, ArrowUpDown, History, Settings, Users, TrendingUp, DollarSign, Bitcoin, Coins, Network } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Worker Pages
import WorkerDashboard from './pages/worker/DashboardPage';
import WorkerWallets from './pages/worker/WalletsPage';
import WorkerTrade from './pages/worker/TradePage';
import WorkerTransactions from './pages/worker/TransactionsPage';
import NGNWallet from './pages/worker/NGNWalletPage';
import BTCWallet from './pages/worker/BTCWalletPage';
import ETHWallet from './pages/worker/ETHWalletPage';
import USDTWallet from './pages/worker/USDTWalletPage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import AdminUsers from './pages/admin/UsersPage';


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'worker';
  avatar?: string;
  walletAddress?: string;
  balance?: {
    ngn: number;
    btc: number;
    eth: number;
    usdt: number;
  };
}

function App() {
  const { initializing, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center">
        <div className="text-soft-white">Loading...</div>
      </div>
    );
  }

  const workerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/worker' },
    { icon: Wallet, label: 'All Wallets', path: '/worker/wallets' },
    { icon: DollarSign, label: 'NGN Wallet', path: '/worker/ngn-wallet' },
    { icon: Bitcoin, label: 'Bitcoin Wallet', path: '/worker/btc-wallet' },
    { icon: Coins, label: 'Ethereum Wallet', path: '/worker/eth-wallet' },
    { icon: DollarSign, label: 'USDT Wallet', path: '/worker/usdt-wallet' },
    { icon: ArrowUpDown, label: 'Buy/Sell', path: '/worker/trade' },
    { icon: History, label: 'Transactions', path: '/worker/transactions' },
    { icon: Settings, label: 'Settings', path: '/worker/settings' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: TrendingUp, label: 'Transactions', path: '/admin/transactions' },
    { icon: Wallet, label: 'Wallets', path: '/admin/wallets' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Worker Routes */}
        <Route path="/worker" element={
          <ProtectedRoute requiredRole="worker">
            <Layout menuItems={workerMenuItems} title="Worker Dashboard" />
          </ProtectedRoute>
        }>
          <Route index element={<WorkerDashboard />} />
          <Route path="wallets" element={<WorkerWallets />} />
          <Route path="ngn-wallet" element={<NGNWallet />} />
          <Route path="btc-wallet" element={<BTCWallet />} />
          <Route path="eth-wallet" element={<ETHWallet />} />
          <Route path="usdt-wallet" element={<USDTWallet />} />
          <Route path="trade" element={<WorkerTrade />} />
          <Route path="transactions" element={<WorkerTransactions />} />
          <Route path="settings" element={<div className="text-center py-12 text-gray-400">Settings coming soon</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Layout menuItems={adminMenuItems} title="Admin Dashboard" />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<div className="text-center py-12 text-gray-400">Transactions coming soon</div>} />
          <Route path="wallets" element={<div className="text-center py-12 text-gray-400">Wallets coming soon</div>} />
          <Route path="settings" element={<div className="text-center py-12 text-gray-400">Settings coming soon</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;