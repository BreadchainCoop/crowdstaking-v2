"use client";

import { useState } from "react";
import { isAddress, parseEther } from "viem";
import { useSimulateContract, useWriteContract } from "wagmi";
import { Body, Heading2, LiftedButton } from "@breadcoop/ui";
import { ArrowLeftIcon, WarningIcon } from "@phosphor-icons/react";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { ERC20_ABI } from "@/abi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useToast } from "@/app/core/context/ToastContext/ToastContext";
import { useModal } from "@/app/core/context/ModalContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";

/**
 * Withdraw flow for an embedded (Privy) wallet: there's no external wallet to
 * connect to Curve, so instead the user moves their deposit out to an external
 * wallet they control. This sends the deposit (an ERC20 transfer, shown in
 * dollars) to a destination address. Burning to xDAI stays available as the
 * in-app fallback via the Withdraw module's other option.
 */
export function WithdrawToExternalWallet({
	user,
	onBack,
}: {
	user: TUserConnected;
	onBack: () => void;
}) {
	const { BREAD, ID: chainId } = useActiveChain();
	const { BREAD: breadBalance } = useTokenBalances();
	const { toastDispatch } = useToast();
	const { setModal } = useModal();

	const [to, setTo] = useState("");
	const [value, setValue] = useState("");

	const balanceStr =
		breadBalance?.status === "SUCCESS" ? breadBalance.value : "0";
	const balance = parseFloat(balanceStr) || 0;
	const amount = parseFloat(value) || 0;
	const validAddress = isAddress(to);
	const insufficient = amount > balance;
	const parsedValue = parseEther(value === "." ? "0" : value || "0");

	const { data: prepareConfig, status: prepareStatus } = useSimulateContract({
		address: BREAD.address,
		abi: ERC20_ABI,
		functionName: "transfer",
		args: [to as `0x${string}`, parsedValue],
		query: { enabled: validAddress && amount > 0 && !insufficient },
		chainId,
	});

	const { writeContractAsync, isPending } = useWriteContract();

	const canSend =
		prepareStatus === "success" && validAddress && amount > 0 && !insufficient;

	const handleSend = async () => {
		if (!writeContractAsync || !prepareConfig || isPending) return;
		try {
			await writeContractAsync(prepareConfig.request);
			toastDispatch({
				type: "CUSTOM",
				payload: {
					variant: "success",
					message: "Withdrawal sent to your external wallet.",
				},
			});
			setModal(null);
		} catch (error) {
			console.error("Withdraw transfer error__", error);
			toastDispatch({
				type: "CUSTOM",
				payload: {
					variant: "error",
					message: "Withdrawal failed or was rejected.",
				},
			});
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-2 self-start text-[#ea5817]"
			>
				<ArrowLeftIcon size={20} />
				<Body bold>Back</Body>
			</button>

			<div>
				<Heading2 className="text-2xl">
					Send to an external wallet
				</Heading2>
				<Body className="text-surface-grey mt-1">
					Move your deposit out to a wallet you control. It stays worth
					$1 each (1:1 with USD).
				</Body>
			</div>

			<div className="flex flex-col gap-1 border border-paper-2 bg-paper-0 px-5 py-3">
				<Body className="text-surface-grey">Destination address</Body>
				<input
					value={to}
					onChange={(e) => setTo(e.target.value.trim())}
					placeholder="0x..."
					spellCheck={false}
					className="w-full bg-transparent font-mono text-base text-surface-ink outline-none placeholder:text-surface-grey"
				/>
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

			{to.length > 0 && !validAddress && (
				<div className="flex items-start gap-3 border-l-2 border-system-warning bg-[#FFEDD0] px-4 py-3">
					<WarningIcon
						size={24}
						weight="fill"
						className="shrink-0 text-system-warning"
					/>
					<Body className="text-surface-ink text-sm">
						Enter a valid wallet address (starts with 0x).
					</Body>
				</div>
			)}

			<div className="relative lifted-button-container">
				<LiftedButton
					disabled={!canSend || isPending}
					onClick={handleSend}
				>
					{isPending ? "Sending…" : "Withdraw to wallet"}
				</LiftedButton>
			</div>
		</div>
	);
}
