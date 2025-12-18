import React, { useState } from "react";
import {
	Lock,
	Mail,
	Eye,
	EyeOff,
	Shield,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function LoginPage() {
	const { login, loading, error, user } = useAuthStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	if (user) {
		return (
			<Navigate to={user.role === "admin" ? "/admin" : "/worker"} replace />
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await login({ email, password });
	};

	return (
		<div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					{/* <div className="mx-auto h-16 w-16 bg-metallic-gold rounded-full flex items-center justify-center mb-6">
						<Shield className="h-8 w-8 text-primary-black" />
					</div> */}
					<div className="flex items-center justify-center gap-3 mb-2">
						<div className="bg-white p-1 rounded-[12px]">
							<img src={logo} alt="Corbit Global" className="h-10 w-10" />
						</div>
						<h2 className="text-3xl font-bold text-soft-white">
							Corbit Global
						</h2>
					</div>
					<p className="text-gray-400">
						Professional cryptocurrency trading platform
					</p>
				</div>

				<div className="bg-dark-gray rounded-xl shadow-lg p-8 border border-medium-gray">
					{error && (
						<div className="mb-4 p-3 bg-red-500 bg-opacity-20 rounded-lg border border-red-500 border-opacity-30">
							<div className="flex items-center text-sm text-red-400">
								<AlertCircle className="h-4 w-4 mr-2" />
								<span>{error}</span>
							</div>
						</div>
					)}
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-soft-white mb-2"
							>
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
								<input
									id="email"
									name="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10 w-full px-4 py-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent outline-none transition-all text-soft-white placeholder-gray-500"
									placeholder="Enter your email"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-soft-white mb-2"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pl-10 pr-10 w-full px-4 py-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent outline-none transition-all text-soft-white placeholder-gray-500"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-300"
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full btn-primary py-3 focus:ring-2 focus:ring-metallic-gold focus:ring-offset-2 focus:ring-offset-primary-black disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing In..." : "Sign In"}
						</button>
					</form>

					{/* <div className="mt-6 p-4 bg-electric-blue bg-opacity-20 rounded-lg border border-electric-blue border-opacity-30">
						<div className="flex items-center text-sm text-electric-blue">
							<CheckCircle className="h-4 w-4 mr-2 text-electric-blue" />
							<span className="font-medium">Quidax API Connected</span>
						</div>
					</div> */}
				</div>

				{/* <div className="text-center">
					<p className="text-sm text-gray-400 flex items-center justify-center">
						<Lock className="h-4 w-4 mr-1 text-metallic-gold" />
						Powered by Quidax API
					</p>
				</div> */}
			</div>
		</div>
	);
}
