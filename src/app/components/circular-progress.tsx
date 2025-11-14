import clsx from "clsx";

const CircularProgress = ({ className }: { className?: string }) => {
	return (
		<div className={clsx("relative w-8 h-8", className)}>
			<svg
				className="w-full h-full transform -rotate-90"
				viewBox="0 0 120 120"
			>
				<circle
					cx="60"
					cy="60"
					r="50"
					fill="none"
					strokeWidth="20"
					className="stroke-surface-grey"
				/>
				<circle
					cx="60"
					cy="60"
					r="50"
					fill="none"
					stroke="#EA580C"
					strokeWidth="20"
					strokeDasharray="314"
					strokeDashoffset="235"
					strokeLinecap="round"
					className="origin-center animate-spin"
					style={{ animationDuration: "2s" }}
				/>
			</svg>
		</div>
	);
};

export default CircularProgress;
