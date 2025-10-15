import { useMemo, useState, useEffect } from "react";
import {
	ChevronDown,
	RefreshCw,
	Loader2,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import { useRates } from "../../hooks/useRates";
import { useWalletBalances } from "../../hooks/useWalletBalances";
import { useTransactions } from "../../hooks/useTransactions";
import { useTrade } from "../../hooks/useTrade";

export default function TradePage() {
	const [selectedCoin, setSelectedCoin] = useState("btc");
	const [amount, setAmount] = useState("");
	const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
	const [tradeResult, setTradeResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [pendingOrder, setPendingOrder] = useState<{
		id: string;
		data: Record<string, unknown>;
		countdown: number;
	} | null>(null);

	const { rates, loading: ratesLoading, error: ratesError } = useRates();
	const {
		balances,
		loading: balanceLoading,
		error: balanceError,
		refetch: fetchBalance,
	} = useWalletBalances();
	const {
		dailyTransaction,
		loading: transactionsLoading,
		error: transactionsError,
		refetch: refetchTransactions,
	} = useTransactions();
	const {
		buyCrypto,
		sellCrypto,
		requoteOrder,
		loading: tradeLoading,
	} = useTrade();

	const ratesToUse = useMemo(() => {
		const filtered = rates.filter((rate) =>
			["usdtngn", "btcngn", "ethngn"].includes(rate.marker)
		);
		console.log("💱 Rates To Use:", { rates, filtered });
		return filtered;
	}, [rates]);

	const balanceToUse = useMemo(() => {
		console.log("💼 Wallet Balances (Individual Endpoints):", {
			allBalances: balances,
			usdtBalance: balances.find((b) => b.currency === "usdt"),
		});
		return balances;
	}, [balances]);

	const selectRate = useMemo(() => {
		const found = rates.find(
			(rate) => rate.marker.split("ngn")[0] === selectedCoin
		);
		console.log("📊 Selected Rate:", { selectedCoin, found, allRates: rates });
		return found;
	}, [rates, selectedCoin]);

	const totalDailyTransaction = useMemo(() => {
		return dailyTransaction?.reduce(
			(sum: number, tx: Record<string, unknown>) => {
				const market = tx.market as { quote_unit?: string };
				const total = tx.total as { amount?: string };
				if (market?.quote_unit?.toLowerCase() === "ngn") {
					return sum + parseFloat(total?.amount || "0");
				}
				return sum;
			},
			0
		) as number;
	}, [dailyTransaction]);

	const TRADING_LIMIT: number = 5000000;

	const handleTrade = async () => {
		if (!amount || parseFloat(amount) <= 0) {
			setTradeResult({
				success: false,
				message: "Please enter a valid amount",
			});
			return;
		}

		console.log("🎯 Trade Action:", {
			tradeType,
			selectedCoin,
			amount,
			balances: balanceToUse,
			totalDailyTransaction,
		});

		// Validation for buy orders
		if (tradeType === "buy") {
			const ngnBalance = balanceToUse.find((bal) => bal.currency === "ngn");
			const availableBalance = parseFloat(ngnBalance?.balance || "0");
			const requestedAmount = parseFloat(amount);

			console.log("💰 Buy Validation:", {
				ngnBalance,
				availableBalance,
				requestedAmount,
				hasEnough: requestedAmount <= availableBalance,
			});

			if (requestedAmount > availableBalance) {
				setTradeResult({ success: false, message: "Insufficient NGN balance" });
				return;
			}

			// Check daily limit
			if (requestedAmount + (totalDailyTransaction || 0) > TRADING_LIMIT) {
				setTradeResult({
					success: false,
					message: "Transaction exceeds daily trading limit",
				});
				return;
			}
		}

		// Validation for sell orders
		if (tradeType === "sell") {
			const cryptoBalance = balanceToUse.find(
				(bal) => bal.currency === selectedCoin
			);
			const availableBalance = parseFloat(cryptoBalance?.balance || "0");
			const requestedAmount = parseFloat(amount);

			console.log("💸 Sell Validation:", {
				cryptoBalance,
				availableBalance,
				requestedAmount,
				hasEnough: requestedAmount <= availableBalance,
			});

			if (requestedAmount > availableBalance) {
				setTradeResult({
					success: false,
					message: `Insufficient ${selectedCoin.toUpperCase()} balance`,
				});
				return;
			}
		}

		try {
			let result;
			console.log(`📤 Calling ${tradeType} API with:`, {
				ask: selectedCoin,
				[tradeType === "buy" ? "total" : "volume"]: amount,
			});

			if (tradeType === "buy") {
				result = await buyCrypto(selectedCoin, amount);
			} else {
				result = await sellCrypto(selectedCoin, amount);
			}

			console.log("📥 Trade Result:", result);

			if (result.success) {
				// Set pending order with 15-second countdown
				setPendingOrder({
					id: result.data.data.id,
					data: result.data.data,
					countdown: 15,
				});
				setTradeResult({
					success: true,
					message: `Order created! You have 15 seconds to confirm.`,
				});
			} else {
				setTradeResult({
					success: false,
					message: result.error || "Trade failed",
				});
			}
		} catch (error) {
			console.error("💥 Trade Error:", error);
			setTradeResult({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	};

	// Handle pending order countdown and requoting
	useEffect(() => {
		if (pendingOrder && pendingOrder.countdown > 0) {
			const timer = setTimeout(() => {
				if (pendingOrder.countdown === 1) {
					// Auto-requote when countdown reaches 0
					handleRequote();
				} else {
					setPendingOrder((prev) =>
						prev ? { ...prev, countdown: prev.countdown - 1 } : null
					);
				}
			}, 1000);
			return () => clearTimeout(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pendingOrder]);

	// Clear trade result after 5 seconds
	useEffect(() => {
		if (tradeResult && !pendingOrder) {
			const timer = setTimeout(() => setTradeResult(null), 5000);
			return () => clearTimeout(timer);
		}
	}, [tradeResult, pendingOrder]);

	const handleRequote = async () => {
		if (!pendingOrder) return;

		const result = await requoteOrder(pendingOrder.id);
		if (result.success) {
			setPendingOrder({
				id: pendingOrder.id,
				data: result.data.data,
				countdown: 15,
			});
			setTradeResult({
				success: true,
				message: "Order prices updated! You have 15 seconds to confirm.",
			});
		} else {
			setTradeResult({
				success: false,
				message: "Failed to update order prices",
			});
			setPendingOrder(null);
		}
	};

	const handleConfirmOrder = async () => {
		if (!pendingOrder) return;

		console.log("✅ Confirming order:", pendingOrder.id);

		// NOTE: The buy/sell API automatically confirms orders
		// The order is already executed when created
		setTradeResult({
			success: true,
			message: "Order confirmed successfully!",
		});
		setPendingOrder(null);
		setAmount("");

		// Refresh data after confirmation
		console.log("🔄 Refreshing balances and transactions...");
		await fetchBalance();
		await refetchTransactions();
		console.log("✅ Data refreshed!");
	};

	const handleCancelOrder = () => {
		setPendingOrder(null);
		setTradeResult(null);
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold text-soft-white mb-2">
					Buy & Sell Cryptocurrency
				</h1>
				<p className="text-gray-400">
					Trade cryptocurrencies with competitive rates
				</p>
			</div>

			<div className="bg-dark-gray rounded-xl border border-medium-gray">
				<div className="p-6 border-b border-medium-gray">
					<div className="flex space-x-4">
						<button
							onClick={() => setTradeType("buy")}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								tradeType === "buy"
									? "bg-metallic-gold text-primary-black"
									: "text-gray-400 hover:bg-medium-gray"
							}`}
						>
							Buy Crypto
						</button>
						<button
							onClick={() => setTradeType("sell")}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								tradeType === "sell"
									? "bg-electric-blue text-soft-white"
									: "text-gray-400 hover:bg-medium-gray"
							}`}
						>
							Sell Crypto
						</button>
					</div>
				</div>

				<div className="p-6">
					<div className="max-w-md mx-auto space-y-6">
						<div>
							<label className="block text-sm font-medium text-soft-white mb-2">
								Select Cryptocurrency
							</label>
							<div className="relative">
								<select
									value={selectedCoin}
									onChange={(e) => setSelectedCoin(e.target.value)}
									className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent appearance-none text-soft-white"
								>
									<option value="btc">Bitcoin (BTC)</option>
									<option value="eth">Ethereum (ETH)</option>
									<option value="usdt">USDT (All Networks)</option>
								</select>
								<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-soft-white mb-2">
								Amount ({tradeType === "buy" ? "NGN" : selectedCoin})
							</label>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500"
								placeholder={`Enter amount in ${
									tradeType === "buy" ? "NGN" : selectedCoin
								}`}
							/>
						</div>

						{amount && parseFloat(amount) > 0 && (
							<div className="p-4 bg-medium-gray rounded-lg border border-light-gray space-y-3">
								<p className="text-sm text-gray-400 mb-2">
									Transaction Summary:
								</p>
								{tradeType === "buy" ? (
									<>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">You pay:</span>
											<span className="font-medium text-soft-white">
												₦{parseFloat(amount).toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">
												You receive:
											</span>
											<span className="font-semibold text-metallic-gold">
												{(
													parseFloat(amount) /
													parseFloat(selectRate?.buy || "1")
												).toFixed(8)}{" "}
												{selectedCoin.toUpperCase()}
											</span>
										</div>
										<div className="flex justify-between items-center text-xs">
											<span className="text-gray-500">Rate:</span>
											<span className="text-gray-500">
												₦{parseFloat(selectRate?.buy || "0").toLocaleString()}{" "}
												per {selectedCoin.toUpperCase()}
											</span>
										</div>
									</>
								) : (
									<>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">You sell:</span>
											<span className="font-medium text-soft-white">
												{parseFloat(amount).toFixed(8)}{" "}
												{selectedCoin.toUpperCase()}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">
												You receive:
											</span>
											<span className="font-semibold text-metallic-gold">
												₦
												{(
													parseFloat(amount) *
													parseFloat(selectRate?.sell || "1")
												).toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between items-center text-xs">
											<span className="text-gray-500">Rate:</span>
											<span className="text-gray-500">
												₦{parseFloat(selectRate?.sell || "0").toLocaleString()}{" "}
												per {selectedCoin.toUpperCase()}
											</span>
										</div>
									</>
								)}
							</div>
						)}

						{tradeResult && (
							<div
								className={`p-4 rounded-lg border flex items-center space-x-2 ${
									tradeResult.success
										? "bg-green-500 bg-opacity-10 border-green-500 text-green-400"
										: "bg-red-500 bg-opacity-10 border-red-500 text-red-400"
								}`}
							>
								{tradeResult.success ? (
									<CheckCircle className="h-5 w-5" />
								) : (
									<AlertCircle className="h-5 w-5" />
								)}
								<span className="text-sm">{tradeResult.message}</span>
							</div>
						)}

						{pendingOrder && (
							<div className="p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-yellow-400 font-medium">
										Order Pending Confirmation
									</span>
									<span className="text-yellow-400 font-mono text-lg">
										{pendingOrder.countdown}s
									</span>
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-400">Order ID:</span>
										<span className="text-soft-white font-mono">
											{pendingOrder.id}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Amount:</span>
										<span className="text-soft-white">
											{tradeType === "buy"
												? `₦${parseFloat(
														(pendingOrder.data.total as { amount?: string })
															?.amount || amount
												  ).toLocaleString()}`
												: `${parseFloat(
														(pendingOrder.data.volume as { amount?: string })
															?.amount || amount
												  ).toFixed(8)} ${selectedCoin.toUpperCase()}`}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">You receive:</span>
										<span className="text-metallic-gold font-medium">
											{tradeType === "buy"
												? `${parseFloat(
														(pendingOrder.data.volume as { amount?: string })
															?.amount || "0"
												  ).toFixed(8)} ${selectedCoin.toUpperCase()}`
												: `₦${parseFloat(
														(pendingOrder.data.total as { amount?: string })
															?.amount || "0"
												  ).toLocaleString()}`}
										</span>
									</div>
								</div>

								<div className="flex space-x-3">
									<button
										onClick={handleConfirmOrder}
										className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
									>
										Confirm Order
									</button>
									<button
										onClick={handleRequote}
										className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
									>
										<RefreshCw className="h-4 w-4" />
									</button>
									<button
										onClick={handleCancelOrder}
										className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						)}

						<button
							onClick={handleTrade}
							disabled={tradeLoading || !amount || parseFloat(amount) <= 0}
							className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
								tradeLoading || !amount || parseFloat(amount) <= 0
									? "bg-gray-600 text-gray-400 cursor-not-allowed"
									: tradeType === "buy"
									? "bg-metallic-gold text-primary-black hover:bg-gold-hover"
									: "bg-electric-blue text-soft-white hover:bg-blue-hover"
							}`}
						>
							{tradeLoading && <Loader2 className="h-4 w-4 animate-spin" />}
							<span>
								{tradeLoading
									? "Processing..."
									: `${
											tradeType === "buy" ? "Buy" : "Sell"
									  } ${selectedCoin.toUpperCase()}`}
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<h3 className="font-semibold text-soft-white mb-4">Current Rates</h3>
					<div className="space-y-3">
						{ratesLoading ? (
							<div className="flex items-center justify-center py-4">
								<RefreshCw className="h-5 w-5 animate-spin text-metallic-gold" />
							</div>
						) : ratesError ? (
							<p className="text-red-400 text-sm text-center">
								Error loading rates
							</p>
						) : (
							ratesToUse.map((rate) => (
								<div key={rate.marker} className="flex justify-between">
									<span className="text-gray-400">
										{rate.marker.split("ngn")[0].toUpperCase()}
									</span>
									<span className="font-medium text-soft-white">
										₦{rate[tradeType]}
									</span>
								</div>
							))
						)}
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<h3 className="font-semibold text-soft-white mb-4">Your Balances</h3>
					<div className="space-y-3">
						{balanceLoading ? (
							<div className="flex items-center justify-center py-4">
								<RefreshCw className="h-5 w-5 animate-spin text-metallic-gold" />
							</div>
						) : balanceError ? (
							<p className="text-red-400 text-sm text-center">
								Error loading balances
							</p>
						) : (
							balanceToUse.map((bal, index) => (
								<div key={index} className="flex justify-between">
									<span className="text-gray-400">
										{bal.currency.toUpperCase()}
									</span>
									<span className="font-medium text-soft-white">
										{bal.currency === "ngn"
											? `₦${parseFloat(bal.balance || "0").toLocaleString()}`
											: `${parseFloat(bal.balance || "0").toFixed(
													bal.currency === "ngn" ? 2 : 8
											  )} ${bal.currency.toUpperCase()}`}
									</span>
								</div>
							))
						)}
					</div>
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<h3 className="font-semibold text-soft-white mb-4">Trading Limits</h3>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-400">Daily Limit</span>
							<span className="font-medium text-soft-white">
								₦{TRADING_LIMIT.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">Used Today</span>
							{transactionsLoading ? (
								<RefreshCw className="h-4 w-4 animate-spin text-metallic-gold" />
							) : transactionsError ? (
								<span className="text-red-400 text-sm">Error</span>
							) : (
								<span className="font-medium text-soft-white">
									₦{totalDailyTransaction?.toLocaleString() || "0"}
								</span>
							)}
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">Remaining</span>
							{transactionsLoading ? (
								<RefreshCw className="h-4 w-4 animate-spin text-metallic-gold" />
							) : transactionsError ? (
								<span className="text-red-400 text-sm">Error</span>
							) : (
								<span className="font-medium text-metallic-gold">
									₦
									{(
										TRADING_LIMIT - (totalDailyTransaction || 0)
									).toLocaleString()}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
