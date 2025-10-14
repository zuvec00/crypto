import { useCallback, useState } from "react";
import {
	TrendingUp,
	TrendingDown,
	ArrowUpDown,
	Copy,
	Network,
	Loader2,
	CheckCircle,
	DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUSDTWallet } from "../../hooks/useUSDTWallet";
import { useTransactions } from "../../hooks/useTransactions";
import SendUSDTModal from "../../components/SendUSDTModal";
import Toast from "../../components/Toast";
import { apiService } from "../../services/api";

export default function USDTWalletPage() {
	const navigate = useNavigate();
	const { wallet, loading, refetch } = useUSDTWallet();
	const {
		trasactions,
		loading: transactionsLoading,
		refetch: refetchTransactions,
	} = useTransactions();
	const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
	const [sendModalOpen, setSendModalOpen] = useState(false);
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);

	const usdtTransactions = trasactions.filter(
		(tx) => tx.market?.quote_unit === "usdt" || tx.market?.base_unit === "usdt"
	);

	const networks = [
		{
			id: "trc20",
			name: "TRC-20",
			network: "Tron",
			color: "bg-red-500",
			textColor: "text-red-400",
		},
		{
			id: "erc20",
			name: "ERC-20",
			network: "Ethereum",
			color: "bg-electric-blue",
			textColor: "text-electric-blue",
		},
		{
			id: "bep20",
			name: "BEP-20",
			network: "BSC",
			color: "bg-yellow-500",
			textColor: "text-yellow-400",
		},
	];

	const getAddressByNetwork = useCallback(
		(networkId: string) => {
			return wallet?.addresses?.find((addr) => addr.network === networkId);
		},
		[wallet?.addresses]
	);

	const copyToClipboard = async (text: string, networkId: string) => {
		await navigator.clipboard.writeText(text);
		setCopiedAddress(networkId);
		setTimeout(() => setCopiedAddress(null), 2000);
	};

	const handleSendUSDT = async (data: {
		network: string;
		address: string;
		amount: string;
		note?: string;
	}) => {
		try {
			const reference = `USDT-${Date.now()}-${Math.random()
				.toString(36)
				.substring(7)}`;

			await apiService.withdrawCrypto({
				currency: "usdt",
				amount: data.amount,
				fund_uid: data.address,
				network: data.network,
				transaction_note: data.note,
				reference: reference,
				narration:
					data.note ||
					`Send ${data.amount} USDT via ${data.network.toUpperCase()}`,
			});

			setToast({ message: "USDT sent successfully!", type: "success" });

			// Refetch wallet and transactions after a short delay
			setTimeout(() => {
				refetch();
				refetchTransactions();
			}, 1000);

			return { success: true };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to send USDT";
			setToast({ message: errorMessage, type: "error" });
			return { success: false, error: errorMessage };
		}
	};

	return (
		<>
			<SendUSDTModal
				isOpen={sendModalOpen}
				onClose={() => setSendModalOpen(false)}
				onSend={handleSendUSDT}
				availableBalance={wallet?.balance || "0"}
			/>

			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}

			<div className="space-y-8">
				<div>
					<h1 className="text-2xl font-bold text-soft-white mb-2">
						USDT Wallet
					</h1>
					<p className="text-gray-400">Manage your USDT across all networks</p>
				</div>

				<div className="bg-dark-gray p-8 rounded-xl border border-medium-gray">
					{loading ? (
						<div className="text-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-metallic-gold mx-auto mb-4" />
							<p className="text-gray-400">Loading wallet...</p>
						</div>
					) : (
						<>
							<div className="text-center mb-6">
								<div className="h-16 w-16 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
									<DollarSign className="h-8 w-8 text-metallic-gold" />
								</div>
								<h2 className="text-3xl font-bold text-soft-white">
									{parseFloat(wallet?.balance || "0").toFixed(2)} USDT
								</h2>
								<p className="text-gray-400">All Networks Combined</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<button className="flex items-center justify-center p-4 bg-metallic-gold bg-opacity-20 text-metallic-gold rounded-lg hover:bg-opacity-30 transition-colors">
									<TrendingUp className="h-5 w-5 mr-2" />
									Receive USDT
								</button>
								<button
									onClick={() => setSendModalOpen(true)}
									className="flex items-center justify-center p-4 border border-light-gray rounded-lg hover:border-metallic-gold hover:bg-metallic-gold hover:bg-opacity-10 transition-colors text-soft-white"
								>
									<TrendingDown className="h-5 w-5 mr-2" />
									Send USDT
								</button>
								<button
									onClick={() => navigate("/worker/trade")}
									className="flex items-center justify-center p-4 bg-electric-blue text-soft-white rounded-lg hover:bg-blue-hover transition-all"
								>
									<ArrowUpDown className="h-5 w-5 mr-2" />
									Trade USDT
								</button>
							</div>
						</>
					)}
				</div>

				<div className="space-y-6">
					<h3 className="text-lg font-semibold text-soft-white">
						Network Addresses
					</h3>

					{networks.map((network) => {
						const addressData = getAddressByNetwork(network.id);

						return (
							<div
								key={network.id}
								className="bg-dark-gray p-6 rounded-xl border border-medium-gray"
							>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center space-x-3">
										<div
											className={`h-10 w-10 ${network.color} bg-opacity-20 rounded-full flex items-center justify-center`}
										>
											<span
												className={`${network.textColor} text-sm font-bold`}
											>
												{network.name[0]}
											</span>
										</div>
										<div>
											<h4 className="font-semibold text-soft-white">
												USDT {network.name}
											</h4>
											<p className="text-sm text-gray-400">
												{network.network} Network
											</p>
										</div>
									</div>
									<Network className="h-5 w-5 text-gray-400" />
								</div>

								<div className="space-y-4">
									<div>
										<p className="text-sm text-gray-400 mb-2">
											Deposit Address:
										</p>
										{loading ? (
											<div className="flex items-center justify-center py-4">
												<Loader2
													className={`h-5 w-5 animate-spin ${network.textColor}`}
												/>
											</div>
										) : addressData?.status === "pending" ? (
											<div className="p-4 bg-medium-gray rounded-lg">
												<p className="text-sm text-gray-400">
													Address generating...
												</p>
											</div>
										) : addressData?.address ? (
											<div className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
												<span className="text-sm font-mono text-soft-white break-all mr-4">
													{addressData.address}
												</span>
												<button
													onClick={() =>
														copyToClipboard(addressData.address, network.id)
													}
													className={`p-2 ${
														network.textColor
													} hover:bg-opacity-20 hover:${network.color.replace(
														"bg-",
														"bg-"
													)} rounded transition-colors flex-shrink-0`}
												>
													{copiedAddress === network.id ? (
														<CheckCircle className="h-4 w-4" />
													) : (
														<Copy className="h-4 w-4" />
													)}
												</button>
											</div>
										) : (
											<div className="p-4 bg-medium-gray rounded-lg">
												<p className="text-sm text-gray-400">
													Address not available
												</p>
											</div>
										)}
									</div>

									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-400">Network Fee:</span>
										<span className="text-soft-white">
											{network.id === "trc20"
												? "Low"
												: network.id === "bep20"
												? "Medium"
												: "High"}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
					<h3 className="text-lg font-semibold text-soft-white mb-4">
						Network Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div className="p-4 bg-medium-gray rounded-lg">
							<h4 className="font-medium text-red-400 mb-2">TRC-20 (Tron)</h4>
							<p className="text-gray-400">Lowest fees, fastest confirmation</p>
						</div>
						<div className="p-4 bg-medium-gray rounded-lg">
							<h4 className="font-medium text-electric-blue mb-2">
								ERC-20 (Ethereum)
							</h4>
							<p className="text-gray-400">Most compatible, higher fees</p>
						</div>
						<div className="p-4 bg-medium-gray rounded-lg">
							<h4 className="font-medium text-yellow-400 mb-2">BEP-20 (BSC)</h4>
							<p className="text-gray-400">Balanced fees and speed</p>
						</div>
					</div>
				</div>

				<div className="bg-dark-gray rounded-xl border border-medium-gray">
					<div className="p-6 border-b border-medium-gray">
						<h3 className="text-lg font-semibold text-soft-white">
							USDT Transaction History
						</h3>
					</div>
					<div className="p-6">
						{transactionsLoading ? (
							<div className="text-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-metallic-gold mx-auto mb-4" />
								<p className="text-gray-400">Loading transactions...</p>
							</div>
						) : (
							<div className="space-y-4">
								{usdtTransactions.length > 0 ? (
									usdtTransactions.map((tx) => (
										<div
											key={tx.id}
											className="flex items-center justify-between p-4 bg-medium-gray rounded-lg"
										>
											<div className="flex items-center space-x-4">
												<div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center">
													<DollarSign className="h-5 w-5 text-metallic-gold" />
												</div>
												<div>
													<p className="font-medium text-soft-white">
														{tx.side} USDT
													</p>
													<p className="text-sm text-gray-400">
														{new Date(tx.created_at).toLocaleString()}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-medium text-soft-white">
													{tx.volume} USDT
												</p>
												<span
													className={`text-xs px-2 py-1 rounded-full ${
														tx.state === "done"
															? "bg-green-500 bg-opacity-20 text-green-400"
															: tx.state === "wait"
															? "bg-yellow-500 bg-opacity-20 text-yellow-400"
															: "bg-red-500 bg-opacity-20 text-red-400"
													}`}
												>
													{tx.state}
												</span>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-8">
										<DollarSign className="h-12 w-12 text-gray-500 mx-auto mb-4" />
										<p className="text-gray-400">No transactions yet</p>
										<p className="text-sm text-gray-500">
											Your USDT transactions will appear here
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
