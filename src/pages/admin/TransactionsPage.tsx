import { useState, useMemo, useCallback } from "react";
import {
	TrendingUp,
	TrendingDown,
	Download,
	RefreshCw,
	Users,
	Filter,
} from "lucide-react";
import { useAllTransactions } from "../../hooks/useAllTransactions";

interface Transaction {
	id: string | number;
	side: string;
	market?: {
		base_unit?: string;
	};
	volume?:
		| {
				amount?: string;
		  }
		| string;
	total?:
		| {
				amount?: string;
		  }
		| string;
	state: string;
	user?: {
		name?: string;
		email?: string;
	};
	created_at?: string;
	updated_at: string;
}

export default function AdminTransactionsPage() {
	const { transactions, loading, error, refetch } = useAllTransactions();
	const trasactions = transactions as Transaction[];
	const [typeFilter, setTypeFilter] = useState("all");
	const [coinFilter, setCoinFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	// Helper functions to handle volume and total which can be string or object
	const getAmount = useCallback(
		(value?: { amount?: string } | string): string => {
			if (typeof value === "string") return value;
			return value?.amount || "0";
		},
		[]
	);

	// Log the transactions data to see the structure
	console.log("📊 Admin Transactions Data:", {
		trasactions,
		count: trasactions?.length || 0,
		firstTransaction: trasactions?.[0],
		loading,
		error,
	});

	const filteredTransactions = useMemo(() => {
		if (!trasactions) return [];

		return trasactions.filter((tx) => {
			const typeMatch = typeFilter === "all" || tx.side === typeFilter;
			const coinMatch =
				coinFilter === "all" ||
				tx.market?.base_unit === coinFilter.toLowerCase();
			const statusMatch = statusFilter === "all" || tx.state === statusFilter;
			return typeMatch && coinMatch && statusMatch;
		});
	}, [trasactions, typeFilter, coinFilter, statusFilter]);

	const statistics = useMemo(() => {
		if (!trasactions) return { total: 0, completed: 0, pending: 0, volume: 0 };

		return {
			total: trasactions.length,
			completed: trasactions.filter((tx) => tx.state === "done").length,
			pending: trasactions.filter((tx) => tx.state === "wait").length,
			volume: trasactions.reduce(
				(sum, tx) => sum + parseFloat(getAmount(tx.total)),
				0
			),
		};
	}, [trasactions, getAmount]);

	const exportToCSV = () => {
		if (!filteredTransactions.length) return;

		const headers = [
			"ID",
			"User",
			"Type",
			"Coin",
			"Amount",
			"Total (NGN)",
			"Status",
			"Date",
		];
		const csvContent = [
			headers.join(","),
			...filteredTransactions.map((tx) =>
				[
					tx.id,
					tx.user?.email || "N/A",
					tx.side.toUpperCase(),
					tx.market?.base_unit?.toUpperCase() || "",
					getAmount(tx.volume),
					getAmount(tx.total),
					tx.state.toUpperCase(),
					new Date(tx.updated_at).toLocaleString(),
				].join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `admin-transactions-${
			new Date().toISOString().split("T")[0]
		}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-NG", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-soft-white mb-2">
					All Transactions
				</h1>
				<p className="text-gray-400">
					Monitor and manage all platform transactions
				</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-400 mb-1">Total Transactions</p>
							<p className="text-2xl font-bold text-soft-white">
								{statistics.total}
							</p>
						</div>
						<div className="h-12 w-12 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center">
							<TrendingUp className="h-6 w-6 text-metallic-gold" />
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-400 mb-1">Completed</p>
							<p className="text-2xl font-bold text-green-400">
								{statistics.completed}
							</p>
						</div>
						<div className="h-12 w-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
							<TrendingUp className="h-6 w-6 text-green-400" />
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-400 mb-1">Pending</p>
							<p className="text-2xl font-bold text-yellow-400">
								{statistics.pending}
							</p>
						</div>
						<div className="h-12 w-12 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
							<RefreshCw className="h-6 w-6 text-yellow-400" />
						</div>
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-400 mb-1">Total Volume</p>
							<p className="text-2xl font-bold text-soft-white">
								{formatCurrency(statistics.volume)}
							</p>
						</div>
						<div className="h-12 w-12 bg-electric-blue bg-opacity-20 rounded-full flex items-center justify-center">
							<TrendingUp className="h-6 w-6 text-electric-blue" />
						</div>
					</div>
				</div>
			</div>

			{/* Transactions Table */}
			<div className="bg-dark-gray rounded-xl border border-medium-gray">
				<div className="p-6 border-b border-medium-gray">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
						<div className="flex items-center space-x-2">
							<Filter className="h-5 w-5 text-gray-400" />
							<span className="text-sm text-gray-400">Filters:</span>
						</div>

						<div className="flex flex-wrap gap-3">
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white text-sm"
							>
								<option value="all">All Types</option>
								<option value="buy">Buy</option>
								<option value="sell">Sell</option>
							</select>

							<select
								value={coinFilter}
								onChange={(e) => setCoinFilter(e.target.value)}
								className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white text-sm"
							>
								<option value="all">All Coins</option>
								<option value="btc">BTC</option>
								<option value="eth">ETH</option>
								<option value="usdt">USDT</option>
								<option value="ngn">NGN</option>
							</select>

							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white text-sm"
							>
								<option value="all">All Status</option>
								<option value="done">Completed</option>
								<option value="wait">Pending</option>
								<option value="cancel">Cancelled</option>
							</select>

							<button
								onClick={refetch}
								disabled={loading}
								className="bg-medium-gray text-soft-white px-4 py-2 rounded-lg hover:bg-light-gray transition-all flex items-center space-x-2 disabled:opacity-50 text-sm"
							>
								<RefreshCw
									className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
								/>
								<span>Refresh</span>
							</button>

							<button
								onClick={exportToCSV}
								disabled={!filteredTransactions.length}
								className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
							>
								<Download className="h-4 w-4" />
								<span>Export CSV</span>
							</button>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-medium-gray">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Transaction
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Crypto Amount
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Amount (NGN)
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
							{loading ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center">
										<RefreshCw className="h-6 w-6 animate-spin text-metallic-gold mx-auto mb-2" />
										<p className="text-gray-400">Loading transactions...</p>
									</td>
								</tr>
							) : error ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center">
										<p className="text-red-400 mb-4">
											Error loading transactions: {error}
										</p>
										<button
											onClick={refetch}
											className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all"
										>
											Retry
										</button>
									</td>
								</tr>
							) : filteredTransactions.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-8 text-center text-gray-400"
									>
										No transactions found
									</td>
								</tr>
							) : (
								filteredTransactions.map((tx) => (
									<tr
										key={tx.id}
										className="hover:bg-medium-gray transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="h-8 w-8 bg-gray-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
													<Users className="h-4 w-4 text-gray-400" />
												</div>
												<div>
													<p className="text-sm font-medium text-soft-white">
														{tx.user?.name || "User"}
													</p>
													<p className="text-xs text-gray-400">
														{tx.user?.email || "N/A"}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div
													className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
														tx.side === "buy"
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
													<p className="text-xs text-gray-400">
														#{tx.id.toString().slice(0, 8)}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
											{getAmount(tx.volume)}{" "}
											{tx.market?.base_unit?.toUpperCase()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white font-medium">
											{formatCurrency(parseFloat(getAmount(tx.total)))}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
													tx.state === "done"
														? "bg-green-500 bg-opacity-20 text-green-400"
														: tx.state === "wait"
														? "bg-yellow-500 bg-opacity-20 text-yellow-400"
														: tx.state === "confirm"
														? "bg-blue-500 bg-opacity-20 text-blue-400"
														: "bg-red-500 bg-opacity-20 text-red-400"
												}`}
											>
												{tx.state === "done" ? "Completed" : tx.state}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
											{formatDate(tx.updated_at)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{filteredTransactions.length > 0 && (
					<div className="px-6 py-4 border-t border-medium-gray">
						<p className="text-sm text-gray-400">
							Showing {filteredTransactions.length} of{" "}
							{trasactions?.length || 0} transactions
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
