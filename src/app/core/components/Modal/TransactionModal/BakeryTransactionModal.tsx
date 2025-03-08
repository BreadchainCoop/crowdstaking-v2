import {
  ModalAdviceText,
  ModalContainer,
  ModalContent,
  ModalHeading,
  ShareButtons,
  transactionIcons,
  TransactionValue,
} from "../ModalUI";
import { TTransactionData, TTransactionStatus } from "../../../context/TransactionsContext/TransactionsReducer";
import {
  TokenLabelContainer,
  TokenLabelText,
} from "@/app/bakery/components/Swap/SwapUI";
import { BreadIcon } from "../../Icons/TokenIcons";
import { ExplorerLink } from "../../ExplorerLink";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { BakeryTransactionModalState } from "@/app/core/context/ModalContext";
import { ReactNode } from "react";

function makeHeaderText(modalType: "BAKE" | "BURN", status: TTransactionStatus) {
  if (modalType === "BAKE") {
    if (status === "CONFIRMED") {
      return "Buns are out!"
    } else {
      return "Baking Bread"
    }
  } else {
    return "Burning Bread"
  }
}

const modalAdviceText: {
  [key in TTransactionStatus]: string;
} & { PREPARED: string } = {
  PREPARED: "Please confirm transaction in your wallet",
  SUBMITTED: "Waiting for on-chain confimation",
  SAFE_SUBMITTED: "Safe Transaction Submitted",
  CONFIRMED: "You have successfully baked",
  REVERTED: "Transaction Reverted",
};

export function BakeryTransactionModal({
  modalState,
}: {
  modalState: BakeryTransactionModalState;
}) {
  const { transactionsState } = useTransactions();

  const transaction = transactionsState.new
    ? {
      status: "PREPARED",
      data: transactionsState.new,
      hash: null,
    }
    : transactionsState.submitted.find(
      (transaction) =>
        (transaction.hash === modalState.hash &&
          transaction.data.type === "BAKE") ||
        transaction.data.type === "BURN"
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

  let bottomContent: ReactNode
  if (transaction.status === 'PREPARED') {
    bottomContent = <ModalAdviceText>
      {modalAdviceText[transaction.status]}
    </ModalAdviceText>
  } else if (transaction.status === 'CONFIRMED') {
    bottomContent = <>
      <ModalAdviceText>{modalAdviceText[txStatus]}</ModalAdviceText>
      <ShareButtons bakeValue={transaction.data.value} />
    </>
  } else {
    bottomContent = <>
      <ModalAdviceText>{modalAdviceText[txStatus]}</ModalAdviceText>
      {transaction.status !== "SAFE_SUBMITTED" && (
        <ExplorerLink
          to={`https://gnosisscan.io/tx/${transaction.hash}`}
        />
      )}
    </>
  }

  return (
    <ModalContainer>
      <ModalHeading>{makeHeaderText(transaction.data.type, txStatus)}</ModalHeading>
      <ModalContent>
        {transactionIcons[txStatus]}
        <div className="flex gap-2 items-center justify-center">
          <TransactionValue
            value={transaction.data.value ? transaction.data.value : "0"}
          />
          <TokenLabelContainer>
            <BreadIcon />
            <TokenLabelText>BREAD</TokenLabelText>
          </TokenLabelContainer>
        </div>
        {bottomContent}
      </ModalContent>
    </ModalContainer>
  );
}
