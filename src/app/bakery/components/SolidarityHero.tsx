"use client";

import { formatUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { Body, Heading1, LiftedButton } from "@breadcoop/ui";

import SwapWrapper from "@/app/components/SwapWrapper";
import AnimatedNumber from "@/app/components/animated-number";
import { useModal } from "@/app/core/context/ModalContext";
import { FALLBACK_APY_VALUE, useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { formatSupply } from "@/app/core/util/formatter";
import { projectsMeta } from "@/app/projectsMeta";

// Same project metadata + logos the governance page uses, active first.
const ACTIVE_PROJECTS = Object.values(projectsMeta)
	.filter((p) => p.active)
	.sort((a, b) => a.order - b.order);
const HERO_PROJECTS = ACTIVE_PROJECTS.slice(0, 5);
const MORE_PROJECTS = ACTIVE_PROJECTS.length - HERO_PROJECTS.length;

// Decorative, diverse member illustrations standing in for the community of
// backers. The real headcount is the number; these just make it a picture.
const MEMBER_AVATARS = [
	"/avatars/member-1.svg",
	"/avatars/member-2.svg",
	"/avatars/member-3.svg",
	"/avatars/member-4.svg",
	"/avatars/member-5.svg",
	"/avatars/member-6.svg",
] as const;

const FALLBACK_BREAD_BACKERS = 209;
const FALLBACK_TOTAL_FUNDING = 46548;

const apyFormatter = (v: number) => v.toFixed(1);

export function SolidarityHero() {
	const { setModal } = useModal();

	const { data: apyData = FALLBACK_APY_VALUE } = useVaultAPY();
	const apy = Number(formatUnits(apyData, 18)) * 100;

	const { data: backers = FALLBACK_BREAD_BACKERS } = useQuery({
		queryKey: ["bread-backers"],
		queryFn: async () => {
			const res = (await (await fetch("/api/bread-backers")).json()) as {
				_col0: number;
			};
			return res._col0;
		},
	});

	const { data: funding = FALLBACK_TOTAL_FUNDING } = useQuery({
		queryKey: ["total-bread-distributed"],
		queryFn: async () => {
			const res = (await (
				await fetch("/api/total-bread-distributed")
			).json()) as { _col0: number };
			return res._col0;
		},
	});

	const projectCount = ACTIVE_PROJECTS.length;

	const handleSupport = () => {
		setModal({
			type: "GENERIC_MODAL",
			showCloseButton: false,
			includeContainerStyling: false,
			children: <SwapWrapper />,
		});
	};

	return (
		<section className="grid items-center gap-10 py-8 md:grid-cols-2 md:gap-x-6 lg:gap-x-[6rem] md:py-14">
			{/* ── Left: slogan + CTAs ── */}
			<div>
				<Heading1 className="text-[2.5rem] text-primary-orange mb-4 md:flex md:flex-col md:leading-[0.9] md:text-[3.5rem] lg:text-[4.5rem]">
					<span>THE</span> <span>SOLIDARITY</span> <span>FUND</span>
				</Heading1>
				<Body className="font-breadDisplay text-surface-grey-2 text-lg mb-8 md:max-w-[24rem]">
					Give without giving. Your savings stay yours — only the
					interest funds the work.
				</Body>
				<div className="flex flex-wrap items-center gap-4">
					<div className="lifted-button-container">
						<LiftedButton onClick={handleSupport}>
							Support fund
						</LiftedButton>
					</div>
					<a
						href="https://docs.bread.coop/about/bread-token/"
						target="_blank"
						rel="noopener noreferrer"
						className="lifted-button-container"
					>
						<LiftedButton preset="secondary">
							How it works →
						</LiftedButton>
					</a>
				</div>
			</div>

			{/* ── Right: the data, as pictures ── */}
			<div className="flex flex-col gap-8">
				{/* Backers — avatar cluster */}
				<div>
					<div className="flex items-center">
						<div className="flex">
							{MEMBER_AVATARS.map((src) => (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									key={src}
									src={src}
									alt=""
									className="size-10 rounded-full border-2 border-paper-main -ml-3 first:ml-0 shadow-sm"
								/>
							))}
						</div>
						<span className="ml-3 flex items-center font-breadDisplay font-black text-2xl text-surface-ink">
							+
							<AnimatedNumber
								value={backers}
								formatter={(v) => v.toFixed(0)}
							/>
						</span>
					</div>
					<Body className="mt-2 text-surface-grey">
						neighbours bake &amp; back the fund together
					</Body>
				</div>

				{/* Projects — real logos from the governance page */}
				<div>
					<div className="flex gap-2">
						{HERO_PROJECTS.map((project) => (
							<div
								key={project.name}
								title={project.name}
								className="flex size-12 items-center justify-center overflow-hidden border border-[#eae2d6] bg-white"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={`/${project.logoSrc}`}
									alt={`${project.name} logo`}
									className="size-full object-contain p-1.5"
								/>
							</div>
						))}
						{MORE_PROJECTS > 0 && (
							<div className="flex size-12 items-center justify-center border border-dashed border-surface-grey text-surface-grey font-breadDisplay font-bold">
								+{MORE_PROJECTS}
							</div>
						)}
					</div>
					<Body className="mt-2 text-surface-grey">
						{projectCount} projects, chosen by the community
					</Body>
				</div>

				{/* APY ring + subtle funding accent */}
				<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
					<div className="flex items-center gap-3">
						<ApyRing apy={apy} />
						<div className="leading-tight">
							<p className="font-breadDisplay font-black text-2xl text-surface-ink">
								<AnimatedNumber
									value={apy}
									formatter={apyFormatter}
								/>
								%
							</p>
							<Body className="text-surface-grey text-sm">
								earning APY
							</Body>
						</div>
					</div>

					<div className="leading-tight">
						<p className="font-breadDisplay font-black text-2xl text-surface-ink">
							<AnimatedNumber
								value={funding}
								formatter={formatSupply}
							/>{" "}
							<span className="text-primary-orange">$BREAD</span>
						</p>
						<Body className="text-surface-grey text-sm">
							given to the work, so far
						</Body>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Small decorative donut ring with the APY arc. */
function ApyRing({ apy }: { apy: number }) {
	const r = 26;
	const c = 2 * Math.PI * r;
	// Cap the visual arc at ~15% so the ring reads nicely at typical rates.
	const pct = Math.max(0.06, Math.min(apy / 15, 1));
	return (
		<svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
			<circle
				cx="32"
				cy="32"
				r={r}
				fill="none"
				stroke="#F4DFC9"
				strokeWidth="6"
			/>
			<circle
				cx="32"
				cy="32"
				r={r}
				fill="none"
				stroke="#EA5817"
				strokeWidth="6"
				strokeLinecap="round"
				strokeDasharray={c}
				strokeDashoffset={c * (1 - pct)}
				transform="rotate(-90 32 32)"
			/>
		</svg>
	);
}
