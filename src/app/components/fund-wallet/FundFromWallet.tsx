"use client";
import { useState } from "react";
import { Address, formatEther } from "viem";
import { gnosis } from "viem/chains";
import { useBalance } from "wagmi";
import { Body, LiftedButton } from "@breadcoop/ui";
import { ArrowLeftIcon } from "@phosphor-icons/react";

import { BREAD_ADDRESS } from "@/constants";
import {
	FundAsset,
	useFundFromConnectedWallet,
} from "./useFundFromConnectedWallet";

/**
 * "Fund from your wallet" — send xDAI or BREAD from a browser-injected wallet
 * to the embedded wallet. xDAI auto-bakes into BREAD; BREAD is transferred
 * directly. Mirrors app-stacks' FundWithConnectedWallet amount flow.
 */
export function FundFromWallet({
	receiver,
	onBack,
	onDone,
}: {
	receiver?: Address;
	onBack: () => void;
	onDone: () => void;
}) {
	const [asset, setAsset] = useState<FundAsset>("xdai");
	const [amount, setAmount] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { externalAccount, fund } = useFundFromConnectedWallet(receiver);

	const { data: bal } = useBalance({
		address: externalAccount,
		chainId: gnosis.id,
		token: asset === "bread" ? (BREAD_ADDRESS as Address) : undefined,
		query: { enabled: Boolean(externalAccount) },
	});
	const max = bal ? Number(formatEther(bal.value)) : 0;

	const disabled =
		busy ||
		!externalAccount ||
		!amount ||
		Number(amount) <= 0 ||
		Number(amount) > max;

	const submit = async () => {
		setError(null);
		setBusy(true);
		try {
			await fund(asset, amount);
			onDone();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Funding failed");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-2 self-start text-[#ea5817]"
			>
				<ArrowLeftIcon size={20} />
				<Body bold>Back</Body>
			</button>

			{/* asset toggle */}
			<div className="flex gap-2">
				{(["xdai", "bread"] as FundAsset[]).map((a) => (
					<button
						key={a}
						type="button"
						onClick={() => setAsset(a)}
						className={`flex-1 border px-3 py-2 font-breadBody font-bold transition-colors ${
							asset === a
								? "border-[#ea5817] text-[#ea5817]"
								: "border-[#eae2d6] text-surface-grey"
						}`}
					>
						{a === "xdai" ? "xDAI" : "BREAD"}
					</button>
				))}
			</div>

			{/* amount */}
			<div>
				<div className="flex items-center gap-2 border border-[#eae2d6] bg-paper-0 px-4 py-3">
					<input
						value={amount}
						onChange={(e) =>
							setAmount(e.target.value.replace(/[^0-9.]/g, ""))
						}
						inputMode="decimal"
						placeholder="0"
						className="w-full bg-transparent font-breadDisplay text-xl outline-none"
					/>
					<button
						type="button"
						onClick={() => setAmount(String(max))}
						disabled={!externalAccount}
						className="shrink-0 font-bold text-sm text-[#ea5817] disabled:text-surface-grey"
					>
						Max
					</button>
				</div>
				{externalAccount ? (
					<Body className="mt-1 text-right text-sm text-surface-grey">
						Balance: {max.toFixed(4)}{" "}
						{asset === "xdai" ? "xDAI" : "BREAD"}
					</Body>
				) : (
					<Body className="mt-1 text-sm text-surface-grey">
						Connect a browser wallet (e.g. MetaMask) on Gnosis to fund
						from it.
					</Body>
				)}
			</div>

			{error && <Body className="text-sm text-system-red">{error}</Body>}

			<div className="lifted-button-container">
				<LiftedButton onClick={submit} disabled={disabled}>
					{busy
						? "Funding…"
						: asset === "xdai"
							? "Fund & bake"
							: "Send BREAD"}
				</LiftedButton>
			</div>
		</div>
	);
}
