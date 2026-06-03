"use client";
import { truncateAddress, formatBalance } from "@/app/core/util/formatter";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useAccount, useEnsName } from "wagmi";
import NavAccountDetails from "./account-details";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { PrivyDepositButton } from "./privy-deposit-button";
import { blo } from "blo";

// Baked in at build time — stable, no hydration mismatch
const PRIVY_ENABLED = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

const NavAccountMenu = () => {
	const account = useAccount();
	const ensNameResult = useEnsName({
		address: account.address,
		query: { enabled: Boolean(account.address) },
	});
	const { BREAD } = useTokenBalances();

	const rawBalance =
		BREAD?.status === "SUCCESS" && BREAD.value
			? formatBalance(parseFloat(BREAD.value), 2)
			: "0.00";
	const [balInt, balDec] = rawBalance.split(".");

	const avatarSrc = account.address
		? blo(account.address as `0x${string}`)
		: null;

	return (
		<NavigationMenu.Root className="relative">
			<NavigationMenu.List>
				<NavigationMenu.Item>
					{/* Outer chip — Surface/Main bg, Ink border, 8px padding */}
					<div className="flex items-center gap-[10px] bg-[#f6f3eb] border border-[#1b201a] overflow-hidden p-2">
						{/* Balance chip */}
						<div className="flex items-center bg-[#f6f3eb] border border-[#808080] overflow-hidden px-2 py-1">
							<p className="font-breadBody font-bold text-[#1b201a] whitespace-nowrap leading-none">
								<span className="text-base">${balInt}</span>
								<span className="text-[12px]">.{balDec}</span>
							</p>
						</div>

						{/* Deposit — only rendered when NEXT_PUBLIC_PRIVY_APP_ID is set */}
						{PRIVY_ENABLED && account.address ? (
							<PrivyDepositButton address={account.address} />
						) : (
							<button
								disabled
								aria-disabled="true"
								className="flex shrink-0 items-center bg-[#f6f3eb] border border-[#ea5817] px-4 py-1 font-breadBody font-bold text-base leading-[1.5] text-[#ea5817] whitespace-nowrap opacity-40 cursor-not-allowed"
							>
								Deposit
							</button>
						)}

						{/* Divider */}
						<div className="h-7 w-px bg-[#d9d9d9] shrink-0" />

						{/* Account trigger — opens dropdown */}
						<NavigationMenu.Trigger className="group flex items-center gap-[10px]">
							{avatarSrc && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={avatarSrc}
									alt=""
									className="shrink-0 size-6 rounded-full"
								/>
							)}
							<span className="font-breadBody font-bold text-base text-[#1b201a] whitespace-nowrap leading-none">
								{ensNameResult.data ||
									truncateAddress(account.address || "")}
							</span>
							{/* CaretDown */}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="shrink-0"
							>
								<path
									d="M19.5 9L12 16.5L4.5 9"
									stroke="#ea5817"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
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
