import { TConnectedUserState } from "../core/hooks/useConnectedUser";
import { LoginButton as LibLoginButton } from "@breadcoop/ui";
import { SignInIcon } from "@phosphor-icons/react";

export const LoginButton = ({
	user,
	label,
}: {
	user: TConnectedUserState;
	label?: string;
}) => {
	return (
		<LibLoginButton
			app="fund"
			status={user.status}
			label={label}
			rightIcon={<SignInIcon />}
		/>
	);
};
