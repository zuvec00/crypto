import React, { useState } from "react";
import {
	LayoutDashboard,
	Users,
	Wallet,
	Settings,
	LogOut,
	Bell,
	Search,
	Menu,
	X,
	TrendingUp,
	DollarSign,
	Eye,
	UserX,
	CheckCircle,
	AlertTriangle,
	Calendar,
	BarChart3,
	ArrowUp,
	ArrowDown,
	Bitcoin,
	Coins,
} from "lucide-react";
import type { User } from "../App";
import logoImage from "../assets/logo.png";

interface AdminDashboardProps {
	user: User;
	onLogout: () => void;
}

const adminMenuItems = [
	{ icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
	{ icon: Users, label: "Users", id: "users" },
	{ icon: TrendingUp, label: "Transactions", id: "transactions" },
	{ icon: Wallet, label: "Wallets", id: "wallets" },
	{ icon: Settings, label: "Settings", id: "settings" },
];

const mockUsers = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		wallet: "1A1zP1...92P",
		status: "Active",
		balance: "₦2,450,000",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		wallet: "3FxY9a...8kL",
		status: "Active",
		balance: "₦1,200,000",
	},
	{
		id: "3",
		name: "Mike Johnson",
		email: "mike@example.com",
		wallet: "1BvBM...7qT",
		status: "Inactive",
		balance: "₦850,000",
	},
];

const mockTransactions = [
	{
		id: "1",
		user: "John Doe",
		coin: "BTC",
		type: "Buy",
		amount: "₦500,000",
		status: "Successful",
		date: "2024-01-15",
	},
	{
		id: "2",
		user: "Jane Smith",
		coin: "ETH",
		type: "Sell",
		amount: "₦200,000",
		status: "Pending",
		date: "2024-01-15",
	},
	{
		id: "3",
		user: "Mike Johnson",
		coin: "USDT",
		type: "Buy",
		amount: "₦100,000",
		status: "Failed",
		date: "2024-01-14",
	},
];

