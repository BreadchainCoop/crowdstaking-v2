"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserVotingPowerProvider } from "./context/UserVotingPowerContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { Body } from "@breadcoop/ui";

const pages = [
	{
		label: "Vote",
		href: "/governance",
		Icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6.25 8.125H13.75"
					stroke="currentcolor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6.25 10.625H13.75"
					stroke="currentcolor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2.5 16.25V4.375C2.5 4.20924 2.56585 4.05027 2.68306 3.93306C2.80027 3.81585 2.95924 3.75 3.125 3.75H16.875C17.0408 3.75 17.1997 3.81585 17.3169 3.93306C17.4342 4.05027 17.5 4.20924 17.5 4.375V16.25L15 15L12.5 16.25L10 15L7.5 16.25L5 15L2.5 16.25Z"
					stroke="currentcolor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		label: "LP Vaults",
		href: "/governance/lp-vaults",
		Icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.625 3.75H14.375C15.3696 3.75 16.3234 4.14509 17.0267 4.84835C17.7299 5.55161 18.125 6.50544 18.125 7.5V15C18.125 15.1658 18.0592 15.3247 17.9419 15.4419C17.8247 15.5592 17.6658 15.625 17.5 15.625H2.5C2.33424 15.625 2.17527 15.5592 2.05806 15.4419C1.94085 15.3247 1.875 15.1658 1.875 15V7.5C1.875 6.50544 2.27009 5.55161 2.97335 4.84835C3.67661 4.14509 4.63044 3.75 5.625 3.75Z"
					stroke="currentcolor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M1.875 8.75H8.75"
					stroke="currentcolor"
					strokeWidth="0.625"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11.25 8.75H18.125"
					stroke="currentcolor"
					strokeWidth="0.625"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11.25 7.5H8.75V11.25H11.25V7.5Z"
					stroke="currentcolor"
					strokeWidth="0.625"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5.625 3.75V15.625"
					stroke="currentcolor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M14.375 3.75V15.625"
					stroke="currentcolor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
];

function GovernanceNavigation() {
	return (
		<div className="">
			<nav className="bg-paper-0 p-2.5 flex items-center justify-start w-full max-w-[16rem]">
				{pages.map((p) => (
					<NavLink key={p.href} {...p} />
				))}
			</nav>
		</div>
	);
}

function NavLink({
	Icon,
	href,
	label,
}: {
	Icon: JSX.Element;
	href: string;
	label: string;
}) {
	const currentPath = usePathname();

	return (
		<Link
			href={href}
			className={clsx(
				"flex items-center justify-center gap-2.5 transition-all border py-1 px-4",
				currentPath === href
					? "text-[#EA5817]"
					: "border-transparent text-surface-grey"
			)}
		>
			<div className="w-5 h-5">{Icon}</div>
			<span
				className={`font-bold ${
					currentPath === href
						? "text-surface-ink"
						: "text-surface-grey"
				}`}
			>
				{label}
			</span>
		</Link>
	);
}

export default function GovernanceLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { user } = useConnectedUser();

	return (
		<>
			{user.features.lpVaults && (
				<section className="hidden md:block w-full lg:max-w-[67rem] m-auto px-4 md:px-8">
					<GovernanceNavigation />
				</section>
			)}
			<UserVotingPowerProvider>
				<div className="py-4 md:py-8">{children}</div>
			</UserVotingPowerProvider>
		</>
	);
}
