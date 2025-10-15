import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";

export default function TransactionsPage() {
	const { dailyTransaction, trasactions, loading, error, refetch } =
		useTransactions();
	const [typeFilter, setTypeFilter] = useState("all");
	const [coinFilter, setCoinFilter] = useState("all");

	// Debug logging
	console.log("📜 Transactions Page Data:", {
		dailyTransaction,
		dailyCount: dailyTransaction?.length || 0,
		allTransactions: trasactions,
		allCount: trasactions?.length || 0,
		firstDaily: dailyTransaction?.[0],
		firstAll: trasactions?.[0],
		loading,
		error,
	});

	const filteredTransactions = useMemo(() => {
		// Use all transactions instead of just daily
		const txToUse =
			trasactions && trasactions.length > 0 ? trasactions : dailyTransaction;

		if (!txToUse) return [];

		const filtered = txToUse.filter((tx) => {
			const typeMatch = typeFilter === "all" || tx.side === typeFilter;
			const coinMatch =
				coinFilter === "all" || tx.market?.base_unit === coinFilter;
			return typeMatch && coinMatch;
		});

		console.log("🔍 Filtered Transactions:", {
			sourceUsed:
				trasactions && trasactions.length > 0
					? "all transactions"
					: "daily transactions",
			totalAvailable: txToUse?.length || 0,
			afterFilter: filtered.length,
			filters: { typeFilter, coinFilter },
		});

		return filtered;
	}, [trasactions, dailyTransaction, typeFilter, coinFilter]);

	const exportToCSV = () => {
		if (!filteredTransactions.length) return;

		const headers = [
			"ID",
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
					tx.side.toUpperCase(),
					tx.market?.base_unit?.toUpperCase() || "",
					tx.volume?.amount || tx.volume,
					tx.total?.amount || tx.total,
					tx.state.toUpperCase(),
					new Date(tx.updated_at).toLocaleString(),
				].join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
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
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-soft-white mb-2">
						Transaction History
					</h1>
					<p className="text-gray-400">
						View and manage all your cryptocurrency transactions
						{filteredTransactions.length > 0 && (
							<span className="ml-2 text-metallic-gold">
								• {filteredTransactions.length} transaction
								{filteredTransactions.length !== 1 ? "s" : ""}
							</span>
						)}
					</p>
				</div>
			</div>

			<div className="bg-dark-gray rounded-xl border border-medium-gray">
				<div className="p-6 border-b border-medium-gray">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
						<div className="flex space-x-4">
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
							>
								<option value="all">All Types</option>
								<option value="buy">Buy</option>
								<option value="sell">Sell</option>
							</select>
							<select
								value={coinFilter}
								onChange={(e) => setCoinFilter(e.target.value)}
								className="px-3 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
							>
								<option value="all">All Coins</option>
								<option value="btc">BTC</option>
								<option value="eth">ETH</option>
								<option value="usdt">USDT</option>
								<option value="ngn">NGN</option>
							</select>
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => {
									console.log("🔄 Manually refreshing transactions...");
									refetch();
								}}
								disabled={loading}
								className="bg-medium-gray text-soft-white px-4 py-2 rounded-lg hover:bg-light-gray transition-all flex items-center space-x-2 disabled:opacity-50"
							>
								<RefreshCw
									className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
								/>
								<span>Refresh</span>
							</button>
							<button
								onClick={exportToCSV}
								disabled={!filteredTransactions.length}
								className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Download className="h-4 w-4" />
								<span>Export CSV</span>
							</button>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-h-[350px]">
						<thead className="bg-medium-gray">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Transaction
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Amount
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Crypto Amount
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
									<td colSpan={5} className="px-6 py-8 text-center">
										<RefreshCw className="h-6 w-6 animate-spin text-metallic-gold mx-auto" />
									</td>
								</tr>
							) : error ? (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center">
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
										colSpan={5}
										className="px-6 py-8 text-center text-gray-400"
									>
										No transactions found
									</td>
								</tr>
							) : (
								filteredTransactions.map((tx) => (
									<tr key={tx.id}>
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
													<p className="text-sm text-gray-400">
														#{tx.id?.toString().slice(0, 8)}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
											{formatCurrency(
												parseFloat(tx.total?.amount || tx.total || "0")
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
											{tx.volume?.amount || tx.volume}{" "}
											{tx.market?.base_unit?.toUpperCase()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 text-xs font-medium rounded-full ${
													tx.state === "done"
														? "bg-green-500 bg-opacity-20 text-green-400"
														: tx.state === "wait"
														? "bg-yellow-500 bg-opacity-20 text-yellow-400"
														: tx.state === "confirm"
														? "bg-blue-500 bg-opacity-20 text-blue-400"
														: "bg-red-500 bg-opacity-20 text-red-400"
												}`}
											>
												{tx.state === "done"
													? "COMPLETED"
													: tx.state.toUpperCase()}
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
			</div>
		</div>
	);
}
