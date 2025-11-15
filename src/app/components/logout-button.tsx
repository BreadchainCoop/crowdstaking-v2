import { LiftedButton } from "@breadcoop/ui";
import { SignOutIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import React from "react";
import { useDisconnect } from "wagmi";

const LogoutButton = ({ className }: { className?: string }) => {
	const { disconnect } = useDisconnect();

	return (
		<div className={clsx("lifted-button-container", className)}>
			<LiftedButton
				preset="burn"
				rightIcon={<SignOutIcon />}
				onClick={() => disconnect()}
			>
				Sign out
			</LiftedButton>
		</div>
	);
};

export default LogoutButton;
