import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";

const sections = [
	{
		id: "acceptance",
		title: "1. Acceptance of these terms",
		body: (
			<>
				<p>
					These Terms and Conditions ("Terms") govern your relationship with
					Corbit Global ("Corbit Global", "the Desk", "we", "us", "our") when
					you engage us to buy, sell, send, receive, or hold digital assets on
					your behalf against Nigerian Naira ("NGN") or another supported
					currency.
				</p>
				<p>
					By instructing the Desk to place an order — by phone, WhatsApp,
					email, or in person — you accept these Terms in full. If you do not
					agree with any part of these Terms, do not place an order with us.
				</p>
			</>
		),
	},
	{
		id: "definitions",
		title: "2. Definitions",
		body: (
			<ul>
				<li><strong>"Client"</strong> means any individual or entity that instructs the Desk to execute an order.</li>
				<li><strong>"Digital Assets"</strong> means Bitcoin (BTC), Ethereum (ETH), Tether (USDT), Litecoin (LTC), Bitcoin Cash (BCH), Dogecoin (DOGE), and any other cryptocurrency the Desk agrees to trade from time to time.</li>
				<li><strong>"Order"</strong> means an instruction from a Client to buy, sell, send, or receive Digital Assets at a rate quoted by the Desk.</li>
				<li><strong>"Authorized Personnel"</strong> means the staff members of Corbit Global who execute Orders on the Client's behalf.</li>
			</ul>
		),
	},
	{
		id: "service",
		title: "3. Nature of our service",
		body: (
			<>
				<p>
					Corbit Global operates a staff-assisted trading desk. Clients do not
					have direct, self-service access to our internal trading platform or
					wallet infrastructure. Every Order is received by Authorized
					Personnel and executed manually on the Client's behalf using our
					own wallet and settlement infrastructure.
				</p>
				<p>
					A quoted rate is indicative until an Authorized Personnel member
					confirms it against the live market and accepts the Order. Rates
					move continuously and a rate quoted at one point in the conversation
					may no longer be available by the time an Order is confirmed.
				</p>
			</>
		),
	},
	{
		id: "eligibility",
		title: "4. Eligibility",
		body: (
			<p>
				You must be at least 18 years old and have the legal capacity to
				enter into a binding agreement to use our services. By placing an
				Order, you confirm that you meet these requirements and that you are
				acting on your own behalf, or with proper authority on behalf of the
				entity you represent.
			</p>
		),
	},
	{
		id: "verification",
		title: "5. Identity verification and compliance",
		body: (
			<p>
				We may request identification documents, proof of address, source of
				funds information, or other verification before accepting or
				completing an Order, in line with applicable anti-money laundering
				("AML") and know-your-customer ("KYC") obligations. We reserve the
				right to decline, delay, or reverse any Order where verification is
				incomplete or where we reasonably suspect the transaction is
				connected to fraud, money laundering, or any other unlawful activity.
			</p>
		),
	},
	{
		id: "orders",
		title: "6. Placing and confirming an order",
		body: (
			<>
				<p>
					Orders are placed by contacting the Desk directly. An Order is only
					binding once Authorized Personnel confirms the rate, amount, and
					settlement details back to you and you accept them.
				</p>
				<p>
					You are responsible for providing accurate settlement details — the
					correct bank account for Naira, or the correct wallet address for
					Digital Assets. Corbit Global is not liable for funds sent to
					incorrect details supplied by the Client.
				</p>
			</>
		),
	},
	{
		id: "settlement",
		title: "7. Settlement and delivery",
		body: (
			<p>
				Naira proceeds are settled by bank transfer to the account you
				provide. Digital Assets are sent to the wallet address you provide.
				Once a blockchain transaction is broadcast, it cannot be reversed,
				cancelled, or recalled by Corbit Global. Settlement times depend on
				bank processing times and blockchain network conditions, which are
				outside our control.
			</p>
		),
	},
	{
		id: "fees",
		title: "8. Fees and charges",
		body: (
			<p>
				Our rates already reflect any spread or service charge applicable to
				an Order unless we tell you otherwise at the time the Order is
				confirmed. Any additional fees — for example, third-party bank
				charges or network fees — will be communicated before the Order is
				finalized.
			</p>
		),
	},
	{
		id: "cancellations",
		title: "9. Cancellations and reversals",
		body: (
			<p>
				An Order may be cancelled only before it has been executed by
				Authorized Personnel. Once Naira has been transferred out or a
				Digital Asset transaction has been broadcast to its network, the
				Order is final and cannot be cancelled or reversed.
			</p>
		),
	},
	{
		id: "risk",
		title: "10. Risk disclosure",
		body: (
			<>
				<p>
					Digital Assets are volatile and their value can rise or fall
					significantly and rapidly. Nothing on this website or communicated
					by the Desk constitutes financial, investment, tax, or legal
					advice, and Corbit Global does not guarantee any rate of return.
				</p>
				<p>
					You should only trade with funds you can afford to expose to this
					volatility, and you trade on the understanding that you accept
					these risks in full.
				</p>
			</>
		),
	},
	{
		id: "aml",
		title: "11. Anti-money laundering",
		body: (
			<p>
				Corbit Global complies with applicable Nigerian anti-money laundering
				and counter-terrorism financing laws. We monitor transactions for
				suspicious activity and will report, decline, or suspend an Order or
				Client relationship where required by law or where we have reasonable
				grounds for suspicion.
			</p>
		),
	},
	{
		id: "prohibited",
		title: "12. Prohibited use",
		body: (
			<ul>
				<li>Using our services for money laundering, terrorism financing, or any other illegal activity.</li>
				<li>Providing false, stolen, or misleading identity or account information.</li>
				<li>Attempting to defraud Corbit Global, another Client, or a third party.</li>
				<li>Using our services on behalf of a sanctioned individual or entity.</li>
			</ul>
		),
	},
	{
		id: "liability",
		title: "13. Limitation of liability",
		body: (
			<p>
				To the fullest extent permitted by law, Corbit Global is not liable
				for indirect, incidental, or consequential losses, including losses
				arising from market movements between the time an Order is discussed
				and the time it is confirmed, delays caused by banking or blockchain
				networks, or funds misdirected due to incorrect details supplied by
				the Client.
			</p>
		),
	},
	{
		id: "privacy",
		title: "14. Privacy and data protection",
		body: (
			<p>
				Information you provide — including identification documents, bank
				details, and contact information — is used solely to verify your
				identity, execute your Orders, and meet our legal obligations. We do
				not sell your personal information and handle it in line with the
				Nigeria Data Protection Act.
			</p>
		),
	},
	{
		id: "amendments",
		title: "15. Changes to these terms",
		body: (
			<p>
				We may update these Terms from time to time to reflect changes in our
				services or applicable law. The updated Terms take effect once
				published, and your continued use of our services after that point
				constitutes acceptance of the changes.
			</p>
		),
	},
	{
		id: "termination",
		title: "16. Suspension and termination",
		body: (
			<p>
				We may suspend or decline to serve any Client at our discretion,
				including where we suspect misuse of our services, non-compliance
				with these Terms, or where required by law or our banking and
				liquidity partners.
			</p>
		),
	},
	{
		id: "law",
		title: "17. Governing law",
		body: (
			<p>
				These Terms are governed by the laws of the Federal Republic of
				Nigeria. Any dispute arising from these Terms or our services will
				first be referred for good-faith resolution between the parties
				before either party pursues formal proceedings before the courts of
				Nigeria.
			</p>
		),
	},
	{
		id: "contact",
		title: "18. Contact us",
		body: (
			<>
				<p>Questions about these Terms can be sent to:</p>
				<ul>
					<li>Phone: <a href="tel:07077737387" className="text-metallic-gold hover:underline">0707 773 7387</a></li>
					<li>Email: <a href="mailto:Corbitglobal1@gmail.com" className="text-metallic-gold hover:underline">Corbitglobal1@gmail.com</a></li>
					<li>Office: Block 1A, Tatiana Court, Ikota Villa Estate, Lekki, Lagos</li>
				</ul>
			</>
		),
	},
];

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-primary-black text-soft-white">
			<header className="sticky top-0 z-40 bg-primary-black/90 backdrop-blur border-b border-medium-gray">
				<div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-3">
						<div className="bg-white p-1 rounded-[12px]">
							<img src={logo} alt="Corbit Global" className="h-8 w-8" />
						</div>
						<span className="text-lg font-bold">Corbit Global</span>
					</Link>
					<Link
						to="/"
						className="flex items-center gap-2 text-sm text-gray-400 hover:text-soft-white transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to home
					</Link>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[220px_1fr] gap-12">
				{/* TOC */}
				<nav className="hidden lg:block sticky top-28 self-start space-y-1 text-sm">
					{sections.map((s) => (
						<a
							key={s.id}
							href={`#${s.id}`}
							className="block px-3 py-1.5 rounded-lg text-gray-400 hover:text-soft-white hover:bg-dark-gray transition-colors"
						>
							{s.title}
						</a>
					))}
				</nav>

				{/* Content */}
				<div>
					<div className="flex items-center gap-2 text-metallic-gold text-xs font-semibold uppercase tracking-wider mb-3">
						<span className="h-px w-5 bg-metallic-gold" />
						Legal
					</div>
					<h1 className="text-3xl sm:text-4xl font-bold mb-3">
						Terms &amp; Conditions
					</h1>
					<p className="text-sm text-gray-500 mb-10">
						Last updated: 18 July 2026
					</p>

					<div className="card mb-10">
						<p className="text-gray-400 text-sm leading-relaxed">
							Corbit Global is a staff-assisted digital asset trading desk.
							We do not offer a self-service trading application to the
							public — every trade is placed through our team and executed
							on your behalf. Please read these Terms carefully before
							instructing us to place an Order.
						</p>
					</div>

					<div className="space-y-12">
						{sections.map((s) => (
							<section key={s.id} id={s.id} className="scroll-mt-28">
								<h2 className="text-xl font-semibold mb-4">{s.title}</h2>
								<div className="text-gray-400 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:marker:text-metallic-gold">
									{s.body}
								</div>
							</section>
						))}
					</div>
				</div>
			</div>

			<footer className="border-t border-medium-gray">
				<div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-sm text-gray-400">
						<div className="bg-white p-0.5 rounded-lg">
							<img src={logo} alt="Corbit Global" className="h-5 w-5" />
						</div>
						&copy; 2026 Corbit Global &middot; Powered by Quidax API
					</div>
					<div className="flex gap-6 text-sm text-gray-500">
						<Link to="/" className="hover:text-gray-300">Home</Link>
						<Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
