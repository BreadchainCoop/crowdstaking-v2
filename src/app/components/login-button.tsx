import { useDisconnect } from "wagmi";
import { TConnectedUserState } from "../core/hooks/useConnectedUser";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import { LiftedButton } from "@breadcoop/ui";
import { ReactNode } from "react";
import Image from "next/image";
import { SignIn } from "@phosphor-icons/react";
import { ButtonShell } from "../bakery/components/Swap/button-shell";

export const LoginButton = ({
	user,
	label,
}: {
	user: TConnectedUserState;
	label?: string;
}) => {
	const { openChainModal } = useChainModal();

	if (user.status === "CONNECTED") return null;

	if (user.status === "LOADING") return <ButtonShell />;

	if (user.status === "UNSUPPORTED_CHAIN") {
		return (
			<div className="[&>*]:w-full">
				<LiftedButton
					onClick={() => openChainModal?.()}
					className="w-full"
				>
					Change network
				</LiftedButton>
			</div>
		);
	}

	return <CustomLoginButton label={label} />;
};

function CustomLoginButton({ label = "Sign In" }: { label?: string }) {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				// Note: If your app doesn't use authentication, you
				// can remove all 'authenticationStatus' checks
				const ready = mounted && authenticationStatus !== "loading";

				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus ||
						authenticationStatus === "authenticated");

				if (connected) return null;

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
						className="[&>*]:w-full"
					>
						<LiftedButton
							onClick={openConnectModal}
							rightIcon={<SignIn />}
							className="w-full"
						>
							{label}
						</LiftedButton>
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}
