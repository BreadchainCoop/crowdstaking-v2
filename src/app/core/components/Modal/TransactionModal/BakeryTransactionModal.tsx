import {
  ModalAdviceText,
  ModalContainer,
  ModalContent,
  ModalHeading,
  transactionIcons,
  TransactionValue,
} from "../ModalUI";
import { TTransactionStatus } from "../../../context/TransactionsContext/TransactionsReducer";
import {
  TokenLabelContainer,
  TokenLabelText,
} from "@/app/bakery/components/Swap/SwapUI";
import { BreadIcon } from "../../Icons/TokenIcons";
import { ExplorerLink } from "../../ExplorerLink";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { BakeryTransactionModalState } from "@/app/core/context/ModalContext";

const modalHeaderText = {
  BAKE: "Baking Bread",
  BURN: "Burning Bread",
};

const modalAdviceText: {
  [key in TTransactionStatus]: string;
} & { PREPARED: string } = {
  PREPARED: "Please confirm transaction in your wallet",
  SUBMITTED: "Waiting for on-chain confimation",
  SAFE_SUBMITTED: "Safe Transaction Submitted",
  CONFIRMED: "Transaction Confirmed",
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
  return (
    <ModalContainer>
      <ModalHeading>{modalHeaderText[transaction.data.type]}</ModalHeading>
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
        {transaction.status === "PREPARED" ? (
          <ModalAdviceText>
            {modalAdviceText[transaction.status]}
          </ModalAdviceText>
        ) : (
          <>
            <ModalAdviceText>{modalAdviceText[txStatus]}</ModalAdviceText>
            {transaction.status !== "SAFE_SUBMITTED" && (
              <ExplorerLink
                to={`https://gnosisscan.io/tx/${transaction.hash}`}
              />
            )}
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
}
