import { ReactNode } from "react";
import { Hex } from "viem";
import Image from "next/image";
// import { Badge, LinkBadge } from "@/app/core/components/Badge/Badge";
// import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import { formatVotePercentage } from "@/app/core/util/formatter";
import { projectsMeta } from "@/app/projectsMeta";
import type { TConnectedUserState } from "@/app/core/hooks/useConnectedUser";
import { DecrementIcon, IncrementIcon } from "./Icons";
import clsx from "clsx";
// import { CardBox } from "@/app/core/components/CardBox";
// import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { useProject } from "@/app/core/context/ProjectContext/ProjectContext";
import { Body, LiftedButton, Logo } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { Chip } from "@/app/bakery/components/Chip";
import { GapInfoIcon } from "./gap/GapInfoIcon";

export function ProjectRow({
	address,
	children,
}: {
	address: Hex;
	children: ReactNode;
}) {
	const projectMeta = projectsMeta[address];
	const { project } = useProject();

	// If project metadata doesn't exist or project is not active, don't render
	if (!projectMeta || !projectMeta.active) {
		return null;
	}

	const { name, logoSrc, description, link } = projectMeta;
	const projectBread = project.BREAD;
	const projectPower = project.POWER;

	const renderBreadHolding = (value: string) => {
		return (
			<span>
				{
					Number(parseFloat(value).toFixed(2))
						.toLocaleString()
						.split(".")[0]
				}
				{"."}
				<span className="text-xs">
					{Number(parseFloat(value).toFixed(2))
						.toLocaleString()
						.split(".")[1] || "00"}
				</span>
			</span>
		);
	};

	const explorerLink = () => {
		if (address) {
			return "https://gnosisscan.io/address/" + address;
		} else return "";
	};

	return (
		<div className="shadow-[0px_4px_8px_0px_#1B201A0F]">
			{/* small */}
			<div className="sm:hidden py-3 px-5 flex flex-col justify-start gap-4">
				<div className="flex flex-col gap-2">
					<div className="flex gap-2">
						<div className="flex items-center justify-center h-8 w-8 bg-white p-1">
							<Image
								className="w-6 h-6"
								src={logoSrc}
								alt={`${name} logo`}
								width="24"
								height="24"
							/>
						</div>
						<div className="flex items-center gap-2">
							<ExternalLink
								href={link}
								className="flex items-center justify-start gap-1 text-[#EA5817]"
							>
								<Body bold className="text-black">
									{name}
								</Body>
								<ArrowUpRightIcon size={24} />
							</ExternalLink>
							{link.includes('gap.karmahq.xyz') && <GapInfoIcon address={address} />}
						</div>
					</div>
					<Body className="text-xs mb-4">{description}</Body>
					{projectBread?.status === "SUCCESS" && (
						<ExternalLink
							href={explorerLink()}
							className="!text-[#EA5817] flex items-center justify-start w-full"
						>
							<Chip className="px-4! py-1! border-surface-ink! bg-paper-main flex items-center justify-center w-full">
								<Logo size={20} />
								<Body bold className="mt-1 mr-auto text-surface-ink">
									{renderBreadHolding(projectBread.value)}
								</Body>
								<ArrowUpRightIcon size={20} />
							</Chip>
						</ExternalLink>
					)}
					{projectPower?.status === "SUCCESS" && (
						<Chip className="px-4! py-1! border-surface-ink! bg-paper-main flex items-center justify-start">
							<FistIcon />
							<Body bold className="mt-1">
								{projectPower.value}
							</Body>
						</Chip>
					)}
				</div>
				<div className="flex items-center justify-center">
					{children}
				</div>
			</div>
			{/* large */}
			<div className="hidden sm:flex flex-col sm:flex-row rounded-lg px-5 py-4 gap-4 lg:bg-[#FDFAF3]">
				<div className="flex flex-col gap-4 grow">
					<div className="flex gap-2 items-end">
						<div className="flex items-center justify-center h-16 w-16 bg-white p-1">
							<Image
								className="w-12 h-12"
								src={logoSrc}
								alt={`${name} logo`}
								width="48"
								height="48"
							/>
						</div>
						<div>
							<div className="flex items-center mb-2 gap-2">
								<ExternalLink
									href={link}
									className="flex items-center justify-start gap-1"
								>
									<Body bold className="text-black">
										{name}
									</Body>
									<ArrowUpRightIcon size={24} />
								</ExternalLink>
								{link.includes('gap.karmahq.xyz') && <GapInfoIcon address={address} />}
							</div>
							<div className="flex items-stretch justify-start gap-2">
								{projectBread?.status === "SUCCESS" && (
									<ExternalLink
										href={explorerLink()}
										className="!text-current flex items-center justify-center"
									>
										<Chip className="px-4! py-1! border-surface-ink! bg-paper-main flex items-center justify-center">
											<Logo size={20} />
											<Body bold className="mt-1">
												{renderBreadHolding(
													projectBread.value
												)}
											</Body>
										</Chip>
									</ExternalLink>
								)}
								{projectPower?.status === "SUCCESS" && (
									<Chip className="px-4! py-1! border-surface-ink! bg-paper-main flex items-center justify-center">
										<FistIcon />
										<Body bold className="mt-1">
											{projectPower.value}
										</Body>
									</Chip>
								)}
							</div>
						</div>
					</div>
					<Body className="max-w-xs">{description}</Body>
				</div>
				{children}
			</div>
		</div>
	);
}