export default function AdminDashboard({
	user,
	onLogout,
}: AdminDashboardProps) {
	const [activeView, setActiveView] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

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
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-gray border-r border-medium-gray transform ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
			>
				<div className="flex items-center justify-between h-16 px-6 border-b border-medium-gray">
					<img src={logoImage} alt="Logo" className="h-10" />
					<button
						onClick={() => setSidebarOpen(false)}
						className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<nav className="flex-1 px-4 py-6 space-y-2">
					{adminMenuItems.map((item) => {
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
										? "bg-metallic-gold bg-opacity-20 text-metallic-gold border-r-2 border-metallic-gold"
										: "text-gray-400 hover:bg-medium-gray"
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
							placeholder="Search users, transactions..."
							className="pl-10 pr-4 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-sm w-64 text-soft-white placeholder-gray-500"
						/>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2 px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full">
						<CheckCircle className="h-4 w-4 text-electric-blue" />
						<span className="text-sm font-medium text-electric-blue">
							System Online
						</span>
					</div>

					<button className="p-2 text-gray-400 hover:text-gray-300 relative">
						<Bell className="h-5 w-5" />
						<span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
					</button>

					<div className="flex items-center space-x-3">
						<div className="text-right">
							<p className="text-sm font-medium text-soft-white">{user.name}</p>
							<p className="text-xs text-gray-400">Administrator</p>
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
				<h1 className="text-2xl font-bold text-soft-white mb-2">
					Admin Dashboard
				</h1>
				<p className="text-gray-400">
					Monitor Corbit Global platform activity and manage users
				</p>
			</div>

			{/* Enhanced Transaction Analytics Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
								<Calendar className="h-5 w-5 text-metallic-gold" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-soft-white">
									Daily Transactions
								</h3>
								<p className="text-sm text-gray-400">Last 24 hours</p>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-3xl font-bold text-soft-white">247</span>
							<div className="flex items-center space-x-1 text-metallic-gold">
								<ArrowUp className="h-4 w-4" />
								<span className="text-sm font-medium">+12%</span>
							</div>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">Volume:</span>
							<span className="text-soft-white font-medium">₦12.4M</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">Avg per transaction:</span>
							<span className="text-soft-white font-medium">₦50,203</span>
						</div>
						<div className="w-full bg-medium-gray rounded-full h-2">
							<div
								className="bg-metallic-gold h-2 rounded-full"
								style={{ width: "75%" }}
							></div>
						</div>
						<div className="pt-2 border-t border-medium-gray">
							<div className="flex justify-between text-xs text-gray-400">
								<span>Target: 300</span>
								<span>82% achieved</span>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
								<BarChart3 className="h-5 w-5 text-electric-blue" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-soft-white">
									Weekly Transactions
								</h3>
								<p className="text-sm text-gray-400">Last 7 days</p>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-3xl font-bold text-soft-white">1,834</span>
							<div className="flex items-center space-x-1 text-electric-blue">
								<ArrowUp className="h-4 w-4" />
								<span className="text-sm font-medium">+8%</span>
							</div>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">Volume:</span>
							<span className="text-soft-white font-medium">₦89.2M</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">Daily average:</span>
							<span className="text-soft-white font-medium">262 txns</span>
						</div>
						<div className="w-full bg-medium-gray rounded-full h-2">
							<div
								className="bg-electric-blue h-2 rounded-full"
								style={{ width: "82%" }}
							></div>
						</div>
						<div className="pt-2 border-t border-medium-gray">
							<div className="flex justify-between text-xs text-gray-400">
								<span>Target: 2,000</span>
								<span>92% achieved</span>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<div className="h-10 w-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
								<TrendingUp className="h-5 w-5 text-purple-400" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-soft-white">
									Monthly Transactions
								</h3>
								<p className="text-sm text-gray-400">Last 30 days</p>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-3xl font-bold text-soft-white">7,921</span>
							<div className="flex items-center space-x-1 text-red-400">
								<ArrowDown className="h-4 w-4" />
								<span className="text-sm font-medium">-3%</span>
							</div>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">Volume:</span>
							<span className="text-soft-white font-medium">₦342.8M</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">Daily average:</span>
							<span className="text-soft-white font-medium">264 txns</span>
						</div>
						<div className="w-full bg-medium-gray rounded-full h-2">
							<div
								className="bg-purple-400 h-2 rounded-full"
								style={{ width: "68%" }}
							></div>
						</div>
						<div className="pt-2 border-t border-medium-gray">
							<div className="flex justify-between text-xs text-gray-400">
								<span>Target: 10,000</span>
								<span>79% achieved</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Additional Analytics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
							<Bitcoin className="h-5 w-5 text-metallic-gold" />
						</div>
						<div className="flex items-center space-x-1 text-metallic-gold">
							<ArrowUp className="h-3 w-3" />
							<span className="text-xs">+15%</span>
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-400">Bitcoin Volume</p>
						<p className="text-2xl font-bold text-soft-white">₦45.2M</p>
						<p className="text-xs text-gray-400 mt-1">2.15 BTC traded</p>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="h-10 w-10 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
							<Coins className="h-5 w-5 text-electric-blue" />
						</div>
						<div className="flex items-center space-x-1 text-electric-blue">
							<ArrowUp className="h-3 w-3" />
							<span className="text-xs">+22%</span>
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-400">Ethereum Volume</p>
						<p className="text-2xl font-bold text-soft-white">₦28.7M</p>
						<p className="text-xs text-gray-400 mt-1">35.9 ETH traded</p>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="h-10 w-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
							<DollarSign className="h-5 w-5 text-green-400" />
						</div>
						<div className="flex items-center space-x-1 text-green-400">
							<ArrowUp className="h-3 w-3" />
							<span className="text-xs">+8%</span>
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-400">USDT Volume</p>
						<p className="text-2xl font-bold text-soft-white">₦67.3M</p>
						<p className="text-xs text-gray-400 mt-1">43,721 USDT traded</p>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between mb-4">
						<div className="h-10 w-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
							<Users className="h-5 w-5 text-purple-400" />
						</div>
						<div className="flex items-center space-x-1 text-purple-400">
							<ArrowUp className="h-3 w-3" />
							<span className="text-xs">+5%</span>
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-400">Active Users</p>
						<p className="text-2xl font-bold text-soft-white">1,234</p>
						<p className="text-xs text-gray-400 mt-1">+47 new this month</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-400">Total Users</p>
							<p className="text-3xl font-bold text-soft-white">1,234</p>
							<p className="text-sm text-metallic-gold">+12% from last month</p>
						</div>
						<div className="h-12 w-12 bg-metallic-gold bg-opacity-20 rounded-lg flex items-center justify-center">
							<Users className="h-6 w-6 text-metallic-gold" />
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-400">Total Volume</p>
							<p className="text-3xl font-bold text-soft-white">₦45.2M</p>
							<p className="text-sm text-metallic-gold">+8% from last month</p>
						</div>
						<div className="h-12 w-12 bg-electric-blue bg-opacity-20 rounded-lg flex items-center justify-center">
							<TrendingUp className="h-6 w-6 text-electric-blue" />
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-400">
								Platform Balance
							</p>
							<p className="text-3xl font-bold text-soft-white">₦12.8M</p>
							<p className="text-sm text-metallic-gold">+15% from last month</p>
						</div>
						<div className="h-12 w-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
							<DollarSign className="h-6 w-6 text-purple-400" />
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<h3 className="text-lg font-semibold text-soft-white mb-4">
						Transaction Trends
					</h3>
					<div className="h-64 bg-medium-gray rounded-lg flex items-center justify-center border border-light-gray">
						<p className="text-gray-400">Chart visualization would go here</p>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<h3 className="text-lg font-semibold text-soft-white mb-4">
						Crypto Distribution
					</h3>
					<div className="h-64 bg-medium-gray rounded-lg flex items-center justify-center border border-light-gray">
						<p className="text-gray-400">Pie chart would go here</p>
					</div>
				</div>
			</div>

			<div className="bg-dark-gray rounded-xl border border-medium-gray">
				<div className="p-6 border-b border-medium-gray">
					<h3 className="text-xl font-bold text-soft-white">
						Recent Platform Transactions
					</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-medium-gray">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
									User
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
									Coin
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
									Amount
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
									Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-medium-gray">
							{mockTransactions.map((tx) => (
								<tr key={tx.id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
										{tx.user}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
										{tx.coin}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
										{tx.type}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
										{tx.amount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${
												tx.status === "Successful"
													? "bg-metallic-gold bg-opacity-20 text-metallic-gold"
													: tx.status === "Pending"
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-500 bg-opacity-20 text-red-400"
											}`}
										>
											{tx.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
										{tx.date}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);

	const renderUsers = () => (
		<div className="space-y-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
				<div>
					<h1 className="text-2xl font-bold text-soft-white mb-2">
						User Management
					</h1>
					<p className="text-gray-400">
						Manage platform users and their access
					</p>
				</div>
				<button className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all">
					Add New User
				</button>
			</div>

			<div className="bg-dark-gray rounded-xl border border-medium-gray">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-medium-gray">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Wallet
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Balance
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-medium-gray">
							{mockUsers.map((user) => (
								<tr key={user.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<p className="text-sm font-medium text-soft-white">
												{user.name}
											</p>
											<p className="text-sm text-gray-400">{user.email}</p>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
										{user.wallet}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
										{user.balance}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${
												user.status === "Active"
													? "bg-metallic-gold bg-opacity-20 text-metallic-gold"
													: "bg-red-500 bg-opacity-20 text-red-400"
											}`}
										>
											{user.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button className="text-metallic-gold hover:opacity-80 mr-3">
											<Eye className="h-4 w-4" />
										</button>
										<button className="text-red-400 hover:text-red-300">
											<UserX className="h-4 w-4" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);

	const renderTransactions = () => (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-soft-white mb-2">
					All Transactions
				</h1>
				<p className="text-gray-400">Monitor all platform transactions</p>
			</div>
			<div className="text-center py-12">
				<p className="text-gray-400">Transactions management coming soon</p>
			</div>
		</div>
	);

	const renderWallets = () => (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-soft-white mb-2">
					Wallet Management
				</h1>
				<p className="text-gray-400">Monitor platform wallets and balances</p>
			</div>
			<div className="text-center py-12">
				<p className="text-gray-400">Wallet management coming soon</p>
			</div>
		</div>
	);

	const renderSettings = () => (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-soft-white mb-2">
					Platform Settings
				</h1>
				<p className="text-gray-400">
					Configure platform settings and preferences
				</p>
			</div>
			<div className="text-center py-12">
				<p className="text-gray-400">Settings panel coming soon</p>
			</div>
		</div>
	);

	const renderContent = () => {
		switch (activeView) {
			case "dashboard":
				return renderDashboard();
			case "users":
				return renderUsers();
			case "transactions":
				return renderTransactions();
			case "wallets":
				return renderWallets();
			case "settings":
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
