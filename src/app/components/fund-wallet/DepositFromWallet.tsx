"use client";

import { useState } from "react";
import { Body, Heading2 } from "@breadcoop/ui";
import { InfoIcon, WarningIcon } from "@phosphor-icons/react";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import Bake from "@/app/bakery/components/Swap/Bake";

/**
 * Deposit view for an EOA (external wallet). EOAs already hold funds and have
 * no embedded wallet to top up, so instead of the "fund your account" flow they
 * deposit an amount directly — a BREAD mint from their own wallet. Amounts are
 * abstracted to USD (BREAD/xDAI are 1:1 with $), and the action reads
 * "Support fund". When the balance can't cover the amount, we hand off to the
 * funding options (Bridge/Buy) via `onGetFunds`.
 */
export function DepositFromWallet({ onGetFunds }: { onGetFunds: () => void }) {
	const { user, isSafe } = useConnectedUser();
	const { xDAI } = useTokenBalances();
	const [value, setValue] = useState("");

	if (user.status !== "CONNECTED") return null;

	const balanceStr = xDAI?.status === "SUCCESS" ? xDAI.value : "0";
	const balance = parseFloat(balanceStr) || 0;
	const amount = parseFloat(value) || 0;
	const insufficient = amount > balance;

	return (
		<div className="flex flex-col gap-5">
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
					Your deposit backs the fund and is held 1:1 with USD. You can
					withdraw it at any time from your account.
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
							onClick={onGetFunds}
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
		</div>
	);
}
