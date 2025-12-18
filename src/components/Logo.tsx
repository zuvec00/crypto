import logoImage from "../assets/logo.png";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
	const sizeClasses = {
		sm: "h-8",
		md: "h-10",
		lg: "h-12",
	};

	return (
		<div className="bg-white p-1 rounded-[12px]">
			<img
				src={logoImage}
				alt="Logo"
				className={`${sizeClasses[size]} ${className}`}
			/>
		</div>
	);
}
