"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Address, formatEther } from "viem";
import { gnosis } from "viem/chains";
import { useBalance } from "wagmi";
import { useFundWallet, useWallets } from "@privy-io/react-auth";
import { Body, Heading2 } from "@breadcoop/ui";
import {
	ArrowLeftIcon,
	ArrowsLeftRightIcon,
	CreditCardIcon,
	WalletIcon,
} from "@phosphor-icons/react";

import { useModal } from "@/app/core/context/ModalContext";
import { FundButton } from "./FundButton";
import { FundFromWallet } from "./FundFromWallet";

// The LiFi widget behind Bridge is large; load it only when the user
// actually opens the "Bridge crypto" view, not eagerly with FundWallet
// itself (which is reachable from the homepage hero's CTA, unauthenticated
// or not, so eagerly bundling it would bloat every visitor's initial load).
const Bridge = dynamic(
	() =>
		import("@/app/bakery/components/Swap/Bridge").then((mod) => mod.Bridge),
	{ ssr: false }
);

type View = "options" | "wallet" | "bridge";

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
	const { setModal } = useModal();

	const embedded = wallets.find((w) => w.walletClientType === "privy");
	const embeddedAddress = embedded?.address as Address | undefined;

	const { data: balance } = useBalance({
		address: embeddedAddress,
		chainId: gnosis.id,
		query: { enabled: Boolean(embeddedAddress) },
	});

	// The auto-bake watcher runs for the whole session from FundOnSignIn
	// (mounted globally), not here -- so xDAI landing from an on-ramp or
	// bridge still auto-bakes even after this modal is closed.

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

	if (view === "wallet") {
		return (
			<FundFromWallet
				receiver={embeddedAddress}
				onBack={() => setView("options")}
				onDone={() => setModal(null)}
			/>
		);
	}

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
					icon={<WalletIcon size={28} />}
					title="Fund from your wallet"
					subtitle="Send xDAI or BREAD from a browser wallet"
					onClick={() => setView("wallet")}
				/>
				<FundButton
					icon={<CreditCardIcon size={28} />}
					title="Buy or transfer"
					subtitle="Card, exchange, or bank transfer"
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
