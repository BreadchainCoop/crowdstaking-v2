import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";

import { useConnectedUser } from "../../hooks/useConnectedUser";

interface IProps {
  handleNavToggle: () => void;
}

export function MobileNavigation({ handleNavToggle }: IProps) {
	const pathname = usePathname();
	const user = useConnectedUser();
	return (
		<nav className="flex flex-col gap-2">
			<MobileNavigationLink
				isCurrentPage={pathname === "/"}
				href="/"
				onClick={() => handleNavToggle()}
			>
				Bake
			</MobileNavigationLink>
			<MobileNavigationLink
				isCurrentPage={false}
				href="/governance"
				onClick={() => handleNavToggle()}
			>
				Governance
			</MobileNavigationLink>
			{user.user.features.lpVaults && (
				<>
					<Link
						href="/governance"
						onClick={() => handleNavToggle()}
						className={`text-sm ${
							pathname === "/governance"
								? "text-[#EA5817]"
								: "text-surface-grey-2"
						}`}
					>
						Vote
					</Link>
					<Link
						href="/governance/lp-vaults"
						onClick={() => handleNavToggle()}
						className={`text-sm ${
							pathname === "/governance/lp-vaults"
								? "text-[#EA5817]"
								: "text-surface-grey-2"
						}`}
					>
						Vaults
					</Link>
				</>
			)}
		</nav>
	);
}
export function MobileNavigationLink(props: {
	children: ReactNode;
	href: string;
	onClick: () => void;
	isCurrentPage?: boolean;
	isExternal?: boolean;
}) {
	const { href, children, isCurrentPage, isExternal, onClick } = props;

	const classList = clsx(
		"text-base font-normal",
		isCurrentPage ? "text-[#EA5817]" : "text-text-standard"
	);

	if (isExternal) {
		return (
			<a
				href={href}
				className={classList}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClick}
			>
				{children}
			</a>
		);
	}

	return (
		<Link href={href} onClick={onClick} className={classList}>
			{children}
		</Link>
	);
}
