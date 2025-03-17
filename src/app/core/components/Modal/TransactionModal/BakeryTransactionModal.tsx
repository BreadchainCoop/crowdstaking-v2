import {
  ModalAdviceText,
  ModalContainer,
  ModalContent,
  ModalHeading,
  transactionIcons,
  TransactionValue,
} from "../ModalUI";
import { TTransactionStatus } from "@/app/core//context/TransactionsContext/TransactionsReducer";
import {
  TokenLabelContainer,
  TokenLabelText,
} from "@/app/bakery/components/Swap/SwapUI";
import Button from "@/app/core/components/Button";
import { BreadIcon } from "../../Icons/TokenIcons";
import { ExplorerLink } from "../../ExplorerLink";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { BakeryTransactionModalState } from "@/app/core/context/ModalContext";
import { useContractRead } from "wagmi";
import { BREAD_ADDRESS } from "@/constants";
import { ERC20_ABI } from "@/abi";
import { ReactNode } from "react";
import { formatSupply } from "@/app/core/util/formatter";
import { formatUnits } from "viem";

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


function ShareButtons({ newSupply }: { newSupply: number | null }) {
  function makeText(platform: 'X' | 'Warpcast') {
    return `I just baked some BREAD to help fund on-chain post-capitalism thanks to ${platform === 'X' ? '@breadchain_' : 'breadchain.xyz'}!

I grew the bakery to ${newSupply ? formatSupply(newSupply) : ''} BREAD! \u{1F35E} \u{1F35E} \u{1F35E}

https://app.breadchain.xyz`
  }

  const xText = encodeURIComponent(makeText('X'))
  const wText = encodeURIComponent(makeText('Warpcast'))

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${xText}`, '_blank')
  }
  const shareOnW = () => {
    window.open(`https://warpcast.com/~/compose?text=${wText}`, '_blank')
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        fullWidth={true}
        size="large"
        variant="secondary"
        onClick={shareOnX}
        disabled={newSupply === null}
      >
        Share on <img
          className="inline ml-1"
          src="/x_logo_white.png"
          width={20}
          height={20}
          alt="X logo"
        />
      </Button>
      <Button
        fullWidth={true}
        size="large"
        variant="secondary"
        onClick={shareOnW}
        disabled={newSupply === null}
      >
        Share on <img
          className="inline ml-1"
          src="/warpcast_logo_round.png"
          width={20}
          height={20}
          alt="Warpcast logo"
        />
      </Button>

    </div>
  );
}


export function BakeryTransactionModal({
  modalState,
}: {
  modalState: BakeryTransactionModalState;
}) {
  const { data: supply } = useContractRead({
    address: BREAD_ADDRESS,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    watch: true,
    cacheTime: 6_000,
  });

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

  const newSupply = supply !== undefined ? Number(Number(transaction.data.value).toFixed()) + parseInt(formatUnits(supply, 18)) : null

  let bottomContent: ReactNode
  if (transaction.status === 'PREPARED') {
    bottomContent = <ModalAdviceText>
      {modalAdviceText[transaction.status]}
    </ModalAdviceText>
  } else if (transaction.status === 'CONFIRMED') {
    bottomContent = <>
      <ShareButtons newSupply={newSupply} />
      <div className="mb-1 h-0"></div>
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
        {transaction.status === 'CONFIRMED' && <ModalAdviceText>{modalAdviceText[txStatus]}</ModalAdviceText>}
        <div className={`${transaction.status === 'CONFIRMED' ? 'mb-4' : ''} flex gap-2 items-center justify-center`}>
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
