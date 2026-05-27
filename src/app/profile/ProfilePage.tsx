"use client";

import clsx from "clsx";
import { formatUnits } from "viem";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Body, Heading2, LiftedButton } from "@breadcoop/ui";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { useVaultTokenBalance } from "@/app/governance/lp-vaults/context/VaultTokenBalanceContext";
import { useModal } from "@/app/core/context/ModalContext";
import { formatBalance } from "@/app/core/util/formatter";
import { WRAPPER_CLASSES } from "@/app/core/util/classes";
import { LoginButton } from "@/app/components/login-button";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import SwapWrapper from "@/app/components/SwapWrapper";
import { useUserVoteCount } from "@/app/governance/useUserVoteCount";
import { CURVE_SWAP_URL } from "@/constants";

export function ProfilePage() {
	const { user } = useConnectedUser();
	const { BREAD } = useTokenBalances();
	const { data: apyData } = useVaultAPY();
	const vaultBalance = useVaultTokenBalance();
	const { setModal } = useModal();

	const userAddress = "address" in user ? user.address : undefined;
	const { totalVotes, isLoading: votesLoading } =
		useUserVoteCount(userAddress);

	const breadBalance =
		BREAD?.status === "SUCCESS" ? parseFloat(BREAD.value) : 0;

	const apyRate = apyData ? Number(formatUnits(apyData, 18)) : 0;
	const apyPercent = apyData ? Number(formatUnits(apyData, 16)) : 0;
	const annualDonation = breadBalance * apyRate;

	const votingPower =
		vaultBalance?.butter?.status === "success"
			? parseFloat(formatUnits(vaultBalance.butter.value, 18))
			: null;

	const handleBake = () => {
		setModal({
			type: "GENERIC_MODAL",
			showCloseButton: false,
			includeContainerStyling: false,
			children: <SwapWrapper />,
			className: "max-w-[30rem]",
		});
	};

	if (user.status === "NOT_CONNECTED" || user.status === "UNSUPPORTED_CHAIN") {
		return (
			<div
				className={clsx(
					WRAPPER_CLASSES,
					"flex flex-col items-center justify-center py-32 text-center",
				)}
			>
				<Body className="text-surface-grey-2 mb-6">
					{user.status === "NOT_CONNECTED"
						? "Connect your wallet to view your account"
						: "Switch to Gnosis Chain to view your account"}
				</Body>
				<div className="w-full max-w-xs">
					<LoginButton user={user} />
				</div>
			</div>
		);
	}

	const [balInt, balDec] = formatBalance(breadBalance, 2).split(".");
	const [donInt, donDec] = formatBalance(annualDonation, 2).split(".");
	const [vpInt, vpDec] =
		votingPower !== null
			? formatBalance(votingPower, 2).split(".")
			: ["—", null];
	const [apyInt, apyDec] = formatBalance(apyPercent, 1).split(".");

	return (
		<div className={clsx(WRAPPER_CLASSES, "py-8")}>
			<div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
				{/* ── Left: Your Account card ── */}
				<div className="bg-paper-0 border border-paper-2 p-5 flex flex-col gap-8.25">
					<Body className="font-bold text-2xl text-black opacity-50">
						Your Account
					</Body>

					<div className="flex flex-col items-center gap-5">
						{/* Large balance display */}
						<div className="flex flex-col items-center gap-4.5">
							<div className="flex items-end leading-none">
								<span className="font-breadDisplay font-black text-orange-2 text-[64px] leading-14 tracking-[-0.03em]">
									$
								</span>
								<span className="font-breadDisplay font-black text-orange-2 text-[64px] leading-14 tracking-[-0.03em]">
									{balInt}
								</span>
								<span className="font-breadDisplay font-black text-orange-2 text-[64px] leading-14 tracking-[-0.03em]">
									.{balDec}
								</span>
							</div>
							<Body className="font-bold text-surface-grey text-2xl">
								Total balance
							</Body>
							<Body className="font-bold text-surface-grey text-xs">
								All funds are $BREAD
							</Body>
						</div>

						<div className="flex gap-3.75 items-center flex-wrap sm:flex-nowrap">
							<div className="lifted-button-container flex-1">
								<LiftedButton onClick={handleBake}>
									Bake $BREAD
								</LiftedButton>
							</div>
							<a
								href={CURVE_SWAP_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="lifted-button-container flex-1"
							>
								<LiftedButton
									preset="secondary"
									leftIcon={<ArrowUpRightIcon />}
								>
									Swap to WXDAI
								</LiftedButton>
							</a>
						</div>
					</div>
				</div>

				{/* ── Right: Solidarity Fund stats ── */}
				<div className="flex flex-col gap-4">
					<Heading2 className="font-breadDisplay font-black text-[#ea5817] text-2xl tracking-[-0.02em]">
						Solidarity fund
					</Heading2>

					<div className="grid grid-cols-2 gap-x-4 gap-y-5">
						{/* Total annual donation */}
						<StatCard label="Total annual donation">
							<DisplayNumber
								prefix="$"
								int={donInt}
								dec={donDec}
							/>
						</StatCard>

						{/* Total voting power */}
						<StatCard label="Total voting power">
							<div className="flex items-center gap-2.75">
								<span className="shrink-0">
									<FistIcon />
								</span>
								<DisplayNumber int={vpInt} dec={vpDec} />
							</div>
						</StatCard>

						{/* APY */}
						<StatCard label="APY">
							<DisplayNumber
								int={apyInt}
								dec={apyDec}
								suffix="%"
							/>
						</StatCard>

						{/* Votes casted */}
						<StatCard label="Votes casted">
							<DisplayNumber
								int={votesLoading ? "—" : String(totalVotes)}
							/>
						</StatCard>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatCard({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-paper-1 p-5 flex flex-col items-center justify-center gap-2.75 min-h-32.75">
			<div className="flex items-end">{children}</div>
			<Body className="font-bold text-base text-surface-grey">
				{label}
			</Body>
		</div>
	);
}

function DisplayNumber({
	prefix,
	int: intPart,
	dec,
	suffix,
}: {
	prefix?: string;
	int: string;
	dec?: string | null;
	suffix?: string;
}) {
	return (
		<div className="flex items-end leading-none gap-0.5">
			{prefix && (
				<span className="font-breadDisplay font-black text-[48px] leading-12 tracking-[-0.02em] text-surface-ink">
					{prefix}
				</span>
			)}
			<span className="font-breadDisplay font-black text-[48px] leading-12 tracking-[-0.02em] text-surface-ink">
				{intPart}
			</span>
			{dec && (
				<span className="font-breadBody font-bold text-[24px] leading-none text-surface-ink mb-0.5">
					.{dec}
				</span>
			)}
			{suffix && (
				<span className="font-breadDisplay font-black text-[48px] leading-12 tracking-[-0.02em] text-surface-ink">
					{suffix}
				</span>
			)}
		</div>
	);
}
