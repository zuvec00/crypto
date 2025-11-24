import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Bell, Search, Menu, X, CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Logo from "./Logo";

interface LayoutProps {
	menuItems: Array<{
		icon: React.ComponentType<any>;
		label: string;
		path: string;
	}>;
	title: string;
}

export default function Layout({ menuItems, title }: LayoutProps) {
	const { user, logout } = useAuthStore();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const Sidebar = () => (
		<>
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-gray border-r border-medium-gray transform ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
			>
				<div className="flex items-center justify-between h-16 px-6 border-b border-medium-gray">
					<Logo size="md" />
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
						const isActive = location.pathname === item.path;
						return (
							<button
								key={item.path}
								onClick={() => {
									navigate(item.path);
									setSidebarOpen(false);
								}}
								className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
									isActive
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
						onClick={logout}
						className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors"
					>
						<LogOut className="h-5 w-5 mr-3" />
						Logout
					</button>
				</div>
			</div>
		</>
	);

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
							placeholder="Search..."
							className="pl-10 pr-4 py-2 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-sm w-64 text-soft-white placeholder-gray-500"
						/>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2 px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full">
						<CheckCircle className="h-4 w-4 text-electric-blue" />
						<span className="text-sm font-medium text-electric-blue">
							API Connected
						</span>
					</div>

					<button className="p-2 text-gray-400 hover:text-gray-300 relative">
						<Bell className="h-5 w-5" />
						<span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
					</button>

					<div className="flex items-center space-x-3">
						<div className="text-right">
							<p className="text-sm font-medium text-soft-white">
								{user?.name}
							</p>
							<p className="text-xs text-gray-400">
								{user?.role === "admin" ? "Administrator" : "Worker Account"}
							</p>
						</div>
						<div className="h-8 w-8 bg-metallic-gold rounded-full flex items-center justify-center">
							<span className="text-primary-black text-sm font-medium">
								{user?.name.charAt(0).toUpperCase()}
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);

	return (
		<div className="flex h-screen bg-primary-black">
			<Sidebar />

			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />

				<main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
