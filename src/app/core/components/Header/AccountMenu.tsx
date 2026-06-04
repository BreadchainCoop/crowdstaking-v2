import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

import Button from "../Button";
import { TButtonSize } from "../Button/Button";
import { WalletMenu } from "./WalletMenu/WalletMenu";
import { truncateAddress } from "@/app/core/util/formatter";

/**
 * Connect / connected display. Sign-in is Privy (`login()`), which provisions
 * the embedded wallet that becomes the active wagmi account. "Disconnect" logs
 * the user out of Privy.
 */
export function AccountMenu({
	size = "regular",
	fullWidth = false,
	children,
}: {
	size?: TButtonSize;
	fullWidth?: boolean;
	children: ReactNode;
}) {
	const { address, isConnected } = useAccount();
	const { login, logout, ready, authenticated } = usePrivy();

	if (!isConnected || !address) {
		return (
			<div
				{...(!ready && {
					"aria-hidden": true,
					style: {
						opacity: 0,
						pointerEvents: "none",
						userSelect: "none",
					},
				})}
			>
				<Button size={size} fullWidth={fullWidth} onClick={() => login()}>
					{children}
				</Button>
			</div>
		);
	}

	return (
		<WalletMenu
			account={{ address, displayName: truncateAddress(address) }}
			chainString="unknown"
			handleDisconnect={() => {
				if (authenticated) logout();
			}}
		/>
	);
}
