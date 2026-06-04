"use client";
import { useState } from "react";
import { Address, formatEther } from "viem";
import { gnosis } from "viem/chains";
import { useBalance } from "wagmi";
import { useFundWallet, useWallets } from "@privy-io/react-auth";
import { Body, Heading2 } from "@breadcoop/ui";
import {
	ArrowLeftIcon,
	ArrowsLeftRightIcon,
	CreditCardIcon,
} from "@phosphor-icons/react";

import { useWatchFundedXdai } from "@/app/core/hooks/useWatchFundedXdai";
import { Bridge } from "@/app/bakery/components/Swap/Bridge";
import { FundButton } from "./FundButton";

type View = "options" | "bridge";

/**
 * Fund-your-account module. Funds the Privy embedded wallet with xDAI — which
 * `useWatchFundedXdai` then auto-bakes into BREAD. Funding options:
 *  - Buy / transfer via Privy's on-ramp (card, exchange, or wallet transfer)
 *  - Bridge crypto from any chain via LiFi (lands as xDAI on Gnosis)
 */
export function FundWallet() {
	const [view, setView] = useState<View>("options");
	const { fundWallet } = useFundWallet();
	const { wallets } = useWallets();

	const embedded = wallets.find((w) => w.walletClientType === "privy");
	const embeddedAddress = embedded?.address as Address | undefined;

	const { data: balance } = useBalance({
		address: embeddedAddress,
		chainId: gnosis.id,
		query: { enabled: Boolean(embeddedAddress) },
	});

	// Any xDAI that lands in the embedded wallet while this modal is open is
	// baked into BREAD automatically.
	useWatchFundedXdai(embeddedAddress, undefined);

	const xdai = balance ? Number(formatEther(balance.value)).toFixed(2) : "0.00";

	const handleOnRamp = () => {
		if (!embeddedAddress) return;
		fundWallet({
			address: embeddedAddress,
			options: {
				chain: gnosis,
				uiConfig: { receiveFundsTitle: "Receive xDAI" },
			},
		});
	};

	if (view === "bridge") {
		return (
			<div className="flex flex-col gap-4">
				<button
					type="button"
					onClick={() => setView("options")}
					className="flex items-center gap-2 self-start text-[#ea5817]"
				>
					<ArrowLeftIcon size={20} />
					<Body bold>Back</Body>
				</button>
				<Bridge />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5">
			<div>
				<Heading2 className="text-2xl">Fund your account</Heading2>
				<Body className="text-surface-grey mt-1">
					Send xDAI to your wallet and automatically get $BREAD.
				</Body>
			</div>

			<div className="flex items-center justify-between border border-[#eae2d6] bg-paper-0 px-5 py-3">
				<Body className="text-surface-grey">Wallet balance</Body>
				<Body bold className="text-surface-ink">
					${xdai} xDAI
				</Body>
			</div>

			<div className="flex flex-col gap-3">
				<FundButton
					icon={<CreditCardIcon size={28} />}
					title="Buy or transfer"
					subtitle="Card, exchange, or send from a wallet"
					onClick={handleOnRamp}
					disabled={!embeddedAddress}
				/>
				<FundButton
					icon={<ArrowsLeftRightIcon size={28} />}
					title="Bridge crypto"
					subtitle="Move funds from another chain via LiFi"
					onClick={() => setView("bridge")}
				/>
			</div>

			<Body className="text-surface-grey text-xs">
				The token your wallet needs is xDAI on Gnosis — it’s baked into
				$BREAD automatically once it arrives.
			</Body>
		</div>
	);
}
