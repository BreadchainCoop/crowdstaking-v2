import { useEffect, useState } from "react";
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
import { useModal, VoteModalState } from "@/app/core/context/ModalContext";
import { LiftedButton } from "@breadcoop/ui";

// Some wallets (eg. ERC-4337 smart-contract wallets) return a userOp hash
// instead of a regular tx hash, which never resolves via the standard
// receipt watcher. Rather than spin forever, surface a fallback after a
// while so the user isn't stuck staring at a spinner.
const SUBMITTED_TIMEOUT_MS = 45_000;

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
	SUBMITTED: "Waiting for on-chain confirmation",
	SAFE_SUBMITTED: "Safe Transaction Submitted",
	CONFIRMED: "You have succesfully voted",
	REVERTED: "Your vote did not go through, please try again",
};

export function VoteTransactionModal({
	modalState,
}: {
	modalState: VoteModalState;
}) {
	const { setModal } = useModal();
	const { transactionsState } = useTransactions();

	const transaction = transactionsState.new
		? {
				status: "PREPARED",
				hash: null,
		  }
		: transactionsState.submitted.find(
				(transaction) => transaction.hash === modalState.hash
		  );

	const txStatus = transaction?.status as TTransactionStatus | undefined;
	const txHash = transaction?.hash;

	const [isTakingLong, setIsTakingLong] = useState(false);

	useEffect(() => {
		if (txStatus !== "SUBMITTED") {
			setIsTakingLong(false);
			return;
		}

		const timer = setTimeout(() => setIsTakingLong(true), SUBMITTED_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [txStatus, txHash]);

	if (!transaction)
		throw new Error("Transaction modal requires a transaction!");

	const status = transaction.status as TTransactionStatus;
	const hash = transaction.hash;

	const closeModal = () => setModal(null);

	const showCloseButton =
		status === "CONFIRMED" || (status === "SUBMITTED" && isTakingLong);
	// Safe transactions use a Safe tx hash, not an on-chain tx hash, so an
	// explorer link for it would point nowhere useful.
	const showExplorerLink = !!hash && status !== "SAFE_SUBMITTED";

	return (
		<ModalContainer>
			<ModalHeading>{modalHeaderText[status]}</ModalHeading>
			<ModalContent>
				{transactionIcons[status]}
				{transaction.status === "PREPARED" ? (
					<ModalAdviceText>
						{modalAdviceText[transaction.status]}
					</ModalAdviceText>
				) : (
					<>
						<ModalAdviceText>
							{modalAdviceText[status]}
						</ModalAdviceText>
						{status === "SUBMITTED" && isTakingLong && (
							<ModalAdviceText>
								This is taking longer than expected. Your vote may
								still be processing on-chain — you can check its
								status below or close this window and check back
								later.
							</ModalAdviceText>
						)}
						{showExplorerLink && (
							<ExplorerLink
								to={`https://gnosisscan.io/tx/${hash}`}
							/>
						)}
						<div className="mt-6 w-full">
							{showCloseButton ? (
								<div className="lifted-button-container">
									<LiftedButton preset="secondary" onClick={closeModal}>
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
