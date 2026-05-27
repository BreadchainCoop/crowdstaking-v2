"use client";
import { truncateAddress, formatBalance } from "@/app/core/util/formatter";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useAccount, useEnsName } from "wagmi";
import NavAccountDetails from "./account-details";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useFundWallet } from "@privy-io/react-auth";
import { blo } from "blo";

const NavAccountMenu = () => {
	const account = useAccount();
	const ensNameResult = useEnsName({
		address: account.address,
		query: { enabled: Boolean(account.address) },
	});
	const { BREAD } = useTokenBalances();
	const { fundWallet } = useFundWallet();

	const rawBalance =
		BREAD?.status === "SUCCESS" && BREAD.value
			? formatBalance(parseFloat(BREAD.value), 2)
			: "0.00";
	const [balInt, balDec] = rawBalance.split(".");

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
					{/* Outer chip — bg Surface/Main, Ink border */}
					<div className="flex items-center gap-[10px] bg-[#f6f3eb] border border-[#1b201a] overflow-hidden px-6 py-3">
						{/* Balance chip */}
						<div className="flex items-center bg-[#f6f3eb] border border-[#808080] overflow-hidden px-2 py-1">
							<p className="font-breadBody font-bold text-[#1b201a] whitespace-nowrap leading-none">
								<span className="text-base">${balInt}</span>
								<span className="text-[12px]">.{balDec}</span>
							</p>
						</div>

						{/* Deposit button */}
						<div className="drop-shadow-[2px_2px_0px_#595959]">
							<button
								onPointerDown={(e) => e.stopPropagation()}
								onClick={handleDeposit}
								className="flex items-center bg-[#f6f3eb] border border-[#ea5817] overflow-hidden px-4 py-1 font-breadBody font-bold text-base text-[#ea5817] whitespace-nowrap hover:bg-[#ea5817] hover:text-white transition-colors"
							>
								Deposit
							</button>
						</div>

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
							{/* Caret */}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="shrink-0 text-[#ea5817]"
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
