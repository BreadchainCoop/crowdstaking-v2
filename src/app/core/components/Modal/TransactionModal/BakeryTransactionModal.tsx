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
function makeHeaderText(
  modalType: "BAKE" | "BURN",
  status: TTransactionStatus
) {
  if (modalType === "BAKE") {
    if (status === "CONFIRMED") {
      return "Buns are out!";
    } else {
      return "Baking Bread";
    }
  } else {
    return "Burning Bread";
  }
}

function modalAdviceText(
  modalType: "BAKE" | "BURN",
  status: TTransactionStatus
) {
  const text = {
    PREPARED: "Please confirm transaction in your wallet",
    SUBMITTED: "Waiting for on-chain confimation",
    SAFE_SUBMITTED: "Safe Transaction Submitted",
    CONFIRMED:
      modalType === "BAKE" ? "You successfully baked" : "Transaction Confirmed",
    REVERTED: "Transaction Reverted",
  };
  return text[status];
}

function ShareButtons({ newSupply }: { newSupply: number | null }) {
  function makeText(platform: "X" | "Warpcast") {
    return `I just baked some BREAD to help fund on-chain post-capitalism thanks to ${
      platform === "X" ? "@breadchain_" : "breadchain.xyz"
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
    <div className="w-full flex flex-col gap-4">
      <Button
        fullWidth={true}
        size="large"
        variant="secondary"
        onClick={shareOnX}
        disabled={newSupply === null}
      >
        Share on{" "}
        <img
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
        Share on{" "}
        <img
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
  const { data: APY } = useVaultAPY();
  const { BREAD } = useTokenBalances();
  const { data: supply } = useRefetchOnBlockChange(
    BREAD_ADDRESS,
    ERC20_ABI,
    "totalSupply",
    []
  );

  const { transactionsState } = useTransactions();
  const { data: currentBlockNumberData } = useBlockNumber({ watch: true });
  const { data: startingBlockNumber } = useBlockNumber();
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

    return Number(Number(amount).toFixed()) + parseInt(formatUnits(supply, 18));
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

  let middleContent: ReactNode;
  if (transaction.status === "CONFIRMED" && transaction.data.type === "BAKE") {
    middleContent = (
      <>
        <BakedBreadCoopInfo
          txHash={transaction.hash!}
          pastBreadCoop={pastBreadCoop}
          additionalBreadCoop={additionalBreadCoop}
          totalBreadCoop={totalBreadCoop}
        />
        <div className="mt-2 border border-status-success flex items-start justify-start rounded-xl p-4">
          <div className="text-ultra-white mr-2">
            <InfoBoxSvg />
          </div>
          <p className="text-breadgray-rye dark:text-breadgray-light-grey">
            Baking $BREAD increases crucial funding for our post-capitalist
            cooperatives.{" "}
            <a
              href="https://breadchain.notion.site/4d496b311b984bd9841ef9c192b9c1c7?v=2eb1762e6b83440f8b0556c9917f86ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-breadpink-shaded font-semibold border-b-2 border-dotted border-current"
            >
              How does this work?
            </a>
          </p>
        </div>
      </>
    );
  }

  let bottomContent: ReactNode;
  if (transaction.status === "PREPARED") {
    bottomContent = (
      <ModalAdviceText>
        {modalAdviceText(transaction.data.type, transaction.status)}
      </ModalAdviceText>
    );
  } else if (
    transaction.status === "CONFIRMED" &&
    transaction.data.type === "BAKE"
  ) {
    bottomContent = (
      <>
        <ShareButtons newSupply={newSupply(transaction.data.value)} />
        <AddTokenButton className="!bg-transparent border-0" />
      </>
    );
  } else {
    bottomContent = (
      <>
        {transaction.status !== "SAFE_SUBMITTED" && (
          <ExplorerLink to={`https://gnosisscan.io/tx/${transaction.hash}`} />
        )}
      </>
    );
  }

  return (
    <ModalContainer>
      <ModalHeading>
        {makeHeaderText(transaction.data.type, txStatus)}
      </ModalHeading>
      <ModalContent>
        {transactionIcons[txStatus]}
        {transaction.status === "CONFIRMED" && (
          <ModalAdviceText>
            {modalAdviceText(transaction.data.type, txStatus)}
          </ModalAdviceText>
        )}
        <div
          className={`${
            transaction.status === "CONFIRMED" ? "mb-4" : ""
          } flex gap-2 items-center justify-center`}
        >
          {transaction.status === "CONFIRMED" &&
            transaction.data.type === "BAKE" && (
              <span>
                <BreadIcon />
              </span>
            )}
          <TransactionValue
            value={transaction.data.value ? transaction.data.value : "0"}
          />
          {transaction.data.type !== "BAKE" && (
            <TokenLabelContainer>
              <BreadIcon />
              <TokenLabelText>BREAD</TokenLabelText>
            </TokenLabelContainer>
          )}
        </div>
        {middleContent}
        {bottomContent}
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
    <div className="w-full border border-breadgray-rye rounded-xl py-4 px-4">
      <BakedBreadCoopInfoItem
        label="Past annual Bread Coop funding"
        amount={pastBreadCoop}
        type="past"
      />
      <BakedBreadCoopInfoItem
        label="Additional annual Bread Coop funding"
        amount={additionalBreadCoop}
        type="additional"
      />
      <BakedBreadCoopInfoItem
        label="Total annual Bread Coop funding"
        amount={totalBreadCoop}
        type="total"
      />
      <p className="text-center mt-4 max-w-max mx-auto">
        <a
          href={`https://gnosisscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center justify-center gap-1 text-breadpink-shaded"
        >
          <span className="mr-1">View on Gnosisscan</span>
          <span>
            <LinkIcon />
          </span>
        </a>
      </p>
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
      <p className="text-sm leading-normal text-breadgray-rye dark:text-breadgray-grey font-normal w-full max-w-72">
        {label}
      </p>
      <p className="flex items-center justify-start flex-1">
        <span className="mr-2">
          <BreadIcon />
        </span>
        <div className="inline-flex items-center justify-center">
          <span
            className={`inline-flex items-center justify-center ${
              type === "additional" ? "bread-pink-text-gradient" : ""
            }`}
          >
            {type === "additional" && <span>+</span>}
            <span className="px-1">{renderFormattedDecimalNumber(amount)}</span>
          </span>
        </div>
      </p>
    </div>
  );
};

const InfoBoxSvg = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.99951 3H4.99951V21H2.99951V3ZM18.9998 3.00003H5V5.00003H18.9998V19H5V21H19V21H20.9998V3H18.9998V3.00003ZM10.9998 9.00009H12.9998V7.00009H10.9998V9.00009ZM12.9998 17H10.9998V11H12.9998V17Z"
      fill="currentcolor"
    />
  </svg>
);
