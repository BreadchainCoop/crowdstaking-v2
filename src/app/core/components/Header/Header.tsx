"use client";
import clsx from "clsx";
import { type ReactNode, useState } from "react";

import MobileMenu from "../MobileMenu/MobileMenu";
import DesktopNavigation from "./DesktopNavigation";
import Logo from "./Logo";
import MobileNavigationToggle from "./MobileNavigationToggle";
import { WRAPPER_CLASSES } from "@/app/core/util/classes";
import { usePathname } from "next/navigation";
import { AccountMenu } from "./AccountMenu";
import { ColorToggle } from "./ColorToggle";
import { Body } from "@breadcoop/ui";
import { Logo as UILogo } from "@breadcoop/ui";
import Link from "next/link";
import NavSolidarityApps from "@/app/components/nav/nav-solidarity-apps";

function Container({ children }: { children: ReactNode }) {
	return (
		<header>
			<div
				className={clsx(
					WRAPPER_CLASSES,
					"p-4 md:py-6 flex justify-between items-center mb-4"
				)}
			>
				{children}
			</div>
		</header>
	);
}

const Caret = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M19.5 9L12 16.5L4.5 9"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

function Header() {
	const currentPath = usePathname();
	const [isMobNavOpen, setIsMobNavOpen] = useState(false);

	const handleNavToggle = () => {
		document.body.style.overflow = isMobNavOpen ? "auto" : "hidden";
		setIsMobNavOpen(!isMobNavOpen);
	};

	return (
		<Container>
			<Link href="/">
				<UILogo size={24} className="md:hidden" />
				<span className="hidden md:block lg:text-2xl">
					<UILogo text="BREAD" size={24} />
				</span>
			</Link>
			<div className="hidden md:block md:mr-auto md:ml-2 group relative">
				<button
					aria-haspopup="true"
					aria-expanded={false}
					className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 opacity-0"
				>
					Open BREAD menu
				</button>
				<Body className="md:text-surface-grey-2 md:inline-flex md:items-center md:justify-center md:gap-2 lg:text-2xl lg:mt-1">
					<span>Solidarity Fund</span>
					<span className="text-[#EA5817] transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180 md:mt-[-0.0625rem] lg:-mt-1">
						<Caret />
					</span>
				</Body>
				<div className="absolute left-0 top-full mt-2 w-80 opacity-0 invisible -translate-y-4 pointer-events-none transition-all duration-300 ease-out z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto lg:left-auto lg:right-0">
					{/* Invisible hover bridge (eliminates gap) */}
					<div className="h-4 -mt-4" aria-hidden="true" />

					<div className="bg-paper-main border border-paper-2 overflow-hidden">
						{/* Focusable container so focus-within works */}
						<div tabIndex={-1}>
							<NavSolidarityApps
								current="fund"
								// className="py-6 px-8 bg-white"
								className="py-6 px-8"
							/>
						</div>
					</div>
				</div>
			</div>
			<DesktopNavigation currentPath={currentPath} />
			<MobileNavigationToggle
				isOpen={isMobNavOpen}
				handleClick={handleNavToggle}
			/>
			<MobileMenu
				isOpen={isMobNavOpen}
				handleNavToggle={handleNavToggle}
			/>
		</Container>
	);

	// return (
	// 	<>
	// 		<Container>
	// 			<Logo />
	// 			<div className="md:hidden font-pressstart uppercase text-xs">
	// 				bread
	// 			</div>
	// 			<DesktopNavigation currentPath={currentPath} />
	// 			<div className="hidden md:flex gap-4">
	// 				<ColorToggle />
	// 				<AccountMenu size="regular" fullWidth={false}>
	// 					Connect
	// 				</AccountMenu>
	// 			</div>
	// 			<MobileNavigationToggle
	// 				isOpen={isMobNavOpen}
	// 				handleClick={handleNavToggle}
	// 			/>
	// 			<MobileMenu
	// 				isOpen={isMobNavOpen}
	// 				handleNavToggle={handleNavToggle}
	// 			/>
	// 		</Container>
	// 	</>
	// );
}

export default Header;
