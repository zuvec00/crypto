import React, { useState } from "react";
import { X, Loader2, AlertCircle, Network } from "lucide-react";

interface SendUSDTModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSend: (data: {
		network: string;
		address: string;
		amount: string;
		note?: string;
	}) => Promise<{ success: boolean; error?: string }>;
	availableBalance: string;
}

export default function SendUSDTModal({
	isOpen,
	onClose,
	onSend,
	availableBalance,
}: SendUSDTModalProps) {
	const [formData, setFormData] = useState({
		network: "trc20",
		address: "",
		amount: "",
		note: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const networks = [
		{
			id: "trc20",
			name: "TRC-20",
			network: "Tron",
			fee: "Low (~1 USDT)",
			color: "text-red-400",
			bgColor: "bg-red-500",
		},
		{
			id: "erc20",
			name: "ERC-20",
			network: "Ethereum",
			fee: "High (~$10-50)",
			color: "text-electric-blue",
			bgColor: "bg-electric-blue",
		},
		{
			id: "bep20",
			name: "BEP-20",
			network: "BSC",
			fee: "Medium (~$2-5)",
			color: "text-yellow-400",
			bgColor: "bg-yellow-500",
		},
	];

	const selectedNetwork = networks.find((n) => n.id === formData.network);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Validation
		if (!formData.address.trim()) {
			setError("Please enter a recipient address");
			setLoading(false);
			return;
		}

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			setError("Please enter a valid amount");
			setLoading(false);
			return;
		}

		if (parseFloat(formData.amount) > parseFloat(availableBalance)) {
			setError("Insufficient balance");
			setLoading(false);
			return;
		}

		const result = await onSend(formData);

		if (result.success) {
			setFormData({ network: "trc20", address: "", amount: "", note: "" });
			onClose();
		} else {
			setError(result.error || "Failed to send USDT");
		}

		setLoading(false);
	};

	const handleMaxAmount = () => {
		setFormData({ ...formData, amount: availableBalance });
	};

	if (!isOpen) return null;

	return (
		<>
			<div
				className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
				onClick={onClose}
			>
				<div
					className="bg-dark-gray rounded-xl border border-medium-gray w-full max-w-lg max-h-[90vh] flex flex-col"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="p-6 border-b border-medium-gray flex-shrink-0">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-bold text-soft-white">Send USDT</h2>
							<button
								onClick={onClose}
								className="text-gray-400 hover:text-soft-white transition-colors"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					</div>

					<form
						onSubmit={handleSubmit}
						className="p-6 space-y-6 overflow-y-auto flex-1"
					>
						{/* Available Balance */}
						<div className="p-4 bg-medium-gray rounded-lg">
							<p className="text-sm text-gray-400 mb-1">Available Balance</p>
							<p className="text-2xl font-bold text-soft-white">
								{parseFloat(availableBalance).toFixed(2)} USDT
							</p>
						</div>

						{/* Network Selection */}
						<div>
							<label className="block text-sm font-medium text-soft-white mb-3">
								Select Network
							</label>
							<div className="grid grid-cols-1 gap-3">
								{networks.map((network) => (
									<button
										key={network.id}
										type="button"
										onClick={() =>
											setFormData({ ...formData, network: network.id })
										}
										className={`p-4 rounded-lg border-2 transition-all text-left ${
											formData.network === network.id
												? `border-${network.bgColor.replace(
														"bg-",
														""
												  )} bg-opacity-10 ${network.bgColor}`
												: "border-light-gray hover:border-medium-gray"
										}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-3">
												<div
													className={`h-10 w-10 ${network.bgColor} bg-opacity-20 rounded-full flex items-center justify-center`}
												>
													<Network className={`h-5 w-5 ${network.color}`} />
												</div>
												<div>
													<p className="font-semibold text-soft-white">
														{network.name}
													</p>
													<p className="text-xs text-gray-400">
														{network.network}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-xs text-gray-400">Network Fee</p>
												<p className={`text-sm font-medium ${network.color}`}>
													{network.fee}
												</p>
											</div>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Recipient Address */}
						<div>
							<label className="block text-sm font-medium text-soft-white mb-2">
								Recipient Address ({selectedNetwork?.name})
							</label>
							<input
								type="text"
								required
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								placeholder={`Enter ${selectedNetwork?.network} address`}
								className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500 font-mono text-sm"
							/>
							<p className="text-xs text-gray-400 mt-1">
								Make sure the address matches the selected network
							</p>
						</div>

						{/* Amount */}
						<div>
							<label className="block text-sm font-medium text-soft-white mb-2">
								Amount (USDT)
							</label>
							<div className="relative">
								<input
									type="number"
									required
									step="0.01"
									min="0"
									value={formData.amount}
									onChange={(e) =>
										setFormData({ ...formData, amount: e.target.value })
									}
									placeholder="0.00"
									className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500"
								/>
								<button
									type="button"
									onClick={handleMaxAmount}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-metallic-gold hover:text-gold-hover transition-colors"
								>
									MAX
								</button>
							</div>
						</div>

						{/* Transaction Note (Optional) */}
						<div>
							<label className="block text-sm font-medium text-soft-white mb-2">
								Note (Optional)
							</label>
							<textarea
								value={formData.note}
								onChange={(e) =>
									setFormData({ ...formData, note: e.target.value })
								}
								placeholder="Add a note for this transaction"
								rows={3}
								className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white placeholder-gray-500 resize-none"
							/>
						</div>

						{/* Warning Message */}
						<div className="flex items-start space-x-2 p-3 bg-yellow-500 bg-opacity-10 rounded-lg border border-yellow-500 border-opacity-30">
							<AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
							<div className="text-sm text-yellow-200">
								<p className="font-medium mb-1">Important</p>
								<p className="text-yellow-300">
									Double-check the recipient address and network. Transactions
									cannot be reversed.
								</p>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="flex items-center space-x-2 p-3 bg-red-500 bg-opacity-10 rounded-lg border border-red-500 border-opacity-30">
								<AlertCircle className="h-5 w-5 text-red-400" />
								<p className="text-sm text-red-400">{error}</p>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex space-x-3 pt-2">
							<button
								type="button"
								onClick={onClose}
								disabled={loading}
								className="flex-1 py-3 px-4 border border-light-gray text-gray-400 rounded-lg hover:bg-medium-gray transition-colors disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="flex-1 py-3 px-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 font-semibold flex items-center justify-center"
							>
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Sending...
									</>
								) : (
									"Send USDT"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
