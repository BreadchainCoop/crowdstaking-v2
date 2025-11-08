import {
  ModalAdviceText,
  ModalContainer,
  ModalContent,
  ModalHeading,
  transactionIcons,
  TransactionValue,
} from "../ModalUI";
import {
	TSafeTransactionSubmitted,
	TTransactionData,
	TTransactionPrepared,
	TTransactionReverted,
	TTransactionStatus,
	TTransactionSubmitted,
	TTransactionSuccess,
} from "@/app/core//context/TransactionsContext/TransactionsReducer";
import {
	TokenLabelContainer,
	TokenLabelText,
} from "@/app/bakery/components/Swap/SwapUI";
import Button from "@/app/core/components/Button";
import { BreadIcon, XDAIIcon } from "../../Icons/TokenIcons";
import { ExplorerLink } from "../../ExplorerLink";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { BakeryTransactionModalState } from "@/app/core/context/ModalContext";
import { BREAD_ADDRESS } from "@/constants";
import { ERC20_ABI } from "@/abi";
import { ReactNode } from "react";
import { formatBalance, formatSupply } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { useBlockNumber } from "wagmi";
import { AddTokenButton } from "../../Header/AddTokenButton";
import { useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { renderFormattedDecimalNumber } from "@/app/core/util/formatter";
import { LinkIcon } from "../../Icons/LinkIcon";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { Body, LiftedButton, Logo } from "@breadcoop/ui";
import clsx from "clsx";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { Close as DialogPrimitiveClose } from "@radix-ui/react-dialog";

function makeHeaderText(
	modalType: "BAKE" | "BURN",
	status: TTransactionStatus
) {
	if (modalType === "BAKE") {
		if (status === "CONFIRMED") return "Buns are out!";

		return "Baking Bread";
	}

	if (status === "CONFIRMED") return "Burn complete";

	return "Burning Bread";
}

function modalAdviceText(
	modalType: "BAKE" | "BURN",
	status: TTransactionStatus
) {
	const text = {
		PREPARED: "Please confirm transaction in your wallet",
		SUBMITTED: "Waiting for on-chain confimation",
		SAFE_SUBMITTED: "Safe Transaction Submitted",
		// CONFIRMED:
		// 	modalType === "BAKE"
		// 		? "You successfully baked"
		// 		: "Transaction Confirmed",
		CONFIRMED:
			modalType === "BAKE"
				? "You successfully baked"
				: "You successfully received",
		REVERTED: "Transaction Reverted",
	};

	return text[status];
}

function ShareButtons({ newSupply }: { newSupply: number | null }) {
	function makeText(platform: "X" | "Warpcast") {
		return `I just baked some BREAD to help fund on-chain post-capitalism thanks to ${
			platform === "X" ? "@breadcoop" : "bread.coop"
		}!

I grew the bakery to ${
			newSupply ? formatSupply(newSupply) : ""
		} BREAD! \u{1F35E} \u{1F35E} \u{1F35E}

https://app.breadchain.xyz`;
	}

	const xText = encodeURIComponent(makeText("X"));
	const wText = encodeURIComponent(makeText("Warpcast"));

	const shareOnX = () => {
		window.open(`https://twitter.com/intent/tweet?text=${xText}`, "_blank");
	};
	const shareOnW = () => {
		window.open(`https://warpcast.com/~/compose?text=${wText}`, "_blank");
	};

	return (
		<div className="w-full flex flex-col gap-1 -mt-1">
			<div className="lifted-button-container">
				<LiftedButton
					onClick={shareOnX}
					disabled={newSupply === null}
					preset="secondary"
				>
					Share on{" "}
					<img
						className="inline ml-1"
						src="/x-logo-black.png"
						width={20}
						height={20}
						alt="X logo"
					/>
				</LiftedButton>
			</div>
			<div className="lifted-button-container">
				<LiftedButton
					onClick={shareOnW}
					disabled={newSupply === null}
					preset="secondary"
				>
					<span className="flex items-center justify-center">
						Share on{" "}
						<span className="ml-1">
							<BendFarcastSvg />
						</span>
					</span>
				</LiftedButton>
			</div>
		</div>
	);
}

export function BakeryTransactionModal({
	modalState,
}: {
	modalState: BakeryTransactionModalState;
}) {
	const { data: APY } = useVaultAPY();
	const { BREAD } = useTokenBalances();
	const { data: supply } = useRefetchOnBlockChange(
		BREAD_ADDRESS,
		ERC20_ABI,
		"totalSupply",
		[]
	);

	const { transactionsState } = useTransactions();
	const { data: currentBlockNumberData } = useBlockNumber({
		watch: true,
		chainId: useActiveChain().ID,
	});
	const { data: startingBlockNumber } = useBlockNumber({
		chainId: useActiveChain().ID,
	});
	const transaction = transactionsState.new
		? {
				status: "PREPARED",
				data: transactionsState.new,
				hash: null,
		  }
		: transactionsState.submitted.find(
				(transaction) =>
					transaction.hash === modalState.hash &&
					["BAKE", "BURN"].includes(transaction.data.type)
		  );

	if (!transaction)
		throw new Error("Transaction modal requires a transaction!");

	if (
		transaction.data.type === "VOTE" ||
		transaction.data.type === "LP_VAULT_ALLOWANCE" ||
		transaction.data.type === "LP_VAULT_DEPOSIT" ||
		transaction.data.type === "LP_VAULT_WITHDRAW"
	) {
		throw new Error("Incorrect transaction type for modal!");
	}

	const txStatus = transaction.status as TTransactionStatus;

	const calculateAnnualFundingValue = (breadValue: string, APY: bigint) => {
		const calculatedValue =
			parseFloat(breadValue) * Number(formatUnits(APY, 18));
		return formatBalance(calculatedValue, 2);
	};

	function newSupply(amount: string) {
		if (
			supply === undefined ||
			startingBlockNumber === undefined ||
			currentBlockNumberData === undefined ||
			typeof supply !== "bigint"
		) {
			return null;
		}

		if (startingBlockNumber < currentBlockNumberData) {
			return parseInt(formatUnits(supply, 18));
		}

		return (
			Number(Number(amount).toFixed()) + parseInt(formatUnits(supply, 18))
		);
	}

	let pastBreadCoop = "0.00";
	let additionalBreadCoop = "0.00";
	let totalBreadCoop = "0.00";

	if (
		transaction.status === "CONFIRMED" &&
		APY !== undefined &&
		BREAD?.status === "SUCCESS"
	) {
		totalBreadCoop = calculateAnnualFundingValue(BREAD.value, APY);
		additionalBreadCoop = calculateAnnualFundingValue(
			transaction.data.value,
			APY
		);
		pastBreadCoop = formatBalance(
			parseFloat(totalBreadCoop) - parseFloat(additionalBreadCoop),
			2
		);
	}

	return (
		<ModalContainer>
			<ModalHeading>
				{makeHeaderText(transaction.data.type, txStatus)}
			</ModalHeading>

			<ModalContent>
				{/* {transactionIcons[txStatus]} */}
				{transaction.status === "CONFIRMED" && (
					<ModalAdviceText>
						{modalAdviceText(transaction.data.type, txStatus)}
					</ModalAdviceText>
				)}
				<div
					className={clsx(
						"flex gap-2 items-center justify-center",
						transaction.status === "CONFIRMED" ? "mb-4" : "",
						transaction.data.type === "BAKE" ||
							(transaction.status === "CONFIRMED" &&
								transaction.data.type === "BURN")
							? "border border-system-green flex items-center justify-center gap-2.5 px-1"
							: "",
						transaction.data.type === "BURN" ? "mt-2" : ""
					)}
				>
					{transaction.status === "CONFIRMED" &&
						transaction.data.type === "BAKE" && (
							<span>
								<Logo variant="square" size={24} />
							</span>
						)}
					{transaction.data.type === "BURN" && <XDAIIcon />}
					<TransactionValue
						value={
							transaction.data.value
								? transaction.data.value
								: "0"
						}
					>
						{" "}
						{transaction.data.type === "BAKE" && <span>BREAD</span>}
					</TransactionValue>
					{/*  */}
					{/* {transaction.data.type !== "BAKE" && (
						<TokenLabelContainer>
							<BreadIcon />
							<TokenLabelText>BREAD</TokenLabelText>
						</TokenLabelContainer>
					)} */}
				</div>
				{transaction.status === "CONFIRMED" &&
					transaction.data.type === "BAKE" && (
						<MiddleContent
							pastBreadCoop={pastBreadCoop}
							additionalBreadCoop={additionalBreadCoop}
							totalBreadCoop={totalBreadCoop}
							transactionHash={transaction.hash || ""}
						/>
					)}
				<BottomContent
					txStatus={transaction.status}
					data={transaction.data}
					hash={transaction.hash}
					newSupply={newSupply}
				/>
				{transaction.status === "CONFIRMED" &&
					transaction.data.type === "BURN" && (
						<DialogPrimitiveClose asChild>
							<div className="lifted-button-container mt-14">
								<LiftedButton preset="secondary">
									Close
								</LiftedButton>
							</div>
						</DialogPrimitiveClose>
					)}
			</ModalContent>
		</ModalContainer>
	);
}

const BakedBreadCoopInfo = ({
	txHash,
	pastBreadCoop,
	additionalBreadCoop,
	totalBreadCoop,
}: {
	txHash: string;
	pastBreadCoop: string;
	additionalBreadCoop: string;
	totalBreadCoop: string;
}) => {
	return (
		<div className="w-full border border-surface-grey py-4 px-4">
			<BakedBreadCoopInfoItem
				label="Past annual Bread funding"
				amount={pastBreadCoop}
				type="past"
			/>
			<BakedBreadCoopInfoItem
				label="Additional Bread funding"
				amount={additionalBreadCoop}
				type="additional"
			/>
			<BakedBreadCoopInfoItem
				label="Total annual Bread funding"
				amount={totalBreadCoop}
				type="total"
			/>
			<div className="lifted-button-container mt-6">
				<LiftedButton
					preset="stroke"
					rightIcon={<ArrowUpRightIcon color="#EA5817" />}
					className="h-8 border border-surface-ink"
					onClick={() => {
						window.open(
							`https://gnosisscan.io/tx/${txHash}`,
							"_blank"
						);
					}}
				>
					View on Gnosisscan
				</LiftedButton>
			</div>
		</div>
	);
};

const BakedBreadCoopInfoItem = ({
	label,
	amount,
	type,
}: {
	label: string;
	amount: string;
	type: "past" | "additional" | "total";
}) => {
	return (
		<div className="flex items-center justify-between mb-2">
			<Body className="w-full max-w-[11.5rem] text-surface-grey text-sm mr-auto">
				{label}
			</Body>
			<div className="flex items-center justify-start flex-1 gap-2">
				<Logo size={24} variant="square" />
				<Body
					className={clsx(
						"inline-flex items-center justify-start",
						type === "additional" ? "text-orange-2" : ""
					)}
				>
					{type === "additional" && <span>+</span>}
					{renderFormattedDecimalNumber(amount)}
				</Body>
			</div>
		</div>
	);
};

const MiddleContent = ({
	pastBreadCoop,
	additionalBreadCoop,
	totalBreadCoop,
	transactionHash,
}: {
	pastBreadCoop: string;
	additionalBreadCoop: string;
	totalBreadCoop: string;
	transactionHash: string;
}) => {
	return (
		<>
			<BakedBreadCoopInfo
				txHash={transactionHash}
				pastBreadCoop={pastBreadCoop}
				additionalBreadCoop={additionalBreadCoop}
				totalBreadCoop={totalBreadCoop}
			/>
			<div className="mt-2 border border-system-green flex items-start justify-start p-4">
				<div className="mr-2">
					<InfoSvg />
				</div>
				<Body className="text-surface-grey">
					Baking $BREAD increases crucial funding for our
					post-capitalist cooperatives.{" "}
					<a
						href="https://breadchain.notion.site/4d496b311b984bd9841ef9c192b9c1c7?v=2eb1762e6b83440f8b0556c9917f86ca"
						target="_blank"
						rel="noopener noreferrer"
						className="text-orange-2 font-bold"
					>
						How does this work?
					</a>
				</Body>
			</div>
		</>
	);
};

const InfoSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
			stroke="#32A800"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11.25 11.25C11.4489 11.25 11.6397 11.329 11.7803 11.4697C11.921 11.6103 12 11.8011 12 12V15.75C12 15.9489 12.079 16.1397 12.2197 16.2803C12.3603 16.421 12.5511 16.5 12.75 16.5"
			stroke="#32A800"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11.625 9C12.2463 9 12.75 8.49632 12.75 7.875C12.75 7.25368 12.2463 6.75 11.625 6.75C11.0037 6.75 10.5 7.25368 10.5 7.875C10.5 8.49632 11.0037 9 11.625 9Z"
			fill="#32A800"
		/>
	</svg>
);

