import { Link, Navigate } from "react-router-dom";
import {
	ArrowUpDown,
	Wallet,
	Banknote,
	Bitcoin,
	Coins,
	DollarSign,
	ShieldCheck,
	KeyRound,
	Webhook,
	Gauge,
	Phone,
	Mail,
	MapPin,
	CheckCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.png";

const assets = [
	{ symbol: "BTC", name: "Bitcoin", icon: Bitcoin },
	{ symbol: "ETH", name: "Ethereum", icon: Coins },
	{ symbol: "USDT", name: "Tether", icon: DollarSign },
	{ symbol: "LTC", name: "Litecoin", icon: Coins },
	{ symbol: "BCH", name: "Bitcoin Cash", icon: Coins },
	{ symbol: "DOGE", name: "Dogecoin", icon: Coins },
	{ symbol: "NGN", name: "Naira", icon: Banknote },
];

const services = [
	{
		icon: ArrowUpDown,
		title: "Buy & sell at a quoted rate",
		body: "Bitcoin, Ethereum, USDT, Litecoin, Bitcoin Cash and Dogecoin, priced against the Naira and confirmed by your desk before it settles.",
	},
	{
		icon: Wallet,
		title: "Send & receive crypto",
		body: "Move coins to an external wallet or receive into your own address, tracked against your account until it's confirmed on-chain.",
	},
	{
		icon: Banknote,
		title: "Fund & withdraw Naira",
		body: "Top up by bank transfer, withdraw straight back to any Nigerian bank account, and see the whole trail in your transaction history.",
	},
];

const steps = [
	{
		n: "01",
		title: "Fund your wallet",
		body: "Transfer Naira into your Corbit Global account, or hold existing crypto in your BTC, ETH or USDT wallet.",
	},
	{
		n: "02",
		title: "Tell the desk what you need",
		body: "Buy, sell or send — your desk quotes the rate, confirms the amount, and executes it against the live market.",
	},
	{
		n: "03",
		title: "Settle where you want it",
		body: "Naira lands in your linked bank account; crypto lands in your wallet or the external address you gave us.",
	},
];

const securityPoints = [
	{
		icon: KeyRound,
		title: "Session-based access control",
		body: "Every login is authenticated and token-based, with separate permissions for account holders and desk staff.",
	},
	{
		icon: ShieldCheck,
		title: "Wallets on Quidax infrastructure",
		body: "Crypto custody and settlement run on Quidax's exchange rails, not a wallet we hand-rolled ourselves.",
	},
	{
		icon: Webhook,
		title: "Verified transaction webhooks",
		body: "Deposits, withdrawals and wallet events are confirmed through signature-verified webhooks before your balance moves.",
	},
	{
		icon: Gauge,
		title: "Rate limits on the sensitive stuff",
		body: "Login, buy/sell and withdrawal requests are throttled to keep accounts safe from abuse.",
	},
];

export default function LandingPage() {
	const { user } = useAuthStore();

	if (user) {
		return <Navigate to={user.role === "admin" ? "/admin" : "/worker"} replace />;
	}

	return (
		<div className="min-h-screen bg-primary-black text-soft-white">
			{/* Nav */}
			<header className="sticky top-0 z-40 bg-primary-black/90 backdrop-blur border-b border-medium-gray">
				<div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-white p-1 rounded-[12px]">
							<img src={logo} alt="Corbit Global" className="h-8 w-8" />
						</div>
						<span className="text-lg font-bold">Corbit Global</span>
					</div>
					<nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
						<a href="#services" className="hover:text-soft-white transition-colors">Platform</a>
						<a href="#assets" className="hover:text-soft-white transition-colors">Assets</a>
						<a href="#how" className="hover:text-soft-white transition-colors">How it works</a>
						<a href="#security" className="hover:text-soft-white transition-colors">Security</a>
						<a href="#contact" className="hover:text-soft-white transition-colors">Contact</a>
					</nav>
					<div className="flex items-center gap-3">
						<a href="tel:07077737387" className="hidden sm:inline-flex btn-secondary text-sm">
							Call the desk
						</a>
						<Link to="/login" className="btn-primary text-sm">
							Staff Login
						</Link>
					</div>
				</div>
			</header>

			{/* Hero */}
			<section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-14 items-center">
				<div>
					<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-4">
						<span className="h-px w-5 bg-metallic-gold" />
						Naira &harr; Crypto, handled by people
					</div>
					<h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
						A trading desk for your crypto —{" "}
						<span className="text-blue-hover">not just an app.</span>
					</h1>
					<p className="text-gray-400 text-lg mb-8 max-w-xl">
						Corbit Global buys, sells, and settles Bitcoin, Ethereum, USDT and
						more against the Naira, with a dedicated desk behind every account
						instead of a form you fill in and hope.
					</p>
					<div className="flex flex-wrap gap-4 mb-8">
						<a href="#contact" className="btn-primary px-6 py-3">
							Open a desk account
						</a>
						<a href="#how" className="btn-secondary px-6 py-3">
							See how a trade works
						</a>
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
						<span className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-metallic-gold" />
							NGN settlement to your bank
						</span>
						<span className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-metallic-gold" />
							Multi-asset wallet per account
						</span>
						<span className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-metallic-gold" />
							Built on Quidax infrastructure
						</span>
					</div>
				</div>

				{/* Wallet overview mock */}
				<div className="card">
					<div className="flex items-center justify-between mb-6">
						<span className="text-xs uppercase tracking-wider text-gray-500">
							Wallet overview
						</span>
						<span className="flex items-center gap-2 text-xs font-semibold text-metallic-gold">
							<span className="h-1.5 w-1.5 rounded-full bg-metallic-gold" />
							Desk active
						</span>
					</div>
					<div className="text-3xl font-bold mb-1">&#8358;2,450,000.00</div>
					<div className="text-sm text-gray-400 mb-6">
						Available Naira balance
					</div>
					<div className="border-t border-medium-gray">
						<div className="flex items-center justify-between py-3 border-b border-medium-gray">
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-lg bg-metallic-gold bg-opacity-20 flex items-center justify-center">
									<Bitcoin className="h-4 w-4 text-metallic-gold" />
								</div>
								<span className="text-sm">Bitcoin</span>
							</div>
							<span className="text-sm font-medium">0.0421 BTC</span>
						</div>
						<div className="flex items-center justify-between py-3 border-b border-medium-gray">
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-lg bg-electric-blue bg-opacity-20 flex items-center justify-center">
									<Coins className="h-4 w-4 text-electric-blue" />
								</div>
								<span className="text-sm">Ethereum</span>
							</div>
							<span className="text-sm font-medium">1.238 ETH</span>
						</div>
						<div className="flex items-center justify-between py-3">
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-lg bg-steel-blue bg-opacity-20 flex items-center justify-center">
									<DollarSign className="h-4 w-4 text-steel-blue" />
								</div>
								<span className="text-sm">Tether</span>
							</div>
							<span className="text-sm font-medium">640.00 USDT</span>
						</div>
					</div>
					<div className="flex gap-3 mt-6">
						<a href="#contact" className="btn-primary flex-1 text-center text-sm">
							Buy
						</a>
						<a href="#contact" className="btn-secondary flex-1 text-center text-sm">
							Sell
						</a>
					</div>
				</div>
			</section>

			{/* Services */}
			<section id="services" className="max-w-6xl mx-auto px-6 py-16 border-t border-medium-gray">
				<div className="max-w-2xl mb-10">
					<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-3">
						<span className="h-px w-5 bg-metallic-gold" />
						What the desk does
					</div>
					<h2 className="text-3xl font-bold mb-3">
						Everything you need to move between Naira and crypto.
					</h2>
					<p className="text-gray-400">
						One account, one team, three things done properly — buying and
						selling, moving crypto in and out, and keeping your Naira liquid.
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-6">
					{services.map((s) => (
						<div key={s.title} className="card hover:border-light-gray transition-colors">
							<div className="h-11 w-11 rounded-lg bg-electric-blue bg-opacity-20 flex items-center justify-center mb-5">
								<s.icon className="h-5 w-5 text-electric-blue" />
							</div>
							<h3 className="font-semibold text-lg mb-2">{s.title}</h3>
							<p className="text-sm text-gray-400">{s.body}</p>
						</div>
					))}
				</div>
			</section>

			{/* How it works */}
			<section id="how" className="max-w-6xl mx-auto px-6 py-16">
				<div className="max-w-2xl mb-10">
					<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-3">
						<span className="h-px w-5 bg-metallic-gold" />
						How a trade actually runs
					</div>
					<h2 className="text-3xl font-bold">
						Three steps, and someone on the other end for all of them.
					</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{steps.map((step) => (
						<div key={step.n}>
							<div className="text-electric-blue font-mono text-sm font-semibold mb-3">
								{step.n}
							</div>
							<h3 className="font-semibold text-lg mb-2">{step.title}</h3>
							<p className="text-sm text-gray-400">{step.body}</p>
						</div>
					))}
				</div>
			</section>

			{/* Assets */}
			<section id="assets" className="max-w-6xl mx-auto px-6 py-16 border-t border-medium-gray">
				<div className="max-w-2xl mb-10">
					<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-3">
						<span className="h-px w-5 bg-metallic-gold" />
						Supported assets
					</div>
					<h2 className="text-3xl font-bold">Major coins, one Naira wallet.</h2>
				</div>
				<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
					{assets.map((a) => (
						<div key={a.symbol} className="card text-center p-5">
							<div className="h-11 w-11 mx-auto mb-3 rounded-lg bg-metallic-gold bg-opacity-20 flex items-center justify-center">
								<a.icon className="h-5 w-5 text-metallic-gold" />
							</div>
							<div className="font-semibold text-sm">{a.symbol}</div>
							<div className="text-xs text-gray-500 mt-0.5">{a.name}</div>
						</div>
					))}
				</div>
			</section>

			{/* Security */}
			<section id="security" className="max-w-6xl mx-auto px-6 py-16 border-t border-medium-gray">
				<div className="max-w-2xl mb-10">
					<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-3">
						<span className="h-px w-5 bg-metallic-gold" />
						Under the hood
					</div>
					<h2 className="text-3xl font-bold">
						Built like infrastructure, run like a desk.
					</h2>
				</div>
				<div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
					{securityPoints.map((point) => (
						<div key={point.title} className="flex gap-4">
							<div className="h-9 w-9 rounded-lg bg-electric-blue bg-opacity-20 border border-electric-blue border-opacity-30 flex items-center justify-center flex-shrink-0">
								<point.icon className="h-4 w-4 text-electric-blue" />
							</div>
							<div>
								<h3 className="font-semibold text-sm mb-1">{point.title}</h3>
								<p className="text-sm text-gray-400">{point.body}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Contact */}
			<section id="contact" className="max-w-6xl mx-auto px-6 py-16 border-t border-medium-gray">
				<div className="card bg-gradient-to-br from-dark-gray to-primary-black p-10 grid lg:grid-cols-2 gap-10 items-center">
					<div>
						<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-3">
							<span className="h-px w-5 bg-metallic-gold" />
							Talk to the desk
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold mb-4">
							Ready when you are — call, email, or come by the office.
						</h2>
						<p className="text-gray-400 max-w-md">
							Open an account, ask about a rate, or get help with an existing
							trade. A person picks this up, not a queue.
						</p>
					</div>
					<div className="space-y-4">
						<a
							href="tel:07077737387"
							className="flex items-center gap-4 bg-medium-gray bg-opacity-40 border border-light-gray rounded-lg px-4 py-3 hover:border-metallic-gold transition-colors"
						>
							<div className="h-9 w-9 rounded-lg bg-metallic-gold bg-opacity-20 flex items-center justify-center flex-shrink-0">
								<Phone className="h-4 w-4 text-metallic-gold" />
							</div>
							<div>
								<div className="text-xs uppercase tracking-wider text-gray-500">
									Phone
								</div>
								<div className="text-sm font-medium">0707 773 7387</div>
							</div>
						</a>
						<a
							href="mailto:Corbitglobal1@gmail.com"
							className="flex items-center gap-4 bg-medium-gray bg-opacity-40 border border-light-gray rounded-lg px-4 py-3 hover:border-metallic-gold transition-colors"
						>
							<div className="h-9 w-9 rounded-lg bg-metallic-gold bg-opacity-20 flex items-center justify-center flex-shrink-0">
								<Mail className="h-4 w-4 text-metallic-gold" />
							</div>
							<div>
								<div className="text-xs uppercase tracking-wider text-gray-500">
									Email
								</div>
								<div className="text-sm font-medium">
									Corbitglobal1@gmail.com
								</div>
							</div>
						</a>
						<div className="flex items-center gap-4 bg-medium-gray bg-opacity-40 border border-light-gray rounded-lg px-4 py-3">
							<div className="h-9 w-9 rounded-lg bg-metallic-gold bg-opacity-20 flex items-center justify-center flex-shrink-0">
								<MapPin className="h-4 w-4 text-metallic-gold" />
							</div>
							<div>
								<div className="text-xs uppercase tracking-wider text-gray-500">
									Office
								</div>
								<div className="text-sm font-medium">
									Block 1A, Tatiana Court, Ikota Villa Estate, Lekki, Lagos
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-medium-gray">
				<div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-sm text-gray-400">
						<div className="bg-white p-0.5 rounded-lg">
							<img src={logo} alt="Corbit Global" className="h-5 w-5" />
						</div>
						&copy; 2026 Corbit Global &middot; Powered by Quidax API
					</div>
					<div className="flex gap-6 text-sm text-gray-500">
						<a href="#services" className="hover:text-gray-300">Platform</a>
						<a href="#security" className="hover:text-gray-300">Security</a>
						<a href="#contact" className="hover:text-gray-300">Contact</a>
						<Link to="/terms" className="hover:text-gray-300">Terms</Link>
						<Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