export function VoteForm({
	address,
	value,
	updateValue,
	totalPoints,
	user,
	userCanVote,
	disabled,
}: {
	address: Hex;
	value: number;
	updateValue: (value: number, address: Hex) => void;
	totalPoints: number;
	user: TConnectedUserState;
	userCanVote: boolean;
	disabled?: boolean;
}) {
	function increment() {
		updateValue(value + 1 <= 99 ? (value || 0) + 1 : value, address);
	}

	function decrement() {
		updateValue(value - 1 >= 0 ? (value || 0) - 1 : value, address);
	}

	const isDisabled =
		user.status !== "CONNECTED" || !userCanVote || (disabled ?? false);

	return (
		<fieldset
			className={clsx(
				"border border-surface-brown flex flex-col gap-2.5 py-[2.1875rem] px-[1.5625rem] w-full sm:max-w-[10.00875rem] sm:ml-auto md:max-w-48",
				isDisabled && "opacity-50"
			)}
			disabled={isDisabled}
		>
			<div className="flex items-center justify-between w-full sm:w-auto">
				<InputButton onClick={decrement} isDisabled={isDisabled}>
					<span
						className={clsx(
							// "size-6 sm:size-5",
							// !userCanVote && "opacity-50"
							""
						)}
					>
						<DecrementIcon />
					</span>
				</InputButton>
				<input
					className={clsx(
						// "min-w-12 max-w-0 p-1 dark:text-breadgray-ultra-white bg-breadgray-ultra-white dark:bg-breadgray-burnt border-neutral-300 text-4xl sm:text-2xl font-medium text-center",
						"w-6/12 mx-auto text-center text-surface-ink font-bold",
						!userCanVote && "opacity-50 "
					)}
					type="text"
					placeholder="00"
					inputMode="decimal"
					autoComplete="off"
					autoCorrect="off"
					pattern="^[0-9]*[.,]?[0-9]*$"
					minLength={1}
					maxLength={2}
					spellCheck="false"
					onChange={(event) => {
						if (isDisabled) return;

						updateValue(
							event.target.value
								? parseInt(event.target.value)
								: 0,
							address
						);
					}}
					value={value === null ? "00" : value}
					// disabled={isDisabled}
				/>
				<InputButton onClick={increment} isDisabled={isDisabled}>
					<span
						className={clsx(
							"size-6 sm:size-5",
							!userCanVote && "opacity-50"
						)}
					>
						<IncrementIcon />
					</span>
				</InputButton>
			</div>
			<Body bold className="text-orange-2 text-center">
				{formatVotePercentage(
					value && totalPoints > 0 ? (value / totalPoints) * 100 : 0
				)}
				%
			</Body>
		</fieldset>
	);
}

function InputButton({
	onClick,
	children,
	isDisabled,
}: {
	onClick: () => void;
	children: ReactNode;
	isDisabled: boolean;
}) {
	const handleClick = () => {
		if (isDisabled) return;
		onClick();
	};

	return (
		<div className="lifted-button-container max-w-7">
			<LiftedButton
				preset="stroke"
				className="p-2 border-2 border-surface-ink h-7"
				onClick={handleClick}
				// disabled={isDisabled}
			>
				{children}
			</LiftedButton>
		</div>
	);
}
