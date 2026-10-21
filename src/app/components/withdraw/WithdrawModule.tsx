"use client";

import { useState } from "react";
import { Address } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { Body, Heading2 } from "@breadcoop/ui";
import {
	ArrowLeftIcon,
	CoinsIcon,
	InfoIcon,
	PaperPlaneTiltIcon,
	WarningIcon,
} from "@phosphor-icons/react";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import Burn from "@/app/bakery/components/Swap/Burn";
import { FundButton } from "@/app/components/fund-wallet/FundButton";
import { WithdrawEOA } from "./WithdrawEOA";
import { WithdrawToExternalWallet } from "./WithdrawToExternalWallet";

const RecommendedBadge = () => (
	<Body bold className="bg-[#32A80014] px-2 py-0.5 text-xs text-system-green">
		Recommended
	</Body>
);

/**
 * Withdraw module, adapting to the wallet type (both abstracted to dollars):
 *  - EOA: pick WXDAI (swap on Curve, recommended) or xDAI (burn), with an
 *    amount — see WithdrawEOA.
 *  - Embedded (Privy): send the deposit out to an external wallet
 *    (recommended, no external wallet to connect to Curve) or withdraw in xDAI
 *    (burn).
 * Rendered as the children of a GENERIC_MODAL, so it inherits the shared
 * sheet/card chrome.
 */
export function WithdrawModule() {
	const { user, isSafe } = useConnectedUser();
	const { BREAD } = useTokenBalances();
	const { wallets } = useWallets();
	const [step, setStep] = useState<"choose" | "burn" | "send">("choose");
	const [value, setValue] = useState("");

	if (user.status !== "CONNECTED") return null;

	// Embedded (Privy) wallets have no external wallet to connect to Curve, so
	// their primary route out is sending the deposit to a wallet they control.
	const activeAddress = user.address.toLowerCase();
	const embedded = wallets.find((w) => w.walletClientType === "privy");
	const embeddedAddress = embedded?.address as Address | undefined;
	const isEmbedded = Boolean(
		embeddedAddress && embeddedAddress.toLowerCase() === activeAddress
	);

	// EOA: a single screen with the xDAI/WXDAI choice and an amount.
	if (!isEmbedded) {
		return <WithdrawEOA user={user} isSafe={isSafe} />;
	}

	const balanceStr = BREAD?.status === "SUCCESS" ? BREAD.value : "0";
	const balance = parseFloat(balanceStr) || 0;
	const amount = parseFloat(value) || 0;
	const insufficient = amount > balance;

	// Embedded, step 1 — pick a withdrawal method.
	if (step === "choose") {
		return (
			<div className="flex flex-col gap-5">
				<div>
					<Heading2 className="text-2xl">Withdraw</Heading2>
					<Body className="text-surface-grey mt-1">
						Choose how you&apos;d like to withdraw your deposit.
					</Body>
				</div>

				<div className="flex flex-col gap-3">
					<FundButton
						icon={<PaperPlaneTiltIcon size={28} />}
						title="Send to an external wallet"
						subtitle="Move your deposit out to a wallet you control"
						badge={<RecommendedBadge />}
						onClick={() => setStep("send")}
					/>
					<FundButton
						icon={<CoinsIcon size={28} />}
						title="Withdraw in xDAI"
						subtitle="Remove your deposit from the fund (1:1 with USD)"
						onClick={() => setStep("burn")}
					/>
				</div>

				<div className="flex items-start gap-2 bg-paper-1 p-3">
					<InfoIcon
						size={20}
						weight="fill"
						className="mt-0.5 shrink-0 text-primary-orange"
					/>
					<Body className="text-surface-grey-2 text-xs">
						Sending to your own external wallet keeps your full
						balance. Withdrawing in xDAI removes your deposit from the
						fund and returns it 1:1 with USD.
					</Body>
				</div>
			</div>
		);
	}

	// Embedded, step 2a — send the deposit out to an external wallet.
	if (step === "send") {
		return (
			<WithdrawToExternalWallet
				user={user}
				onBack={() => setStep("choose")}
			/>
		);
	}

	// Embedded, step 2b — withdraw in xDAI (burn), shown in dollars.
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
				<Heading2 className="text-2xl">Withdraw in xDAI</Heading2>
				<Body className="text-surface-grey mt-1">
					Remove your deposit from the fund — you&apos;ll receive xDAI
					1:1 with USD.
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
						placeholder="0.00"
						aria-label="Amount in USD"
						className="w-full bg-transparent text-2xl font-bold text-surface-ink outline-none placeholder:text-surface-grey"
					/>
				</div>
				<Body className="text-surface-grey text-sm">
					Balance: ${balance.toFixed(2)}
				</Body>
			</div>

			{insufficient ? (
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
