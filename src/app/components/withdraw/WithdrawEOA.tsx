"use client";

import { useState } from "react";
import clsx from "clsx";
import { Body, Heading2, LiftedButton } from "@breadcoop/ui";
import { ArrowUpRightIcon, InfoIcon, WarningIcon } from "@phosphor-icons/react";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { CURVE_SWAP_URL } from "@/constants";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import Burn from "@/app/bakery/components/Swap/Burn";

type Receive = "WXDAI" | "xDAI";

function ReceiveOption({
	active,
	onClick,
	label,
	hint,
	badge,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
	hint: string;
	badge?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				"flex flex-col items-start gap-0.5 border px-4 py-3 text-left transition-colors",
				active
					? "border-primary-orange bg-[#EA60231a]"
					: "border-paper-2 bg-paper-0 hover:border-primary-orange"
			)}
		>
			<span className="flex items-center gap-2">
				<Body bold className="text-surface-ink">
					{label}
				</Body>
				{badge && (
					<Body
						bold
						className="bg-[#32A80014] px-2 py-0.5 text-xs text-system-green"
					>
						{badge}
					</Body>
				)}
			</span>
			<Body className="text-surface-grey text-sm">{hint}</Body>
		</button>
	);
}

/**
 * Withdraw flow for an EOA: pick what to receive — WXDAI (swap on Curve, the
 * recommended path that keeps the pool liquid) or xDAI (burn the deposit back
 * 1:1) — and the amount to withdraw. Everything is shown in dollars. Rendered
 * inside the Withdraw module's GENERIC_MODAL.
 */
export function WithdrawEOA({
	user,
	isSafe,
}: {
	user: TUserConnected;
	isSafe: boolean;
}) {
	const { BREAD } = useTokenBalances();
	const [receive, setReceive] = useState<Receive>("WXDAI");
	const [value, setValue] = useState("");

	const balanceStr = BREAD?.status === "SUCCESS" ? BREAD.value : "0";
	const balance = parseFloat(balanceStr) || 0;
	const amount = parseFloat(value) || 0;
	const insufficient = amount > balance;

	return (
		<div className="flex flex-col gap-5">
			<div>
				<Heading2 className="text-2xl">Withdraw</Heading2>
				<Body className="text-surface-grey mt-1">
					Choose what to receive and how much to withdraw.
				</Body>
			</div>

			<div className="flex flex-col gap-2">
				<Body className="text-surface-grey text-sm">Receive as</Body>
				<div className="grid grid-cols-2 gap-2">
					<ReceiveOption
						active={receive === "WXDAI"}
						onClick={() => setReceive("WXDAI")}
						label="WXDAI"
						hint="Swap on Curve"
						badge="Recommended"
					/>
					<ReceiveOption
						active={receive === "xDAI"}
						onClick={() => setReceive("xDAI")}
						label="xDAI"
						hint="Remove from fund"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1 border border-paper-2 bg-paper-0 px-5 py-3">
				<div className="flex items-center justify-between">
					<Body className="text-surface-grey">Amount</Body>
					<button
						type="button"
						onClick={() => setValue(balanceStr)}
						className="text-primary-orange text-sm font-bold transition-colors hover:text-[#c44f1c]"
					>
						Max
					</button>
				</div>
				<div className="flex items-center gap-1">
					<span className="text-2xl font-bold text-surface-ink">$</span>
					<input
						value={value}
						onChange={(e) =>
							setValue(sanitizeInputValue(e.target.value))
						}
						inputMode="decimal"
						placeholder="0.00"
						className="w-full bg-transparent text-2xl font-bold text-surface-ink outline-none placeholder:text-surface-grey"
					/>
				</div>
				<Body className="text-surface-grey text-sm">
					Balance: ${balance.toFixed(2)}
				</Body>
			</div>

			{insufficient && (
				<div className="flex items-start gap-3 border-l-2 border-system-warning bg-[#FFEDD0] px-4 py-3">
					<WarningIcon
						size={24}
						weight="fill"
						className="shrink-0 text-system-warning"
					/>
					<Body className="text-surface-ink text-sm">
						You can&apos;t withdraw more than your balance.
					</Body>
				</div>
			)}

			{receive === "WXDAI" ? (
				<div className="flex flex-col gap-2">
					<ExternalLink
						href={CURVE_SWAP_URL}
						className="w-full !text-current"
					>
						<div className="lifted-button-container">
							<LiftedButton rightIcon={<ArrowUpRightIcon />}>
								Exchange for WXDAI on Curve
							</LiftedButton>
						</div>
					</ExternalLink>
					<div className="flex items-start gap-2 bg-paper-1 p-3">
						<InfoIcon
							size={20}
							weight="fill"
							className="mt-0.5 shrink-0 text-primary-orange"
						/>
						<Body className="text-surface-grey-2 text-xs">
							Opens Curve to swap at the best rate — enter the
							amount there. This keeps the pool liquid.
						</Body>
					</div>
				</div>
			) : (
				<Burn
					user={user}
					inputValue={value}
					clearInputValue={() => setValue("")}
					isSafe={isSafe}
					showSwap={false}
					label="Withdraw in xDAI"
				/>
			)}
		</div>
	);
}
