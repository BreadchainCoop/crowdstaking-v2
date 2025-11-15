"use client";

import { useEffect, useRef } from "react";
import NavAccountDetails from "./account-details";
import { CaretDownIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useAccount, useEnsName } from "wagmi";
import { truncateAddress } from "@/app/core/util/formatter";

const NavMobileAccountMenu = () => {
	const account = useAccount();
	const ensNameResult = useEnsName({
		address: account.address,
		query: { enabled: Boolean(account.address) },
	});

	const pathname = usePathname();
	const containerRef = useRef<HTMLDivElement>(null);
	const iconRef = useRef<HTMLSpanElement>(null);
	const accountDivRef = useRef<HTMLDivElement>(null);

	const toggle = (close = false) => {
		if (close) {
			accountDivRef.current?.classList.add("h-0");
			iconRef.current?.classList.add("rotate-180");

			return;
		}

		accountDivRef.current?.classList.toggle("h-0");
		iconRef.current?.classList.toggle("rotate-180");
	};

	useEffect(() => {
		toggle(true);
	}, [pathname]);

	return (
		<div ref={containerRef} className="mt-6">
			<button
				onClick={() => toggle()}
				className="w-full flex items-center justify-center gap-4 truncate text-ellipsis py-3 px-6 bg-paper-2 border border-surface-ink font-bold"
			>
				{ensNameResult.data || truncateAddress(account.address || "")}
				<span
					ref={iconRef}
					className="text-[#EA5817] transition-transform"
				>
					<CaretDownIcon />
				</span>
			</button>
			<div ref={accountDivRef} className="h-0 overflow-hidden">
				<NavAccountDetails
					className="max-w-none border border-surface-ink mt-2"
					account={account}
					ensNameResult={ensNameResult}
				/>
			</div>
		</div>
	);
};

export default NavMobileAccountMenu;
