"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkeeModal } from "@markee_team/sdk/react";
import type { Address, MarkeeTheme } from "@markee_team/sdk";
import { Caption } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

// The public page Markee checks for the board marker ("Served on" + 1Hive
// campaign verification). It must be the deployed origin, without redirects.
const PUBLIC_SITE_URL = "https://fund.bread.coop";

// Bread Coop brand tokens (@breadcoop/ui theme.css), with square corners to
// match the rest of the app.
const theme: MarkeeTheme = {
	mode: "light",
	fontFamily: '"Bread Body", ui-sans-serif, system-ui, sans-serif',
	radius: 0,
	cardRadius: 0,
	controlRadius: 0,
	colors: {
		background: "#f6f3eb",
		surface: "#fdfcf9",
		text: "#1b201a",
		muted: "#595959",
		border: "#eae2d6",
		inputBackground: "#fdfcf9",
		inputText: "#1b201a",
		primary: "#ea6023",
		primaryText: "#ffffff",
		accent: "#ffc080",
		accentText: "#1b201a",
		accentSurface: "#fdfaf3",
		accentSurfaceText: "#d14a0f",
		accentBorder: "#ea6023",
		selected: "#ffc080",
		selectedText: "#1b201a",
		link: "#d14a0f",
		focusRing: "#ea6023",
	},
};

/**
 * Opens the Markee payment modal in-app so people can change the community
 * message without leaving the site. No wallet adapter is passed: the app's
 * Privy config is Gnosis-only and Markee boards live on Base, so the modal
 * discovers browser wallets itself (and offers Markee-hosted checkout on
 * eligible For Sale boards).
 */
export function MarkeeChangeMessage({ address }: { address: Address }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const siteUrl =
		typeof window !== "undefined" &&
		window.location.origin === PUBLIC_SITE_URL
			? PUBLIC_SITE_URL
			: undefined;

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="group flex shrink-0 items-center gap-1 text-primary-orange hover:underline"
			>
				<Caption className="font-bold">Change message</Caption>
				<ArrowUpRightIcon
					size={16}
					className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</button>
			<MarkeeModal
				open={open}
				onClose={() => setOpen(false)}
				placement={{ kind: "board", chainId: 8453, address }}
				siteUrl={siteUrl}
				theme={theme}
				onEvent={(event) => {
					// Only "confirmed" means Markee verified the payment.
					if (event.type === "confirmed") router.refresh();
				}}
			/>
		</>
	);
}
