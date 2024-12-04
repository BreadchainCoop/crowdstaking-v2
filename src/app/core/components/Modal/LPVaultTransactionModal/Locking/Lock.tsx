import { useEffect, useState } from "react";
import Button from "@/app/core/components/Button";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { LockingDeposit, LockingEvent } from "./lockingReducer";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { getConfig } from "@/chainConfig";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BUTTERED_BREAD_ABI } from "@/abi";
import { useModal } from "@/app/core/context/ModalContext";
import { formatUnits } from "viem";

import { LinkIcon } from "../../../Icons/LinkIcon";
import { LockVPRate } from "../VPRate";
import { ExternalLink } from "@/app/core/components/ExternalLink";

export function Lock({
  user,
  lockingState,
  lockingDispatch,
}: {
  user: TUserConnected;
  lockingState: LockingDeposit;
  lockingDispatch: (value: LockingEvent) => void;
}) {
  const { transactionsState, transactionsDispatch } = useTransactions();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const chainConfig = getConfig(user.chain.id);
  const { setModal } = useModal();

  useEffect(() => {
    transactionsDispatch({
      type: "NEW",
      payload: {
        data: { type: "LP_VAULT_DEPOSIT", transactionType: "LOCK" },
      },
    });
  }, [transactionsDispatch]);

  const {
    status: prepareWriteStatus,
    error: prepareWriteError,
    config: prepareWriteConfig,
  } = usePrepareContractWrite({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "deposit",
    args: [chainConfig.BUTTER.address, lockingState.depositAmount],
  });

  useEffect(() => {
    if (prepareWriteStatus === "error") {
      console.log({ prepareWriteError });
    }
  }, [prepareWriteStatus, prepareWriteError]);

  const {
    write: contractWriteWrite,
    status: contractWriteStatus,
    data: contractWriteData,
  } = useContractWrite(prepareWriteConfig);

  useEffect(() => {
    if (contractWriteStatus === "success" && contractWriteData) {
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: contractWriteData.hash },
      });
      lockingDispatch({
        type: "TRANSACTION_SUBMITTED",
        payload: { hash: contractWriteData.hash },
      });
      setIsWalletOpen(false);
    }
    if (contractWriteStatus === "error") {
      setIsWalletOpen(false);
    }
  }, [
    contractWriteStatus,
    contractWriteData,
    transactionsDispatch,
    lockingDispatch,
  ]);

  useEffect(() => {
    if (lockingState.status !== "deposit_transaction_submitted") return;
    const tx = transactionsState.submitted.find(
      (t) => t.hash === lockingState.txHash
    );
    if (tx?.status === "REVERTED") {
      lockingDispatch({ type: "TRANSACTION_REVERTED" });
    }
    if (tx?.status === "CONFIRMED") {
      console.log("deposit transaction confirmed!!");
      lockingDispatch({ type: "TRANSACTION_CONFIRMED" });
    }
  }, [transactionsState, lockingState, lockingDispatch]);

  if (lockingState.status === "deposit_transaction_confirmed") {
    return (
      <>
        <LockSuccess
          value={lockingState.depositAmount}
          explorerLink={`${chainConfig.EXPLORER}/tx/${lockingState.txHash}`}
        />
        <Button
          onClick={() => {
            setModal(null);
          }}
          disabled={isWalletOpen}
          fullWidth
        >
          Return to vault page
        </Button>
      </>
    );
  }

  if (lockingState.status === "deposit_transaction_reverted") {
    return <div>reverted!</div>;
  }

  if (lockingState.status === "deposit_transaction_submitted") {
    return (
      <Button onClick={() => {}} disabled fullWidth>
        Locking...
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        if (!contractWriteWrite) return;
        setIsWalletOpen(true);
        contractWriteWrite();
      }}
      disabled={isWalletOpen}
      fullWidth
    >
      Lock LP Tokens
    </Button>
  );
}

function LockSuccess({
  value,
  explorerLink,
}: {
  value: bigint;
  explorerLink: string;
}) {
  const tokenAmount = formatUnits(value, 18);
  const vpAmount = tokenAmount;

  return (
    <div className="rounded-xl border-2 border-status-success p-6 flex flex-col items-center gap-4">
      <p className="text-center">
        You successfully locked <strong>{tokenAmount} LP tokens</strong>. In the
        next voting cycles you will have a{" "}
        <strong>voting power of {vpAmount}</strong>.
      </p>
      <LockVPRate value={value} />
      <p className="text-status-warning text-xs text-center">
        You can unlock your LP tokens anytime.
      </p>
      <ExternalLink href={explorerLink}>
        <div className="text-breadpink-shaded font-medium text-sm flex items-center gap-2">
          View on Explorer
          <LinkIcon />
        </div>
      </ExternalLink>
    </div>
  );
}
