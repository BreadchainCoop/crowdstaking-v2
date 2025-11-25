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
import { LiftedButton, Logo } from "@breadcoop/ui";
import { ExternalLink } from "../../ExternalLink";

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
				<p className="flex gap-2 items-center justify-center">
					<span className="mt-[0.2rem]">
						<XDAIIcon />
					</span>
					<TransactionValue value={xDaiInEther} />
				</p>
				<div className="w-full border border-breadpink-shaded rounded-xl p-4">
					<BridgeInfo
						text="You succesfully bridged"
						icon={
							<div className="mt-[0.5rem]">
								<XDAIIcon />
							</div>
						}
						amount={formattedXdaiAmount}
					/>
					<div className="h-4 w-4 group-hover:transform group-hover:scale-125 group-hover:transition-transform ml-auto my-2">
						<DownIcon />
					</div>
					<BridgeInfo
						text="You can now bake"
						icon={<Logo size={24} variant="square" />}
						amount={formattedXdaiAmount}
					/>
				</div>
				<div className="mt-2 border border-status-success flex items-start justify-start rounded-xl p-4">
					<div className="text-ultra-white mr-2">
						<InfoBoxSvg />
					</div>
					<p className="text-breadgray-rye dark:text-breadgray-light-grey">
						Baking $BREAD increases crucial funding for our
						post-capitalist cooperatives.{" "}
						<ExternalLink
							href="https://breadchain.notion.site/4d496b311b984bd9841ef9c192b9c1c7?v=2eb1762e6b83440f8b0556c9917f86ca"
							className="border-b-2 border-dotted border-current"
						>
							How does this work?
						</ExternalLink>
					</p>
				</div>
				{user.status === "CONNECTED" && (
					<div className="w-full">
						<Bake
							user={user}
							clearInputValue={() => {}}
							inputValue={formattedXdaiAmount}
							isSafe={isSafe}
						/>
					</div>
				)}
				<div className="lifted-button-container">
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

const InfoBoxSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.99951 3H4.99951V21H2.99951V3ZM18.9998 3.00003H5V5.00003H18.9998V19H5V21H19V21H20.9998V3H18.9998V3.00003ZM10.9998 9.00009H12.9998V7.00009H10.9998V9.00009ZM12.9998 17H10.9998V11H12.9998V17Z"
			fill="currentcolor"
		/>
	</svg>
);

interface BridgeInfoProps {
	text: string;
	icon: ReactNode;
	amount: string;
}

function BridgeInfo({ text, icon, amount }: BridgeInfoProps) {
	return (
		<div className="flex items-center justify-between mb-2">
			<p className="text-sm leading-normal text-breadgray-rye dark:text-breadgray-grey font-normal w-full max-w-72">
				{text}
			</p>
			<div className="flex items-center justify-end">
				<span className="mr-2">{icon}</span>
				<span className="font-semibold">{amount}</span>
			</div>
		</div>
	);
}

function DownIcon() {
	return (
		<svg
			className="w-full h-full"
			viewBox="0 0 15 16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="fill-current"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.5 0H8.5V12H10.5V14H8.5V16H6.5V14H4.5V12H6.5V0ZM2.5 10V12H4.5V10H2.5ZM2.5 10V8H0.5V10H2.5ZM12.5 10V12H10.5V10H12.5ZM12.5 10V8H14.5V10H12.5Z"
			/>
		</svg>
	);
}
