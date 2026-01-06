import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import { Address } from "viem";
import { useSearchParams } from "next/navigation";
// import { FromPanel } from "./FromPanel";
import SwapReverse from "../SwapReverse";
// import ToPanel from "./ToPanel";
// import { useChainModal } from "@rainbow-me/rainbowkit";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { Body } from "@breadcoop/ui";
// import { ArrowsDownUpIcon, SignIn } from "@phosphor-icons/react";
import { SwapPanel, TSwapState } from "./Panel";
import { LoginButton } from "@/app/components/login-button";
import { ButtonShell } from "./button-shell";
import Bake from "./Bake";
import Burn from "./Burn";
import { InsufficentBalance } from "./InsufficentBalance";
// import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
// import { useModal } from "@/app/core/context/ModalContext";
// import { sleep } from "@/utils/sleep";
import { Bridge } from "./Bridge";
import { Buy } from "./Buy";
import { useToast } from "@/app/core/context/ToastContext/ToastContext";

// export type TSwapMode = "BAKE" | "BURN" | "BRIDGE";

// export type TSwapState = {
// 	mode: TSwapMode;
// 	value: string;
// };

const notes: Record<TSwapState["mode"], string> = {
	"BAKE": 'Baking adds new BREAD into circulation. You can redeem your BREAD through the "Burn" tab at any time',
	"BURN": "When you Burn BREAD, you are no longer contributing to the Solidarity Fund, and all voting power will be removed.",
	"BRIDGE": "This bridge is powered by LI.FI",
	"BUY": "Clicking the button will open the ZKP2P website where you can complete your purchase of xDAI to bake into BREAD.",
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
	const searchParams = useSearchParams();
	const { toastDispatch } = useToast();
	const [isMobile, setIsMobile] = useState(false);

	// Handle mobile detection
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Handle ZKP2P callback
	useEffect(() => {
		if (searchParams.get("zkp2p") === "success") {
			toastDispatch({
				type: "CUSTOM",
				payload: {
					variant: "success",
					message: "Purchase completed! Your xDAI should arrive shortly.",
				},
			});
			// Clean up URL
			window.history.replaceState({}, "", "/bakery");
		}
	}, [searchParams, toastDispatch]);

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

	// const { openChainModal } = useChainModal();

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

	// const { transactionsState, transactionsDispatch } = useTransactions();
	// const { setModal } = useModal();

	return (
		<div className="bg-[#FDFAF3] shadow-[0px_4px_12px_0px_#1B201A26] p-8 mb-12">
			<div>
				<div className="bg-paper-main p-1 flex items-center justify-between max-w-[20rem]">
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
					<ModeBtn
						label="Buy"
						selected={swapState.mode === "BUY"}
						onClick={() =>
							setSwapState({ mode: "BUY", value: "" })
						}
					/>
				</div>
				{/* <button>filter icon</button> */}
			</div>
			<div className="mt-4">
				{swapState.mode === "BAKE" || swapState.mode === "BURN" ? (
					<>
						{/* <FromPanel
							inputValue={swapState.value}
							swapMode={swapState.mode}
							handleBalanceClick={handleBalanceClick}
							handleInputChange={handleInputChange}
							tokenBalance={
								swapState.mode === "BAKE" ? xDAI : BREAD
							}
						/> */}
						<SwapPanel
							path="from"
							swapState={swapState}
							handleInputChange={handleInputChange}
							handleBalanceClick={handleBalanceClick}
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
						<SwapPanel
							path="to"
							swapState={swapState}
							handleBalanceClick={handleBalanceClick}
							tokenBalance={
								swapState.mode === "BURN" ? xDAI : BREAD
							}
						/>
						{/* <ToPanel
							inputValue={swapState.value}
							swapMode={swapState.mode}
							tokenBalance={
								swapState.mode === "BURN" ? xDAI : BREAD
							}
						/> */}
					</>
				) : swapState.mode === "BRIDGE" ? (
					<Bridge />
				) : (
					<Buy />
				)}
			</div>
			{/* TODO: Remove some nested element here when the button is fixed */}
			{swapState.mode !== "BRIDGE" && swapState.mode !== "BUY" && (
				<div className="mt-6">
					{user.status === "CONNECTED" ? (
						<div className="[&>*]:w-full">
							{(() => {
								const sourceToken =
									swapState.mode === "BAKE" ? xDAI : BREAD;

								if (!sourceToken) return <ButtonShell />;
								if (sourceToken.status !== "SUCCESS")
									return <ButtonShell />;

								const balanceIsSufficent =
									parseFloat(swapState.value || "0") <=
									parseFloat(sourceToken.value);

								if (balanceIsSufficent)
									return swapState.mode === "BAKE" ? (
										<Bake
											user={user}
											clearInputValue={clearInputValue}
											inputValue={swapState.value}
											isSafe={isSafe}
										/>
									) : (
										<Burn
											user={user}
											clearInputValue={clearInputValue}
											inputValue={swapState.value}
											isSafe={isSafe}
										/>
									);

								return <InsufficentBalance />;
							})()}
						</div>
					) : (
						<LoginButton user={user} />
					)}
				</div>
			)}
			{!(swapState.mode === "BUY" && isMobile) && (
				<Body className="text-surface-grey text-sm mt-1">
					<span className="font-bold">Note</span>: {notes[swapState.mode]}
				</Body>
			)}
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
			className={`py-1 px-2 font-bold border hover:text-surface-ink transition-colors ${
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
