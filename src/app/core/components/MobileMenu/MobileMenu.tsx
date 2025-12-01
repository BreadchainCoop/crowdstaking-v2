import clsx from "clsx";
import CloseIcon from "@/app/core/components/Icons/CloseIcon";
import Overlay from "@/app/core/components/Overlay";
import MobileWalletDisplay from "./MobileWalletDisplay";
import { MobileNavigation } from "./MobileNavigation";
import Link from "next/link";
import { Logo } from "@breadcoop/ui";
import NavSolidarityApps from "@/app/components/nav/nav-solidarity-apps";
import NavAccountMenu from "@/app/components/nav/account-menu";
import NavMobileAccountMenu from "@/app/components/nav/mobile-account-menu";
import { useAccount } from "wagmi";
import { useConnectedUser } from "../../hooks/useConnectedUser";
import { LoginButton } from "@/app/components/login-button";

interface IProps {
	isOpen: boolean;
	handleNavToggle: () => void;
}

export function MobileMenu({ isOpen, handleNavToggle }: IProps) {
	const { user } = useConnectedUser();
	return (
		<>
			<Overlay closeMenu={() => handleNavToggle()} isOpen={isOpen} />

			<section
				className={clsx(
					// "fixed overflow-y-scroll items-end right-0 top-0 z-50 flex h-screen w-auto transform flex-col gap-4 px-4 pl-12 pt-4 pb-16 transition-transform md:hidden",
					"fixed overflow-y-scroll top-0 left-0 z-50 h-screen w-screen py-2.5 px-6 transition-transform md:hidden",
					isOpen ? "translate-x-0" : "translate-x-full"
				)}
			>
				<div className="flex items-center justify-between mb-6">
					<Link href="/">
						<Logo text="Solidarity Fund" />
					</Link>
					<button
						onClick={() => handleNavToggle()}
						className="z-[60] h-8 w-8 text-[#EA5817] ml-auto block md:hidden"
					>
						<CloseIcon />
					</button>
				</div>
				<MobileNavigation handleNavToggle={handleNavToggle} />
				<NavSolidarityApps showTitle showSelected rearranged current="fund" className="mt-6" />
				{user.status === "CONNECTED" ? (
					<NavMobileAccountMenu />
				) : (
					<div className="mt-6">
						<LoginButton user={user} />
					</div>
				)}
				{/* <MobileWalletDisplay handleNavToggle={handleNavToggle} /> */}
			</section>
		</>
	);
}
export default MobileMenu;