interface IBottomContent {
	txStatus: string;
	data: {
		type: "BAKE" | "BURN";
		value: string;
		isSafe?: boolean;
	};
	hash: `0x${string}` | null;
	newSupply(amount: string): number | null;
}

const BottomContent = ({ txStatus, data, hash, newSupply }: IBottomContent) => {
	if (txStatus === "PREPARED") {
		return (
			<ModalAdviceText>
				{modalAdviceText(data.type, txStatus)}
			</ModalAdviceText>
		);
	}

	if (txStatus === "CONFIRMED" && data.type === "BAKE") {
		return (
			<>
				<div className="lifted-button-container w-full mt-4">
					<LiftedButton
						onClick={() => {
							window.open(
								`https://www.curve.finance/dex/xdai/pools/factory-stable-ng-15/swap/`,
								"_blank"
							);
						}}
					>
						<span className="flex items-center justify-center">
							Earn with $BREAD on{" "}
							<Image
								src="/curve-logo.png"
								alt="curve logo"
								width={20}
								height={20}
								className="mx-1"
							/>{" "}
							Curve
						</span>
					</LiftedButton>
				</div>
				<ShareButtons newSupply={newSupply(data.value)} />
				<AddTokenButton className="mt-4" />
			</>
		);
	}

	if (txStatus !== "SAFE_SUBMITTED" && data.type !== "BURN")
		return <ExplorerLink to={`https://gnosisscan.io/tx/${hash}`} />;

	return null;
};

