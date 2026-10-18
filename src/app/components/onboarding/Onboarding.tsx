"use client";

import { useState } from "react";
import clsx from "clsx";
import { Body, Heading2, LiftedButton } from "@breadcoop/ui";
import {
	ChartLineUpIcon,
	HandHeartIcon,
	UsersThreeIcon,
} from "@phosphor-icons/react";

import { useModal } from "@/app/core/context/ModalContext";

const STEPS = [
	{
		icon: HandHeartIcon,
		title: "Deposit & support",
		body: "You deposit crypto to back the Solidarity Fund — and you can always retrieve it. Your deposit is held 1:1 with the US dollar and is withdrawable any time.",
	},
	{
		icon: ChartLineUpIcon,
		title: "Get voting power",
		body: "The longer you keep your deposit in, the more voting points you build up. These give you the power to influence which projects get funded in the governance tab.",
	},
	{
		icon: UsersThreeIcon,
		title: "Choose who gets funded",
		body: "Each month, vote on who should receive the pot of interest generated that month. The community decides together where the money goes.",
	},
] as const;

/**
 * First-visit onboarding card: a 3-step intro to depositing, earning voting
 * power, and voting on where the monthly interest goes. Rendered as the
 * children of a GENERIC_MODAL (so it gets the shared backdrop + container),
 * triggered once per first-ever session by OnboardingOnFirstVisit. Skippable
 * at any step; closing it is handled by setting the modal to null.
 */
export function Onboarding() {
	const { setModal } = useModal();
	const [step, setStep] = useState(0);

	const current = STEPS[step];
	const Icon = current.icon;
	const isLast = step === STEPS.length - 1;

	const close = () => setModal(null);

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<Body className="text-surface-grey text-sm font-bold">
					Step {step + 1} of {STEPS.length}
				</Body>
				<button
					type="button"
					onClick={close}
					className="text-surface-grey text-sm font-bold transition-colors hover:text-surface-ink"
				>
					Skip
				</button>
			</div>

			<div className="flex flex-col items-center gap-4 text-center">
				<span className="flex size-16 shrink-0 items-center justify-center bg-[#EA60231a] text-primary-orange">
					<Icon size={34} weight="regular" />
				</span>
				<Heading2 className="text-2xl text-surface-ink">
					{current.title}
				</Heading2>
				<Body className="text-surface-grey max-w-sm">
					{current.body}
				</Body>
			</div>

			<div className="flex items-center justify-center gap-2">
				{STEPS.map((s, i) => (
					<span
						key={s.title}
						className={clsx(
							"h-2 transition-all duration-300",
							i === step
								? "w-6 bg-primary-orange"
								: "w-2 bg-paper-2"
						)}
					/>
				))}
			</div>

			<div className="flex flex-col gap-2">
				<div className="lifted-button-container">
					<LiftedButton
						onClick={() =>
							isLast ? close() : setStep((s) => s + 1)
						}
					>
						{isLast ? "Get started" : "Next"}
					</LiftedButton>
				</div>
				{step > 0 && (
					<button
						type="button"
						onClick={() => setStep((s) => s - 1)}
						className="self-center text-primary-orange text-sm font-bold transition-colors hover:text-[#c44f1c]"
					>
						Back
					</button>
				)}
			</div>
		</div>
	);
}
