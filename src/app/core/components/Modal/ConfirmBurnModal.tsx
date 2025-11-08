import { ModalContainer, ModalContent, ModalHeading } from "./ModalUI";
import { ConfirmBurnModalState, ModalState } from "../../context/ModalContext";
import { BreadIcon, XDAIIcon } from "@/app/core/components/Icons/TokenIcons";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import SwapBreadButton from "@/app/bakery/components/Swap/SwapBreadButton";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { useModal } from "@/app/core/context/ModalContext";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk";
import Button from "../Button";
import { Body, LiftedButton, Logo } from "@breadcoop/ui";
export function ConfirmBurnModal({
	modalState,
}: {
	modalState: ConfirmBurnModalState;
}) {
	const { transactionsState, transactionsDispatch } = useTransactions();
	const { setModal } = useModal();
	const confirmBurn = async () => {
		console.log("__ TD 1", {
			data: { type: "BURN", value: modalState.xdaiValue },
		});
		try {
			transactionsDispatch({
				type: "NEW",
				payload: {
					data: {
						type: "BURN",
						value: modalState.xdaiValue,
					},
				},
			});
			setModal({
				type: "BAKERY_TRANSACTION",
				hash: null,
			});
			const hash = await modalState.write?.();
			if (transactionsState.submitted.find((tx) => tx.hash === hash))
				return;
			if (modalState.isSafe) {
				// TODO look at using eth_getTransactionRecipt to catch submitted transactions
				const safeSdk = new SafeAppsSDK();
				const tx = await safeSdk.txs.getBySafeTxHash(hash);
				if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
					transactionsDispatch({
						type: "SET_SAFE_SUBMITTED",
						payload: { hash },
					});
					setModal({ type: "BAKERY_TRANSACTION", hash });
					console.log("__ TD 2 __", { hash });
					console.log("__ SM 2", hash);
					modalState.clearInputValue?.();
					return;
				}
			}
			// not safe
			transactionsDispatch({
				type: "SET_SUBMITTED",
				payload: { hash },
			});
			setModal({ type: "BAKERY_TRANSACTION", hash });
			console.log("__ TD 3 __", { hash });
			console.log("__ SM 3", hash);
			modalState.clearInputValue?.();
		} catch (error) {
			console.error("Burning error__", error);
			// clear transaction closing modal on error including if user rejects the request
			setModal(null);
		}
	};
	return (
		<ModalContainer className="border border-system-red">
			<ModalHeading>Important to know</ModalHeading>
			<ModalContent>
				<div className="w-full p-4 border border-surface-grey mb-2.5">
					<div className="flex mb-6 justify-between items-center">
						<Body className="text-left">You are about to burn</Body>
						<Body bold className="flex gap-2">
							<Logo
								variant="square"
								text={modalState.breadValue}
								size={24}
							/>
						</Body>
					</div>
					<div className="w-full flex justify-between items-center">
						<Body className="text-left">You will receive</Body>
						<Body bold className="flex gap-2">
							<XDAIIcon />
							{modalState.xdaiValue}
						</Body>
					</div>
				</div>
				<div className="border border-system-red p-3 flex items-start justify-start gap-3">
					<div className="col-span-1 flex mt-1 justify-center">
						<WarningDiamondSvg />
					</div>
					<Body>
						Burning $BREAD will reduce crucial funding for our
						member projects.{" "}
						<b>
							To continue supporting the Bread Cooperative
							network, consider swapping your $BREAD instead.
						</b>
					</Body>
				</div>
				<div className="w-full mt-4">
					<SwapBreadButton withRecommended />
				</div>
				<div className="lifted-button-container w-full">
					<LiftedButton
						onClick={confirmBurn}
						preset="secondary"
						className="text-system-red font-bold"
					>
						Proceed to Burn
					</LiftedButton>
				</div>
				<Body className="text-surface-grey text-sm mt-1">
					<span className="font-bold">Note</span>: When you burn BREAD
					you change your BREAD back into xDAI. Your solidarity
					contribution and voting power will be removed.
				</Body>
			</ModalContent>
		</ModalContainer>
	);
}

const WarningDiamondSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 12.75V7.5"
			stroke="#DF0B00"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M12 15.0469C12.5954 15.0469 13.0781 15.5296 13.0781 16.125C13.0781 16.7204 12.5954 17.2031 12 17.2031C11.4046 17.2031 10.9219 16.7204 10.9219 16.125C10.9219 15.5296 11.4046 15.0469 12 15.0469Z"
			fill="#FF0420"
			stroke="#32A800"
			strokeWidth="0.09375"
		/>
		<path
			d="M11.4723 2.46864L2.46793 11.473C2.17687 11.764 2.17687 12.236 2.46793 12.527L11.4723 21.5314C11.7633 21.8224 12.2352 21.8224 12.5263 21.5314L21.5306 12.527C21.8217 12.236 21.8217 11.764 21.5306 11.473L12.5263 2.46864C12.2352 2.17758 11.7633 2.17758 11.4723 2.46864Z"
			stroke="#DF0B00"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
