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
import Logo from "./Logo";

export default function LoginScreen() {
	const { login, loading, error } = useAuthStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await login({ email, password });
		if (success) {
			// Login successful, user state will be updated automatically
			console.log("Login successful");
		}
	};

	return (
		<div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto mb-6 flex items-center justify-center">
						<Logo size="lg" />
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

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-metallic-gold focus:ring-metallic-gold border-gray-500 rounded bg-medium-gray"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-300"
								>
									Remember me
								</label>
							</div>
							<a
								href="#"
								className="text-sm text-metallic-gold hover:text-gold-hover"
							>
								Forgot password?
							</a>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-metallic-gold text-primary-black py-3 px-4 rounded-lg hover:bg-gold-hover focus:ring-2 focus:ring-metallic-gold focus:ring-offset-2 focus:ring-offset-primary-black transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing In..." : "Sign In"}
						</button>
					</form>

					<div className="mt-6 p-4 bg-electric-blue bg-opacity-20 rounded-lg border border-electric-blue border-opacity-30">
						<div className="flex items-center text-sm text-electric-blue">
							<CheckCircle className="h-4 w-4 mr-2 text-electric-blue" />
							<span className="font-medium">Quidax API Connected</span>
						</div>
					</div>
				</div>

				<div className="text-center">
					<p className="text-sm text-gray-400 flex items-center justify-center">
						<Lock className="h-4 w-4 mr-1 text-metallic-gold" />
						Powered by Quidax API
					</p>
				</div>
			</div>
		</div>
	);
}
