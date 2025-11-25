"use client";

import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import {
	formatBalance,
	renderFormattedDecimalNumber,
	truncateAddress,
} from "@/app/core/util/formatter";
import { Body, Caption, LiftedButton, Logo } from "@breadcoop/ui";
import { ArrowUpRightIcon, CopyIcon, SignOutIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { formatUnits } from "viem";
import LogoutButton from "../logout-button";
import { Config, UseAccountReturnType, UseEnsNameReturnType } from "wagmi";
import { GetEnsNameReturnType } from "@wagmi/core";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { GNOSIS_LINK } from "@/constants";

const Item = ({
	Icon,
	label,
	children,
}: {
	Icon: () => JSX.Element;
	label: string;
	children: ReactNode;
}) => {
	return (
		<li className={clsx("flex items-center justify-start gap-2")}>
			<Icon />
			<Body className="mr-auto ml-2">{label}</Body>
			<div className="flex items-center justify-center gap-2">
				{children}
			</div>
		</li>
	);
};

interface NavAccountDetailsProps {
	account: UseAccountReturnType<Config>;
	ensNameResult: UseEnsNameReturnType<GetEnsNameReturnType>;
	className?: string;
}

const NavAccountDetails = ({
	className,
	account,
	ensNameResult,
}: NavAccountDetailsProps) => {
	const { BREAD } = useTokenBalances();
	const { data: apyData } = useVaultAPY();

	return (
		<section
			className={clsx(
				"bg-paper-2 p-5 flex flex-col gap-4 w-full max-w-[28rem]",
				className
			)}
		>
			<Item
				Icon={PersonSvg}
				label={
					ensNameResult.data || truncateAddress(account.address || "")
				}
			>
				<button
					className="text-surface-grey"
					disabled={!ensNameResult.data || !account.address}
					onClick={() =>
						copyToClipboard(
							ensNameResult.data || account.address || ""
						)
					}
				>
					<CopyIcon size={24} />
				</button>
				<Link
					href={GNOSIS_LINK + (account.address || "")}
					className="text-surface-grey"
				>
					<ArrowUpRightIcon size={24} />
				</Link>
			</Item>
			<Item Icon={WalletSvg} label="Bread Balance">
				<>
					<Logo size={24} />
					<Body>
						{BREAD &&
							BREAD.status === "SUCCESS" &&
							BREAD.value &&
							renderFormattedDecimalNumber(
								formatBalance(parseFloat(BREAD.value), 2)
							)}
					</Body>
				</>
			</Item>
			<Item Icon={HandHeartSvg} label="Donation">
				<>
					<Logo size={24} />
					{BREAD && BREAD.status === "SUCCESS" && BREAD.value && (
						<>
							<Caption className="text-[#EA5817]">
								{renderFormattedDecimalNumber(
									formatBalance(
										parseFloat(BREAD.value) *
											Number(
												formatUnits(
													apyData as bigint,
													18
												)
											),
										2
									)
								)}
							</Caption>
							<Caption className="text-sm text-surface-ink">
								/Yearly
							</Caption>
						</>
					)}
				</>
			</Item>
			<Item Icon={GraphSvg} label="Network">
				<div className="flex items-center justify-center">
					<Image
						src="/gnosis_icon.svg"
						alt=""
						width={24}
						height={24}
						className="mr-2"
					/>
					<Body className="font-bold">Gnosis chain</Body>
				</div>
			</Item>
			<LogoutButton className="mt-1" />
		</section>
	);
};

const PersonSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M12 15C14.0711 15 15.75 13.3211 15.75 11.25C15.75 9.17893 14.0711 7.5 12 7.5C9.92893 7.5 8.25 9.17893 8.25 11.25C8.25 13.3211 9.92893 15 12 15Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M5.9812 18.6909C6.54549 17.5794 7.40654 16.6459 8.4689 15.9938C9.53126 15.3418 10.7534 14.9966 12 14.9966C13.2465 14.9966 14.4686 15.3418 15.531 15.9938C16.5934 16.6459 17.4544 17.5794 18.0187 18.6909"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const WalletSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M3.75 5.25V17.25C3.75 17.6478 3.90804 18.0294 4.18934 18.3107C4.47064 18.592 4.85218 18.75 5.25 18.75H20.25C20.4489 18.75 20.6397 18.671 20.7803 18.5303C20.921 18.3897 21 18.1989 21 18V7.5C21 7.30109 20.921 7.11032 20.7803 6.96967C20.6397 6.82902 20.4489 6.75 20.25 6.75H5.25C4.85218 6.75 4.47064 6.59196 4.18934 6.31066C3.90804 6.02936 3.75 5.64782 3.75 5.25ZM3.75 5.25C3.75 4.85218 3.90804 4.47064 4.18934 4.18934C4.47064 3.90804 4.85218 3.75 5.25 3.75H18"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16.875 13.5C17.4963 13.5 18 12.9963 18 12.375C18 11.7537 17.4963 11.25 16.875 11.25C16.2537 11.25 15.75 11.7537 15.75 12.375C15.75 12.9963 16.2537 13.5 16.875 13.5Z"
			fill="#EA5817"
		/>
	</svg>
);

const HandHeartSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4.5 19.5H1.5C1.30109 19.5 1.11032 19.421 0.96967 19.2803C0.829018 19.1397 0.75 18.9489 0.75 18.75V15C0.75 14.8011 0.829018 14.6103 0.96967 14.4697C1.11032 14.329 1.30109 14.25 1.5 14.25H4.5"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10.5 15H13.5L19.7812 13.5553C20.0122 13.492 20.2546 13.4829 20.4897 13.5285C20.7247 13.5741 20.9461 13.6734 21.1365 13.8185C21.327 13.9636 21.4814 14.1507 21.5878 14.3652C21.6942 14.5797 21.7497 14.8159 21.75 15.0553C21.7501 15.3444 21.6697 15.6279 21.5176 15.8738C21.3656 16.1197 21.148 16.3184 20.8894 16.4475L17.25 18L11.25 19.5H4.5V14.25L6.84375 11.9063C7.05324 11.6975 7.30182 11.5321 7.5753 11.4195C7.84877 11.3069 8.14175 11.2493 8.4375 11.25H13.125C13.6223 11.25 14.0992 11.4476 14.4508 11.7992C14.8025 12.1508 15 12.6277 15 13.125C15 13.6223 14.8025 14.0992 14.4508 14.4508C14.0992 14.8025 13.6223 15 13.125 15H10.5Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9.06844 11.2498C8.15625 10.0985 7.5 8.86476 7.5 7.49976C7.5 5.46633 9.15656 3.74976 11.1994 3.74976C11.9295 3.7412 12.6455 3.95076 13.2558 4.3516C13.8661 4.75244 14.3428 5.32633 14.625 5.99976C14.9072 5.32633 15.3839 4.75244 15.9942 4.3516C16.6045 3.95076 17.3205 3.7412 18.0506 3.74976C20.0934 3.74976 21.75 5.46633 21.75 7.49976C21.75 10.2401 19.1081 12.6626 17.0419 14.186"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const GraphSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9 7.5C10.2426 7.5 11.25 6.49264 11.25 5.25C11.25 4.00736 10.2426 3 9 3C7.75736 3 6.75 4.00736 6.75 5.25C6.75 6.49264 7.75736 7.5 9 7.5Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18.75 12C19.9926 12 21 10.9926 21 9.75C21 8.50736 19.9926 7.5 18.75 7.5C17.5074 7.5 16.5 8.50736 16.5 9.75C16.5 10.9926 17.5074 12 18.75 12Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18.75 19.5C19.9926 19.5 21 18.4926 21 17.25C21 16.0074 19.9926 15 18.75 15C17.5074 15 16.5 16.0074 16.5 17.25C16.5 18.4926 17.5074 19.5 18.75 19.5Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M5.25 20.25C6.49264 20.25 7.5 19.2426 7.5 18C7.5 16.7574 6.49264 15.75 5.25 15.75C4.00736 15.75 3 16.7574 3 18C3 19.2426 4.00736 20.25 5.25 20.25Z"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11.0859 9.94379L9.91406 7.30566"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16.6153 10.4614L14.1347 11.2883"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16.9744 15.869L13.7756 13.3809"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10.3181 13.4946L6.93188 16.5059"
			stroke="#EA5817"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default NavAccountDetails;
