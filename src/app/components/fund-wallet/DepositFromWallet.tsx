"use client";

import { useState } from "react";
import { Body, Heading2 } from "@breadcoop/ui";
import {
	ArrowLeftIcon,
	ArrowsLeftRightIcon,
	CoinsIcon,
	CreditCardIcon,
	InfoIcon,
	WarningIcon,
} from "@phosphor-icons/react";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import Bake from "@/app/bakery/components/Swap/Bake";
import { FundButton } from "./FundButton";

/**
 * Deposit view for an EOA (external wallet). EOAs already hold funds and have
 * no embedded wallet to top up, so instead of the "fund your account" flow they
 * deposit an amount directly — a mint from their own wallet. Everything is
 * abstracted to USD (the deposit is really xDAI, 1:1 with $), and the action
 * reads "Support fund".
 *
 * Flow:
 *  1. Choose a method — crypto or cash.
 *     - Crypto: if the wallet already holds xDAI, go straight to the deposit
 *       view; otherwise hand off to the bridge (`onBridge`) to get xDAI first.
 *     - Cash: hand off to the on-ramp (`onBuyCash`) to buy xDAI with a card or
 *       bank transfer, then come back to deposit.
 *  2. Deposit view — enter a dollar amount and support the fund. When the
 *     balance can't cover it, we fall back to the funding options via
 *     `onBridge`.
 */
export function DepositFromWallet({
	onBridge,
	onBuyCash,
}: {
	onBridge: () => void;
	onBuyCash: () => void;
}) {
	const { user, isSafe } = useConnectedUser();
	const { xDAI } = useTokenBalances();
	const [step, setStep] = useState<"choose" | "deposit">("choose");
	const [value, setValue] = useState("");

	if (user.status !== "CONNECTED") return null;

	const balanceStr = xDAI?.status === "SUCCESS" ? xDAI.value : "0";
	const balance = parseFloat(balanceStr) || 0;
	const amount = parseFloat(value) || 0;
	const insufficient = amount > balance;
	const hasXdai = balance > 0;

	// Step 1 — how would you like to deposit?
	if (step === "choose") {
		return (
			<div className="flex flex-col gap-5">
				<div>
					<Heading2 className="text-2xl">Support the fund</Heading2>
					<Body className="text-surface-grey mt-1">
						Choose how you&apos;d like to deposit into the Solidarity
						Fund.
					</Body>
				</div>

				<div className="flex flex-col gap-3">
					<FundButton
						icon={<CoinsIcon size={28} />}
						title="Deposit with crypto"
						subtitle={
							hasXdai
								? "Use the crypto already in your wallet"
								: "Bridge crypto from another chain to get started"
						}
						onClick={() =>
							hasXdai ? setStep("deposit") : onBridge()
						}
					/>
					<FundButton
						icon={<CreditCardIcon size={28} />}
						title="Deposit with cash"
						subtitle="Buy with a card or bank transfer — coming soon"
						onClick={onBuyCash}
						disabled
					/>
				</div>

				<div className="flex items-start gap-2 bg-paper-1 p-3">
					<InfoIcon
						size={20}
						weight="fill"
						className="mt-0.5 shrink-0 text-primary-orange"
					/>
					<Body className="text-surface-grey-2 text-xs">
						Deposits are held in <strong>xDAI</strong> on Gnosis —
						worth $1 each (1:1 with USD). Your balance and deposit are
						shown in dollars.
					</Body>
				</div>
			</div>
		);
	}

	// Step 2 — deposit the xDAI already in the wallet, shown in dollars.
	return (
		<div className="flex flex-col gap-5">
			<button
				type="button"
				onClick={() => setStep("choose")}
				className="flex items-center gap-2 self-start text-[#ea5817]"
			>
				<ArrowLeftIcon size={20} />
				<Body bold>Back</Body>
			</button>

			<div>
				<Heading2 className="text-2xl">Support the fund</Heading2>
				<Body className="text-surface-grey mt-1">
					Deposit from your wallet to back the Solidarity Fund.
				</Body>
			</div>

			<div className="flex items-start gap-2 bg-paper-1 p-3">
				<InfoIcon
					size={20}
					weight="fill"
					className="mt-0.5 shrink-0 text-primary-orange"
				/>
				<Body className="text-surface-grey-2 text-xs">
					You&apos;re depositing <strong>xDAI</strong> from your wallet
					— worth $1 each (1:1 with USD). It backs the fund and you can
					withdraw it any time from your account.
				</Body>
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
						aria-label="Amount in USD"
						placeholder="0.00"
						className="w-full bg-transparent text-2xl font-bold text-surface-ink outline-none placeholder:text-surface-grey"
					/>
				</div>
				<Body className="text-surface-grey text-sm">
					Balance: ${balance.toFixed(2)}
				</Body>
			</div>

			{insufficient ? (
				<div className="flex flex-col gap-3">
					<div className="flex items-start gap-3 border-l-2 border-system-warning bg-[#FFEDD0] px-4 py-3">
						<WarningIcon
							size={24}
							weight="fill"
							className="shrink-0 text-system-warning"
						/>
						<Body className="text-surface-ink text-sm">
							You don&apos;t have enough funds. Add some to
							continue.
						</Body>
					</div>
					<div className="lifted-button-container">
						<button
							type="button"
							onClick={onBridge}
							className="w-full"
						>
							<span className="flex w-full items-center justify-center bg-primary-orange px-4 py-2.5 font-bold text-white">
								Get funds
							</span>
						</button>
					</div>
				</div>
			) : (
				<Bake
					user={user}
					inputValue={value}
					clearInputValue={() => setValue("")}
					isSafe={isSafe}
					label="Support fund"
				/>
			)}

			{/* Bridging stays available even with a balance, for pulling tokens
			    in from another chain. */}
			<button
				type="button"
				onClick={onBridge}
				className="flex items-center justify-between gap-3 border border-primary-orange bg-[#EA60231a] px-5 py-3 text-left transition-colors hover:bg-[#EA60232a]"
			>
				<span>
					<Body bold className="text-surface-ink">
						Don&apos;t have xDAI?
					</Body>
					<Body className="text-surface-grey text-sm">
						Deposit from another network or chain
					</Body>
				</span>
				<ArrowsLeftRightIcon
					size={24}
					className="shrink-0 text-primary-orange"
				/>
			</button>
		</div>
	);
}
