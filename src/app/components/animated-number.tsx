"use client";

import React, { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
	value: number;
	duration?: number; // ms
	formatter?: (value: number) => string | number;
	className?: string;
}

const AnimatedNumber = ({
	value,
	duration = 1500,
	formatter = (val) => val,
	className = "",
}: AnimatedNumberProps) => {
	const [displayValue, setDisplayValue] = useState(0);
	const startTimeRef = useRef<number | null>(null);
	const startValueRef = useRef<number>(0);
	const targetRef = useRef<number>(value);
	const frameRef = useRef<number | null>(null);

	useEffect(() => {
		// Update refs when value changes
		startValueRef.current = displayValue;
		targetRef.current = value;
		startTimeRef.current = null; // Reset animation start

		const animate = (timestamp: number) => {
			if (!startTimeRef.current) startTimeRef.current = timestamp;

			const elapsed = timestamp - startTimeRef.current!;
			const progress = Math.min(elapsed / duration, 1);

			// EaseOutExpo for smooth finish
			const easeOutExpo = (t: number) =>
				t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

			const currentValue =
				startValueRef.current +
				(targetRef.current - startValueRef.current) *
					easeOutExpo(progress);

			setDisplayValue(currentValue);

			if (progress < 1) {
				frameRef.current = requestAnimationFrame(animate);
			} else {
				setDisplayValue(targetRef.current); // Snap to exact final value
			}
		};

		frameRef.current = requestAnimationFrame(animate);

		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, [value, duration]);

	return <span className={className}>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;
