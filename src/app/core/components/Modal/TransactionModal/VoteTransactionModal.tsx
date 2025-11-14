import {
	ModalAdviceText,
	ModalContainer,
	ModalContent,
	ModalHeading,
	transactionIcons,
	TransactionStatusCheck,
	TransactionStatusCross,
	TransactionStatusSpinner,
} from "../ModalUI";
import { TTransactionStatus } from "../../../context/TransactionsContext/TransactionsReducer";

import { ExplorerLink } from "../../ExplorerLink";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { VoteModalState } from "@/app/core/context/ModalContext";
import { LiftedButton } from "@breadcoop/ui";

const modalHeaderText: {
	[key in TTransactionStatus]: string;
} & { PREPARED: string } = {
	PREPARED: "Casting Vote",
	SUBMITTED: "Casting Vote",
	SAFE_SUBMITTED: "Casting Vote",
	CONFIRMED: "Vote casted",
	REVERTED: "Something went wrong",
};

const modalAdviceText: {
	[key in TTransactionStatus]: string;
} & { PREPARED: string } = {
	PREPARED: "Please confirm transaction in your wallet",
	SUBMITTED: "Waiting for on-chain confimation",
	SAFE_SUBMITTED: "Safe Transaction Submitted",
	CONFIRMED: "You have succesfully voted",
	REVERTED: "Your vote did not go through, please try again",
};

export function VoteTransactionModal({
	modalState,
}: {
	modalState: VoteModalState;
}) {
	const { transactionsState } = useTransactions();

	const transaction = transactionsState.new
		? {
				status: "PREPARED",
				hash: null,
		  }
		: transactionsState.submitted.find(
				(transaction) => transaction.hash === modalState.hash
		  );

	if (!transaction)
		throw new Error("Transaction modal requires a transaction!");

	const txStatus = transaction.status as TTransactionStatus;

	return (
		<ModalContainer>
			<ModalHeading>{modalHeaderText[txStatus]}</ModalHeading>
			<ModalContent>
				{transactionIcons[txStatus]}
				{transaction.status === "PREPARED" ? (
					<ModalAdviceText>
						{modalAdviceText[transaction.status]}
					</ModalAdviceText>
				) : (
					<>
						<ModalAdviceText>
							{modalAdviceText[txStatus]}
						</ModalAdviceText>
						{/* {transaction.hash && (
							<ExplorerLink
								to={`https://gnosisscan.io/tx/${transaction.hash}`}
							/>
						)} */}
						<div className="mt-6 w-full">
							{txStatus === "CONFIRMED" ? (
								<div className="lifted-button-container">
									<LiftedButton preset="secondary">
										Close
									</LiftedButton>
								</div>
							) : null}
						</div>
					</>
				)}
			</ModalContent>
		</ModalContainer>
	);
}
