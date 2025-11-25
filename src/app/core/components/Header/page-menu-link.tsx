"use client";

import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

interface PageMenuLinkProps {
	children: ReactNode;
	href: string;
	onClick?: () => void;
	isCurrentPage?: boolean;
	isExternal?: boolean;
}

const PageMenuLink = ({
	href,
	children,
	isCurrentPage,
	isExternal,
	onClick,
}: PageMenuLinkProps) => {
	const classList = clsx(
		"text-base font-normal hover:text-primary-orange md:px-1",
		isCurrentPage
			? `${
					href === "/"
						? "text-[#EA5817] md:text-text-standard"
						: "text-[#EA5817]"
			  }`
			: "text-text-standard"
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
};

export default PageMenuLink;