const BendFarcastSvg = () => (
	<svg
		width="24"
		height="23"
		viewBox="0 0 24 23"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8.03213 22.2754H0.143698V21.4132C0.143698 21.0163 0.465435 20.6946 0.862286 20.6946H1.00598V19.8323C1.00598 19.4355 1.32769 19.1138 1.72454 19.1138V6.32334H0.934135L0 3.16165H4.16767V0H19.8323V3.16165H24L23.0659 6.32334H22.2755V19.1138C22.6723 19.1138 22.994 19.4355 22.994 19.8323V20.6946H23.1377C23.5346 20.6946 23.8563 21.0163 23.8563 21.4132V22.2754H15.9767V21.4132C15.9767 21.0163 16.2985 20.6946 16.6953 20.6946H16.839V19.8323C16.839 19.4437 17.1475 19.1272 17.5329 19.1142V12.0718C17.2788 9.25182 14.8862 7.04189 12 7.04189C9.11381 7.04189 6.72122 9.25182 6.46707 12.0718V19.1139C6.85661 19.1223 7.16984 19.4408 7.16984 19.8323V20.2635V20.6946H7.31354C7.71039 20.6946 8.03213 21.0163 8.03213 21.4132V22.2754Z"
			fill="#1B201A"
		/>
	</svg>
);
