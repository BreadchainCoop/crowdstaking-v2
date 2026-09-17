"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * The hero cross-fades automatically between these images. The container keeps
 * the aspect ratio of the LAST image (the group photo), per the design.
 *
 * TODO: these are temporary placeholders — replace `/hero/hero-{1,2,3}.png`
 * with the three real photos (workshop, outdoor gathering, group photo).
 */
const IMAGES = [
	{ src: "/hero/hero-1.png", alt: "" },
	{ src: "/hero/hero-2.png", alt: "" },
	{ src: "/hero/hero-3.png", alt: "" },
];

const FADE_INTERVAL_MS = 5000;

export function HeroImageCarousel({ className }: { className?: string }) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (IMAGES.length < 2) return;
		// Respect reduced-motion: hold on the first image, no auto-advance.
		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		const id = setInterval(
			() => setIndex((i) => (i + 1) % IMAGES.length),
			FADE_INTERVAL_MS
		);
		return () => clearInterval(id);
	}, []);

	return (
		<div
			className={clsx(
				"relative overflow-hidden bg-orange-0 aspect-[4/3]",
				className
			)}
		>
			{IMAGES.map((img, i) => (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					key={img.src}
					src={img.src}
					alt={img.alt}
					aria-hidden={i !== index}
					className={clsx(
						"absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
						i === index ? "opacity-100" : "opacity-0"
					)}
				/>
			))}
		</div>
	);
}
