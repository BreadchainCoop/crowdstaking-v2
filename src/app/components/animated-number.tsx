"use client";

import { useState, useEffect, useRef } from "react";

// While data is loading the number climbs from 0 at one fixed speed: the
// placeholder (a deliberately conservative estimate, a little under the real
// value) divided by LOADING_DURATION. That is slower than a typical load, so the
// real value normally arrives while it is still climbing, and it then keeps the
// same pace until it gets there. It only pauses if loading outlasts
// LOADING_DURATION, and then just short of the real number.
const LOADING_TARGET_SHARE = 1;
const LOADING_DURATION = 10500; // ms
// Give up waiting after this long and head for `value` (e.g. a failed request).
const LOADING_TIMEOUT = 15000; // ms
// Ignore long gaps between frames (e.g. a background tab) so it can't jump.
const MAX_FRAME_MS = 100;

// Last shown value per `persistKey`, so a remount resumes instead of starting
// over from 0.
const lastShown = new Map<string, number>();

interface AnimatedNumberOptions {
	// While true the number climbs toward `placeholder` instead of jumping to a
	// stale or fallback value.
	loading?: boolean;
	placeholder?: number;
	persistKey?: string;
}

export function useAnimatedNumber(
	value: number,
	{ loading = false, placeholder, persistKey }: AnimatedNumberOptions = {}
) {
	const [displayValue, setDisplayValue] = useState(
		() => (persistKey && lastShown.get(persistKey)) || 0
	);
	const [timedOut, setTimedOut] = useState(false);
	const displayRef = useRef(displayValue);
	const frameRef = useRef<number | null>(null);

	useEffect(() => {
		if (!loading) return;
		const id = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT);
		return () => clearTimeout(id);
	}, [loading]);

	const isLoading = loading && !timedOut && placeholder !== undefined;
	const target = isLoading ? placeholder * LOADING_TARGET_SHARE : value;
	// One fixed speed (units per ms), set by the placeholder when there is one.
	const speed = ((placeholder ?? value) * LOADING_TARGET_SHARE) / LOADING_DURATION;

	const targetRef = useRef(target);
	const speedRef = useRef(speed);
	// Declared before the animation effect so the refs are current when it runs.
	useEffect(() => {
		targetRef.current = target;
		speedRef.current = speed;
	});

	useEffect(() => {
		let last: number | null = null;

		const tick = (timestamp: number) => {
			const dt = last === null ? 0 : Math.min(timestamp - last, MAX_FRAME_MS);
			last = timestamp;

			const current = displayRef.current;
			const goal = targetRef.current;
			const step = speedRef.current * dt;
			const next =
				speedRef.current > 0 && Math.abs(goal - current) > step
					? current + Math.sign(goal - current) * step
					: goal;

			if (next !== current) {
				displayRef.current = next;
				setDisplayValue(next);
				if (persistKey) lastShown.set(persistKey, next);
			}
			if (next !== goal) {
				frameRef.current = requestAnimationFrame(tick);
			}
		};

		frameRef.current = requestAnimationFrame(tick);
		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, [target, persistKey]);

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

	// Reserve room for the final number (an invisible copy of the widest value),
	// so the surrounding layout doesn't shift as the digits count up.
	if (options.placeholder === undefined) {
		return <span className={className}>{formatter(displayValue)}</span>;
	}
	const widest = Math.max(options.placeholder, value, displayValue);

	return (
		<span className={`inline-grid tabular-nums ${className}`}>
			<span className="invisible [grid-area:1/1]" aria-hidden="true">
				{formatter(widest)}
			</span>
			<span className="[grid-area:1/1]">{formatter(displayValue)}</span>
		</span>
	);
};

export default AnimatedNumber;
