import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import React, { ChangeEvent, useCallback, useState } from "react";
import { Address } from "viem";
import { FromPanel } from "./FromPanel";
import SwapReverse from "../SwapReverse";
import ToPanel from "./ToPanel";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { Body, LiftedButton } from "@breadcoop/ui";
import { ArrowsDownUpIcon, SignIn } from "@phosphor-icons/react";

export type TSwapMode = "BAKE" | "BURN" | "BRIDGE";

export type TSwapState = {
	mode: TSwapMode;
	value: string;
};

const initialSwapState: TSwapState = {
	mode: "BAKE",
	value: "",
};

const NewSwap = () => {
	const { user, isSafe } = useConnectedUser();
	const [connectedAccountAddress, setConnectedAccountAddress] =
		useState<null | Address>(null);
	const [swapState, setSwapState] = useState<TSwapState>(initialSwapState);

	if (
		user.status === "CONNECTED" &&
		user.address !== connectedAccountAddress
	) {
		setConnectedAccountAddress(user.address);
		setSwapState((state) => ({ ...state, value: "" }));
	}

	const clearInputValue = useCallback(() => {
		setSwapState((state) => ({ ...state, value: "" }));
	}, [setSwapState]);

	const { openChainModal } = useChainModal();

	const { xDAI, BREAD } = useTokenBalances();

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		const sanitizedValue = sanitizeInputValue(value);
		setSwapState({
			...swapState,
			value: sanitizedValue,
		});
	};

	const handleSwapReverse = () => {
		setSwapState((state) => ({
			mode: state.mode === "BAKE" ? "BURN" : "BAKE",
			value: "",
		}));
	};

	const handleBalanceClick = (value: string) => {
		setSwapState((state) => ({
			...state,
			value:
				state.mode === "BAKE"
					? parseFloat(value) - 0.01 > 0
						? (parseFloat(value) - 0.01).toString()
						: "00.00"
					: parseFloat(value) === 0
					? "00.00"
					: value,
		}));
	};

	return (
		<div className="bg-[#FDFAF3] shadow-[0px_4px_12px_0px_#1B201A26] p-8 mb-12">
			<div>
				<div className="bg-paper-main p-1 flex items-center justify-between max-w-[15rem]">
					<ModeBtn
						label="Bake"
						selected={swapState.mode === "BAKE"}
						onClick={() =>
							setSwapState({ mode: "BAKE", value: "" })
						}
					/>
					<ModeBtn
						label="Burn"
						selected={swapState.mode === "BURN"}
						onClick={() =>
							setSwapState({ mode: "BURN", value: "" })
						}
					/>
					<ModeBtn
						label="Bridge"
						selected={swapState.mode === "BRIDGE"}
						onClick={() =>
							setSwapState({ mode: "BRIDGE", value: "" })
						}
					/>
				</div>
				{/* <button>filter icon</button> */}
			</div>
			<div className="mt-4">
				{(swapState.mode === "BAKE" || swapState.mode === "BURN") && (
					<>
						<FromPanel
							inputValue={swapState.value}
							swapMode={swapState.mode}
							handleBalanceClick={handleBalanceClick}
							handleInputChange={handleInputChange}
							tokenBalance={
								swapState.mode === "BAKE" ? xDAI : BREAD
							}
						/>
						<div className="flex items-center justify-between my-2">
							<Body className="text-xs text-surface-grey-2">
								1 $BREAD = 1 USD
							</Body>
							<SwapReverse onClick={handleSwapReverse} />
						</div>
						<ToPanel
							swapMode={swapState.mode}
							inputValue={swapState.value}
							tokenBalance={
								swapState.mode === "BURN" ? xDAI : BREAD
							}
						/>
					</>
				)}
			</div>
			<div className="mt-6 [&>*]:w-full">
				<LiftedButton rightIcon={<SignIn />} className="w-full">
					Sign in
				</LiftedButton>
			</div>
			<Body className="text-surface-grey text-sm mt-1">
				<span className="font-bold">Note</span>: Baking adds new BREAD
				into circulation. You can redeem your BREAD through the
				&quot;Burn&quot; tab at any time.
			</Body>
		</div>
	);
};

function ModeBtn({
	label,
	selected,
	onClick,
}: {
	label: string;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			// TODO: BOrder color here -> library color is different from figma
			className={`py-1 px-2 font-bold border ${
				selected
					? "text-surface-ink border-[#EA5817]"
					: "text-surface-grey border-transparent"
			}`}
			onClick={onClick}
		>
			{label}
		</button>
	);
}

export default NewSwap;
