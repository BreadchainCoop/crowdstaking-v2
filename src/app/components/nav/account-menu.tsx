"use client";
import { truncateAddress, formatBalance, renderFormattedDecimalNumber } from "@/app/core/util/formatter";
import { Body } from "@breadcoop/ui";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useAccount, useEnsName } from "wagmi";
import NavAccountDetails from "./account-details";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useFundWallet } from "@privy-io/react-auth";
import { blo } from "blo";
import Image from "next/image";

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
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const NavAccountMenu = () => {
	const account = useAccount();
	const ensNameResult = useEnsName({
		address: account.address,
		query: { enabled: Boolean(account.address) },
	});
	const { BREAD } = useTokenBalances();
	const { fundWallet } = useFundWallet();

	const breadBalance =
		BREAD?.status === "SUCCESS" && BREAD.value
			? renderFormattedDecimalNumber(formatBalance(parseFloat(BREAD.value), 2))
			: "0.00";

	const handleDeposit = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (account.address) {
			fundWallet({ address: account.address });
		}
	};

	const avatarSrc = account.address
		? blo(account.address as `0x${string}`)
		: null;

	return (
		<NavigationMenu.Root className="relative">
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<div className="flex items-center bg-paper-2 border border-surface-ink">
						{/* Balance + Deposit — outside trigger so clicks don't open dropdown */}
						<div className="flex items-center gap-2.5 pl-6 pr-3 py-3">
							<span className="border border-[#808080] px-2 py-1 font-bold text-sm whitespace-nowrap">
								${breadBalance}
							</span>
							<button
								onPointerDown={(e) => e.stopPropagation()}
								onClick={handleDeposit}
								className="border border-[#EA5817] px-4 py-1 text-[#EA5817] font-bold text-sm whitespace-nowrap drop-shadow-[2px_2px_0px_#595959] hover:bg-[#EA5817] hover:text-white transition-colors"
							>
								Deposit
							</button>
						</div>

						{/* Divider */}
						<div className="h-7 w-px bg-[#d9d9d9] shrink-0" />

						{/* Account trigger — opens dropdown */}
						<NavigationMenu.Trigger className="group flex items-center gap-2 px-3 py-3">
							{avatarSrc && (
								<Image
									src={avatarSrc}
									alt=""
									width={24}
									height={24}
									className="rounded-full shrink-0"
								/>
							)}
							<Body bold className="whitespace-nowrap">
								{ensNameResult.data ||
									truncateAddress(account.address || "")}
							</Body>
							<span className="text-[#EA5817] shrink-0">
								<Caret />
							</span>
						</NavigationMenu.Trigger>
					</div>

					<NavigationMenu.Content className="w-max">
						<NavAccountDetails
							className="w-screen max-w-[27.6875rem] bg-paper-main border border-paper-2"
							account={account}
							ensNameResult={ensNameResult}
						/>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
			<NavigationMenu.Viewport className="absolute top-14 right-0 z-10" />
		</NavigationMenu.Root>
	);
};

export default NavAccountMenu;
