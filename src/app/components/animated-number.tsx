"use client";

import { useState, useEffect, useRef } from "react";

// While data is loading we count up toward this share of the placeholder
// (a rough estimate), then finish on the real value once it arrives.
const LOADING_TARGET_SHARE = 0.9;
const LOADING_DURATION = 3000; // ms, a typical load time
// Give up waiting after this long and settle on `value` (e.g. a failed request).
const LOADING_TIMEOUT = 6000; // ms

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface AnimatedNumberOptions {
	duration?: number; // ms, for animating to the real value
	// While true the number climbs from 0 at a steady pace toward `placeholder`
	// instead of jumping to a stale or fallback value.
	loading?: boolean;
	placeholder?: number;
}

export function useAnimatedNumber(
	value: number,
	{ duration = 1500, loading = false, placeholder }: AnimatedNumberOptions = {}
) {
	const [displayValue, setDisplayValue] = useState(0);
	const [timedOut, setTimedOut] = useState(false);
	const startTimeRef = useRef<number | null>(null);
	const startValueRef = useRef<number>(0);
	const targetRef = useRef<number>(value);
	const frameRef = useRef<number | null>(null);

	useEffect(() => {
		if (!loading) return;
		const id = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT);
		return () => clearTimeout(id);
	}, [loading]);

	const isLoading = loading && !timedOut && placeholder !== undefined;
	const target = isLoading ? placeholder * LOADING_TARGET_SHARE : value;
	const animationDuration = isLoading ? LOADING_DURATION : duration;
	const easing = isLoading ? easeOutCubic : easeOutExpo;

	useEffect(() => {
		// Update refs when the target changes
		startValueRef.current = displayValue;
		targetRef.current = target;
		startTimeRef.current = null; // Reset animation start

		const animate = (timestamp: number) => {
			if (!startTimeRef.current) startTimeRef.current = timestamp;

			const elapsed = timestamp - startTimeRef.current!;
			const progress = Math.min(elapsed / animationDuration, 1);

			const currentValue =
				startValueRef.current +
				(targetRef.current - startValueRef.current) * easing(progress);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [target, animationDuration]);

	return displayValue;
}

interface AnimatedNumberProps extends AnimatedNumberOptions {
	value: number;
	formatter?: (value: number) => string | number;
	className?: string;
}

const AnimatedNumber = ({
	value,
	formatter = (val) => val,
	className = "",
	...options
}: AnimatedNumberProps) => {
	const displayValue = useAnimatedNumber(value, options);

	return <span className={className}>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;
