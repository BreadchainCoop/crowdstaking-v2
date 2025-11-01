import { ChangeEvent, ChangeEventHandler } from "react";
import Input from "../Input";
import { Body, Logo } from "@breadcoop/ui";
import { XDAIIcon } from "@/app/core/components/Icons/TokenIcons";
import { TTokenBalanceState } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { MaxButton } from "@/app/core/components/MaxButton";
import Elipsis from "@/app/core/components/Elipsis";
import { formatBalance } from "@/app/core/util/formatter";

export type TSwapMode = "BAKE" | "BURN" | "BRIDGE";

export type TSwapState = {
	mode: TSwapMode;
	value: string;
};

interface FromPanel {
	path: "from";
	handleInputChange: ChangeEventHandler<HTMLInputElement>;
}

interface ToPanel {
	path: "to";
	handleInputChange?: never;
}

type Panel = (FromPanel | ToPanel) & {
	swapState: TSwapState;
	tokenBalance: null | TTokenBalanceState;
	handleBalanceClick: (balance: string) => void;
};

export const SwapPanel = ({
	path,
	swapState,
	tokenBalance,
	handleInputChange,
	handleBalanceClick,
}: Panel) => {
	const { mode: swapMode, value: inputValue } = swapState;
	const breadIcon =
		(swapMode === "BAKE" && path === "to") ||
		(swapMode === "BURN" && path === "from");
	const xDaiIcon =
		(swapMode === "BAKE" && path === "from") ||
		(swapMode === "BURN" && path === "to");

	const value = Number(inputValue);

	return (
		<div className="w-full bg-paper-1 p-5">
			<div className="flex w-full items-center justify-between gap-2 sm:gap-4">
				{path === "from" ? (
					<Input
						name="from"
						value={inputValue}
						handleInputChange={handleInputChange}
					/>
				) : (
					<span className="flex-auto truncate text-[2.3rem] sm:text-[2.5rem] text-black">
						{inputValue || "00.00"}
					</span>
				)}
				<div className="flex items-center w-auto border border-surface-grey p-1">
					{breadIcon && (
						<Logo text="BREAD" variant="square" size={24} />
					)}
					{xDaiIcon && (
						<>
							<XDAIIcon />
							<span>xDAI</span>
						</>
					)}
				</div>
			</div>
			<div className={`w-full flex justify-between mt-1`}>
				<Body className="text-surface-grey-2 text-xs">
					{value === 0 || Number.isNaN(value) ? "$00" : `~$${value}`}
				</Body>
				<TokenBalance
					tokenBalance={tokenBalance}
					handleBalanceClick={handleBalanceClick}
				/>
			</div>
		</div>
	);
};

function TokenBalance({
	tokenBalance,
	handleBalanceClick,
}: {
	tokenBalance: TTokenBalanceState | null;
	handleBalanceClick: (balance: string) => void;
}) {
	return (
		<div className="h-6 flex items-center justify-end">
			<div className="text-xs text-right font-bold text-black">
				Balance:
				{tokenBalance ? (
					<>
						{tokenBalance.status === "LOADING" ? (
							<Elipsis />
						) : tokenBalance.status === "SUCCESS" ? (
							<span
								title={`${parseFloat(
									tokenBalance.value
								).toString()} ${tokenBalance.tokenName}`}
							>
								{formatBalance(
									parseFloat(tokenBalance.value),
									2
								)}{" "}
								{tokenBalance.tokenName}
							</span>
						) : (
							""
						)}
					</>
				) : (
					"-"
				)}
			</div>
			{tokenBalance?.status === "SUCCESS" && (
				<MaxButton
					onClick={() => {
						handleBalanceClick(tokenBalance.value);
					}}
				>
					max
				</MaxButton>
			)}
		</div>
	);
}
