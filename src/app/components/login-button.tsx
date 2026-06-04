import { usePrivy } from "@privy-io/react-auth";
import { useSwitchChain } from "wagmi";
import { gnosis } from "wagmi/chains";
import { LiftedButton } from "@breadcoop/ui";
import { SignIn } from "@phosphor-icons/react";

import { TConnectedUserState } from "../core/hooks/useConnectedUser";
import { ButtonShell } from "../bakery/components/Swap/button-shell";

/**
 * Sign-in is now Privy-only: `login()` authenticates the user and (via
 * `createOnLogin: "all-users"`) provisions their embedded wallet, which becomes
 * the active wagmi account.
 */
export const LoginButton = ({
	user,
	label = "Sign In",
}: {
	user: TConnectedUserState;
	label?: string;
}) => {
	const { login, ready } = usePrivy();
	const { switchChain } = useSwitchChain();

	if (user.status === "CONNECTED") return null;

	if (user.status === "LOADING") return <ButtonShell />;

	if (user.status === "UNSUPPORTED_CHAIN") {
		return (
			<div className="[&>*]:w-full">
				<LiftedButton
					onClick={() => switchChain({ chainId: gnosis.id })}
					className="w-full"
				>
					Change network
				</LiftedButton>
			</div>
		);
	}

	return (
		<div className="[&>*]:w-full">
			<LiftedButton
				onClick={() => ready && login()}
				rightIcon={<SignIn />}
				className="w-full"
			>
				{label}
			</LiftedButton>
		</div>
	);
};
