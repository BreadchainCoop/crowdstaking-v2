import { ReactNode, useEffect } from "react";
import {
	ModalAdviceText,
	ModalContainer,
	ModalContent,
	ModalHeading,
	transactionIcons,
	TransactionValue,
} from "../ModalUI";
import { XDAIIcon } from "../../Icons/TokenIcons";
import {
	LiFiBridgeModalState,
	ModalState,
} from "@/app/core/context/ModalContext";
import { formatBalance } from "@/app/core/util/formatter";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import Bake from "@/app/bakery/components/Swap/Bake";
import { formatUnits } from "viem";
import { useSwitchChain } from "wagmi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { Body, LiftedButton, Logo } from "@breadcoop/ui";
import BakingBreadImportance from "@/app/components/baking-bread-importance";

export function LiFiBridgeModal({
	modalState,
	setModal,
}: {
	modalState: LiFiBridgeModalState;
	setModal: (modalState: ModalState) => void;
}) {
	const { switchChain } = useSwitchChain();
	const defaultChain = useActiveChain();
	const { user, isSafe } = useConnectedUser();
	const xDaiAmount = modalState.route.toAmount;
	console.log({
		route: modalState.route,
		amount: modalState.route.toAmount,
		amountUSD: modalState.route.toAmountUSD,
		xDaiAmount,
	});
	const xDaiInEther = formatUnits(BigInt(xDaiAmount), 18);
	const formattedXdaiAmount = formatBalance(Number(xDaiInEther), 2);

	useEffect(() => {
		switchChain({ chainId: defaultChain.ID });
	}, []);

	return (
		<ModalContainer>
			<ModalHeading>Success! Want to bake?</ModalHeading>
			<ModalContent>
				{transactionIcons.CONFIRMED}
				<ModalAdviceText>You sucessfully bridged</ModalAdviceText>
				<p className="flex gap-2.5 items-center justify-center border border-system-green p-1 mb-6">
					<XDAIIcon />
					<TransactionValue
						value={xDaiInEther}
						className="!leading-1 !font-bold"
					>
						{" "}
						xDAI
					</TransactionValue>
				</p>
				<div className="w-full border border-surface-grey p-4 mb-4">
					<BridgeInfo
						text="You succesfully bridged"
						icon={
							<div className="mt-1">
								<XDAIIcon />
							</div>
						}
						amount={formattedXdaiAmount}
					/>
					<div className="ml-auto mt-3 mb-4 max-w-max">
						<DownIcon />
					</div>
					<BridgeInfo
						text="You can now bake"
						icon={<Logo size={24} variant="square" />}
						amount={formattedXdaiAmount}
					/>
				</div>
				<BakingBreadImportance className="mb-6" />
				{user.status === "CONNECTED" && (
					<Bake
						user={user}
						clearInputValue={() => {}}
						inputValue={formattedXdaiAmount}
						isSafe={isSafe}
					/>
				)}
				<div className="lifted-button-container -mt-1">
					<LiftedButton
						preset="secondary"
						onClick={() => setModal(null)}
					>
						Close
					</LiftedButton>
				</div>
			</ModalContent>
		</ModalContainer>
	);
}

interface BridgeInfoProps {
	text: string;
	icon: ReactNode;
	amount: string;
}

function BridgeInfo({ text, icon, amount }: BridgeInfoProps) {
	return (
		<div className="flex items-center justify-between">
			<Body className="text-surface-grey w-full max-w-72">{text}</Body>
			<Body className="flex items-center justify-end gap-2">
				<span>{icon}</span>
				<span className="font-semibold">{amount}</span>
			</Body>
		</div>
	);
}

function DownIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19.2807 14.0306L12.5307 20.7806C12.461 20.8504 12.3783 20.9057 12.2873 20.9434C12.1962 20.9812 12.0986 21.0006 12.0001 21.0006C11.9015 21.0006 11.8039 20.9812 11.7128 20.9434C11.6218 20.9057 11.5391 20.8504 11.4694 20.7806L4.71943 14.0306C4.5787 13.8899 4.49963 13.699 4.49963 13.5C4.49963 13.301 4.5787 13.1101 4.71943 12.9694C4.86016 12.8286 5.05103 12.7496 5.25005 12.7496C5.44907 12.7496 5.63995 12.8286 5.78068 12.9694L11.2501 18.4397V3.75C11.2501 3.55109 11.3291 3.36032 11.4697 3.21967C11.6104 3.07902 11.8011 3 12.0001 3C12.199 3 12.3897 3.07902 12.5304 3.21967C12.671 3.36032 12.7501 3.55109 12.7501 3.75V18.4397L18.2194 12.9694C18.3602 12.8286 18.551 12.7496 18.7501 12.7496C18.9491 12.7496 19.1399 12.8286 19.2807 12.9694C19.4214 13.1101 19.5005 13.301 19.5005 13.5C19.5005 13.699 19.4214 13.8899 19.2807 14.0306Z"
				fill="#EA5817"
			/>
		</svg>
	);
}
