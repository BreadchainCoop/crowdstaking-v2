import { ReactNode } from "react";
import { Hex } from "viem";
import Image from "next/image";
import { Badge, LinkBadge } from "@/app/core/components/Badge/Badge";
import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import { formatVotePercentage } from "@/app/core/util/formatter";
import { projectsMeta } from "@/app/projectsMeta";
import type { TConnectedUserState } from "@/app/core/hooks/useConnectedUser";
import { DecrementIcon, IncrementIcon } from "./Icons";
import clsx from "clsx";
import { CardBox } from "@/app/core/components/CardBox";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { useProject } from "@/app/core/context/ProjectContext/ProjectContext";
import { Body, LiftedButton, Logo } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

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
				<div className="flex flex-col gap-3">
					<div className="flex gap-2">
						<Image
							className="w-8 h-8"
							src={logoSrc}
							alt={`${name} logo`}
							width="56"
							height="56"
						/>
						<div className="flex items-center justify-start gap-1">
							<Body bold>{name}</Body>
							<ArrowUpRightIcon color="#EA5817" />
						</div>
					</div>
					<Body className="text-xs mb-3">{description}</Body>
					{projectBread?.status === "SUCCESS" && (
						<div className="inline-block tracking-wide">
							<LinkBadge
								icon={<Logo size={20} />}
								href={explorerLink()}
							>
								{renderBreadHolding(projectBread.value)}
							</LinkBadge>
						</div>
					)}
					{projectPower?.status === "SUCCESS" && (
						<div className="inline-block tracking-wide">
							<Badge icon={<FistIcon />}>
								{projectPower.value}
							</Badge>
						</div>
					)}
				</div>
				<div className="flex items-center justify-center">
					{children}
				</div>
				{/* <div className=" flex flex-col gap-3">
					<div className="flex gap-2">
						<Image
							className="w-8 h-8"
							src={logoSrc}
							alt={`${name} logo`}
							width="56"
							height="56"
						/>
						<div className="font-bold col-start-2 col-span-11 row-start-1 row-span-1 flex items-center font-bold sm:text-xl sm:font-normal text-breadgray-grey100 dark:text-breadgray-light-grey">
							<a
								className="flex gap-2 items-center font-bold sm:text-xl sm:font-normal dark:text-breadgray-ultra-white hover:text-breadpink-shaded transition-colors"
								href={link}
								target="_blank"
								rel="noopener noreferrer"
							>
								<span className="font-bold">{name}</span>
								<LinkIcon />
							</a>
						</div>
					</div>
					<div className="text-breadgray-rye dark:text-breadgray-grey">
						{description}
					</div>
					{projectBread?.status === "SUCCESS" && (
						<div className="inline-block tracking-wide">
							<LinkBadge
								icon={<BreadIcon size="small" />}
								href={explorerLink()}
							>
								{renderBreadHolding(projectBread.value)}
							</LinkBadge>
						</div>
					)}
					{projectPower?.status === "SUCCESS" && (
						<div className="inline-block tracking-wide">
							<Badge icon={<FistIcon size="small" bg="burnt" />}>
								{projectPower.value}
							</Badge>
						</div>
					)}
				</div>
				<div className="flex items-center justify-center">
					{children}
				</div> */}
			</div>
			{/* large */}
			<div className="hidden sm:flex flex-col sm:flex-row rounded-lg px-5 py-4 gap-4 lg:bg-[#FDFAF3]">
				<div className="flex flex-col gap-4 grow">
					<div className="flex gap-4 items-center">
						<div className="flex items-center">
							<Image
								className="min-w-14 h-14 rounded-full"
								src={logoSrc}
								alt={`${name} logo`}
								width="56"
								height="56"
							/>
						</div>
						<div>
							<div className="flex items-center mb-2">
								<a
									className="flex gap-2 items-center font-bold sm:text-xl sm:font-normal dark:text-breadgray-ultra-white hover:text-breadpink-shaded transition-colors"
									href={link}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="font-bold">{name}</span>
									<LinkIcon />
								</a>
							</div>
							<div className="flex items-stretch justify-start gap-2">
								{projectBread?.status === "SUCCESS" && (
									<div className="tracking-wide">
										<LinkBadge
											className="h-full"
											icon={<Logo size={20} />}
											href={explorerLink()}
										>
											{renderBreadHolding(
												projectBread.value
											)}
										</LinkBadge>
									</div>
								)}
								{projectPower?.status === "SUCCESS" && (
									<div className="tracking-wide">
										<Badge icon={<FistIcon />}>
											{projectPower.value}
											{/* TODO #134 <span className="ms-3">Not voted</span> */}
										</Badge>
									</div>
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
}: {
	address: Hex;
	value: number;
	updateValue: (value: number, address: Hex) => void;
	totalPoints: number;
	user: TConnectedUserState;
	userCanVote: boolean;
}) {
	function increment() {
		updateValue(value + 1 <= 99 ? (value || 0) + 1 : value, address);
	}

	function decrement() {
		updateValue(value - 1 >= 0 ? (value || 0) - 1 : value, address);
	}

	const isDisabled = user.status !== "CONNECTED" || !userCanVote;

	return (
		<div className="border border-surface-brown flex flex-col gap-2.5 py-[2.1875rem] px-[1.5625rem] w-full sm:max-w-[10.00875rem] sm:ml-auto md:max-w-48">
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
				{formatVotePercentage(value ? (value / totalPoints) * 100 : 0)}%
			</Body>
		</div>
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
	return (
		<div className="lifted-button-container max-w-7">
			<LiftedButton
				preset="stroke"
				className="p-2 border-2 border-surface-ink h-7"
				onClick={onClick}
				// disabled={isDisabled}
			>
				{children}
			</LiftedButton>
		</div>
	);
}

export function VoteDisplay({
  points,
  percentage,
}: {
  points: number;
  percentage: number;
}) {
  return (
    <div className="flex items-center gap-4 px-4 border-2 border-breadgray-light-grey dark:border-breadgray-rye rounded-lg dark:bg-breadgray-burnt">
      <div className="text-2xl font-medium min-w-[3rem] text-center">
        {points}
      </div>
      <div className="font-medium min-w-[4rem] text-right border-l-2 border-breadgray-light-grey dark:border-l-breadgray-rye">
        {formatVotePercentage(percentage)}%
      </div>
    </div>
  );
}
