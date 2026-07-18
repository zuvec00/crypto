import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";

const sections = [
	{
		id: "intro",
		title: "1. Introduction",
		body: (
			<p>
				This Privacy Policy explains how Corbit Global ("Corbit Global",
				"we", "us", "our") collects, uses, shares, and protects your
				information when you contact us or instruct us to place a Digital
				Asset order. It applies alongside our{" "}
				<Link to="/terms" className="text-metallic-gold hover:underline">
					Terms &amp; Conditions
				</Link>
				.
			</p>
		),
	},
	{
		id: "collect",
		title: "2. Information we collect",
		body: (
			<ul>
				<li><strong>Identity information</strong> — full name, date of birth, government-issued ID, and photograph, collected for verification purposes.</li>
				<li><strong>Contact information</strong> — phone number, email address, and physical address.</li>
				<li><strong>Financial information</strong> — bank account details used to settle Naira, and wallet addresses used to send or receive Digital Assets.</li>
				<li><strong>Transaction information</strong> — the Orders you place, amounts, rates, and dates.</li>
				<li><strong>Communications</strong> — records of calls, WhatsApp messages, and emails exchanged with our team about your Orders.</li>
			</ul>
		),
	},
	{
		id: "use",
		title: "3. How we use your information",
		body: (
			<ul>
				<li>To verify your identity before accepting an Order, in line with our KYC obligations.</li>
				<li>To execute and settle the Orders you instruct us to place.</li>
				<li>To communicate with you about an Order, a rate, or an account issue.</li>
				<li>To detect, investigate, and prevent fraud, money laundering, and other unlawful activity.</li>
				<li>To meet our legal and regulatory obligations under Nigerian law.</li>
			</ul>
		),
	},
	{
		id: "basis",
		title: "4. Legal basis for processing",
		body: (
			<p>
				We process your information because it is necessary to perform the
				service you ask us for, to comply with a legal obligation (such as
				AML/KYC record-keeping), or because you have given us your consent —
				for example, by sending identity documents so we can verify you.
			</p>
		),
	},
	{
		id: "sharing",
		title: "5. How we share your information",
		body: (
			<>
				<p>We do not sell your personal information. We share it only:</p>
				<ul>
					<li>With Quidax, our digital asset infrastructure partner, to the extent necessary to execute and settle an Order.</li>
					<li>With banks and payment partners, to the extent necessary to settle Naira to or from your account.</li>
					<li>With regulators, law enforcement, or courts, where required by law or a valid legal process.</li>
					<li>With professional advisers (such as auditors or lawyers), under confidentiality obligations, where necessary to run our business.</li>
				</ul>
			</>
		),
	},
	{
		id: "retention",
		title: "6. Data retention",
		body: (
			<p>
				We retain identity and transaction records for as long as required
				by applicable AML/KYC record-keeping obligations, and for as long as
				necessary to resolve any dispute relating to an Order. Once these
				periods lapse, we delete or anonymize the information.
			</p>
		),
	},
	{
		id: "security",
		title: "7. How we protect your information",
		body: (
			<p>
				Access to Client information is restricted to Authorized Personnel
				who need it to execute your Orders. Our systems use encrypted,
				token-based authentication, and wallet infrastructure is operated
				through Quidax rather than custody we build ourselves. No method of
				storage or transmission is completely secure, but we take reasonable
				steps to protect your information against unauthorized access.
			</p>
		),
	},
	{
		id: "rights",
		title: "8. Your rights",
		body: (
			<p>
				Under the Nigeria Data Protection Act, you have the right to ask us
				what information we hold about you, to request that we correct
				inaccurate information, and to request deletion of information we no
				longer have a legal basis to keep. To exercise any of these rights,
				contact us using the details below.
			</p>
		),
	},
	{
		id: "website",
		title: "9. This website",
		body: (
			<p>
				This website is informational — it does not host a public
				sign-up form, and it does not use analytics or advertising cookies.
				Following a link to call, email, or message us is the only action
				this website takes with your information, and that exchange is
				governed by this Policy from the point you contact us.
			</p>
		),
	},
	{
		id: "children",
		title: "10. Children's privacy",
		body: (
			<p>
				Our services are not directed at anyone under 18, and we do not
				knowingly collect information from minors.
			</p>
		),
	},
	{
		id: "changes",
		title: "11. Changes to this policy",
		body: (
			<p>
				We may update this Privacy Policy from time to time to reflect
				changes in our practices or applicable law. The updated Policy takes
				effect once published on this page.
			</p>
		),
	},
	{
		id: "contact",
		title: "12. Contact us",
		body: (
			<>
				<p>
					Questions about this Policy, or requests relating to your
					information, can be sent to:
				</p>
				<ul>
					<li>Phone: <a href="tel:07077737387" className="text-metallic-gold hover:underline">0707 773 7387</a></li>
					<li>Email: <a href="mailto:Corbitglobal1@gmail.com" className="text-metallic-gold hover:underline">Corbitglobal1@gmail.com</a></li>
					<li>Office: Block 1A, Tatiana Court, Ikota Villa Estate, Lekki, Lagos</li>
				</ul>
			</>
		),
	},
];

export default function PrivacyPage() {
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
						Privacy Policy
					</h1>
					<p className="text-sm text-gray-500 mb-10">
						Last updated: 18 July 2026
					</p>

					<div className="card mb-10">
						<p className="text-gray-400 text-sm leading-relaxed">
							Corbit Global is a staff-assisted digital asset trading desk.
							This Policy explains what information we collect when you
							contact us or place an Order, and how we look after it.
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
						<Link to="/terms" className="hover:text-gray-300">Terms</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
