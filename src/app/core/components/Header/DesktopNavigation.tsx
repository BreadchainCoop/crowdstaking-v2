import { useConnectedUser } from "../../hooks/useConnectedUser";
import { LoginButton } from "@/app/components/login-button";
import NavAccountMenu from "@/app/components/nav/account-menu";
import PageMenuLink from "./page-menu-link";

function DesktopNavigation({ currentPath }: { currentPath: string }) {
	const { user } = useConnectedUser();
	return (
		<div className="hidden md:flex md:flex-grow md:items-center md:gap-8 md:ml-auto md:max-w-max">
			<nav
				aria-label="site navigation"
				className="flex items-center justify-start gap-4"
			>
				<PageMenuLink isCurrentPage={currentPath === "/"} href="/">
					Bake
				</PageMenuLink>
				{user.features.governancePage === true && (
					<PageMenuLink
						isCurrentPage={currentPath.includes("/governance")}
						href="/governance"
					>
						Governance
					</PageMenuLink>
				)}
				{/* <LiftedButton className="h-14 mt-0.5" rightIcon={<SignIn />}>Sign in</LiftedButton> */}
				{/* <DesktopNavigationLink
        href="https://dune.com/bread_cooperative/solidarity"
        isExternal
      >
        Analytics <span className="ml-2"></span>
        <LinkIcon />
      </DesktopNavigationLink>
      <DesktopNavigationLink href="https://docs.bread.coop" isExternal>
        Docs <span className="ml-2"></span><LinkIcon />
      </DesktopNavigationLink> */}
			</nav>
			{user.status === "CONNECTED" ? (
				<NavAccountMenu />
			) : (
				<LoginButton user={user} />
			)}
		</div>
	);
}

export default DesktopNavigation;
