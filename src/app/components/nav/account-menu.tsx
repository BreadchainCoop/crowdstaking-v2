"use client";
import { truncateAddress } from "@/app/core/util/formatter";
import { Body } from "@breadcoop/ui";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useAccount, useEnsName } from "wagmi";
import NavAccountDetails from "./account-details";

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

	return (
		<NavigationMenu.Root className="relative">
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className="group">
						<Body
							bold
							className={
								"w-full flex items-center justify-center gap-2.5 truncate text-ellipsis py-3 px-6 bg-paper-2 border border-surface-ink font-bold"
							}
						>
							{ensNameResult.data ||
								truncateAddress(account.address || "")}
							{/* <span className="text-[#EA5817] transition-transform duration-200 group-data-[state=open]:rotate-180"> */}
							<span className="text-[#EA5817]">
								<Caret />
							</span>
						</Body>
					</NavigationMenu.Trigger>
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
