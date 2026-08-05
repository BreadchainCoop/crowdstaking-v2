import { useSwitchChain } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { TConnectedUserState } from "../core/hooks/useConnectedUser";
import { LiftedButton } from "@breadcoop/ui";
import { SignIn } from "@phosphor-icons/react";
import { ButtonShell } from "../bakery/components/Swap/button-shell";

export const LoginButton = ({
	user,
	label,
}: {
	user: TConnectedUserState;
	label?: string;
}) => {
	const { switchChain } = useSwitchChain();

	if (user.status === "CONNECTED") return null;

	if (user.status === "LOADING") return <ButtonShell />;

	if (user.status === "UNSUPPORTED_CHAIN") {
		return (
			<div className="[&>*]:w-full">
				<LiftedButton
					onClick={() =>
						user.config.ID && switchChain({ chainId: user.config.ID })
					}
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
	const { ready, authenticated, login } = usePrivy();

	if (ready && authenticated) return null;

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
				onClick={() => login()}
				rightIcon={<SignIn />}
				className="w-full"
			>
				{label}
			</LiftedButton>
		</div>
	);
}
