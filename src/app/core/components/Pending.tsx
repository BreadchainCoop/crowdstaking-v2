// Marks the spot where text is still loading. The sample text is rendered
// invisibly, so the slot takes exactly the space the real text will, and a soft
// shimmer sits on top of it. The sample should be about as wide as the real value.
export function Pending({
	sample,
	className = "",
}: {
	sample: string;
	className?: string;
}) {
	return (
		<span
			className={`relative inline-block align-baseline tabular-nums ${className}`}
			role="status"
			aria-label="Loading"
		>
			<span className="invisible" aria-hidden="true">
				{sample}
			</span>
			<span className="pending-shimmer absolute inset-x-0 inset-y-[0.12em]" />
		</span>
	);
}
