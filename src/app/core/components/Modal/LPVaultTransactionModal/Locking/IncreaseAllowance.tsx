import { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import Button from "@/app/core/components/Button";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { LockingAllowance, LockingEvent } from "./lockingReducer";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { getConfig } from "@/chainConfig";
import { ERC20_ABI } from "@/abi";

export function IncreaseAllowance({
  user,
  lockingState,
  lockingDispatch,
}: {
  user: TUserConnected;
  lockingState: LockingAllowance;
  lockingDispatch: (value: LockingEvent) => void;
}) {
  const { transactionsDispatch, transactionsState } = useTransactions();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const chainConfig = getConfig(user.chain.id);

  useEffect(() => {
    transactionsDispatch({
      type: "NEW",
      payload: {
        data: { type: "LP_VAULT_ALLOWANCE", transactionType: "LOCK" },
      },
    });
  }, [transactionsDispatch]);

  const {
    status: prepareWriteStatus,
    error: prepareWriteError,
    config: prepareWriteConfig,
  } = usePrepareContractWrite({
    address: chainConfig.BUTTER.address,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [
      chainConfig.BUTTERED_BREAD.address,
      lockingState.depositAmount - lockingState.allowance,
    ],
  });

  useEffect(() => {
    if (prepareWriteStatus === "error") {
      console.log(prepareWriteError);
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
    }
    if (contractWriteStatus === "error") {
      setIsWalletOpen(false);
    }
  }, [
    transactionsDispatch,
    contractWriteStatus,
    contractWriteData,
    lockingDispatch,
  ]);

  useEffect(() => {
    if (lockingState.status !== "allowance_transaction_submitted") return;
    const tx = transactionsState.submitted.find(
      (t) => t.hash === lockingState.txHash
    );
    if (tx?.status === "REVERTED") {
      lockingDispatch({ type: "TRANSACTION_REVERTED" });
    }
  }, [transactionsState, lockingState, lockingDispatch]);

  if (lockingState.status === "allowance_transaction_submitted") {
    return (
      <Button onClick={() => {}} fullWidth disabled>
        Confirming...
      </Button>
    );
  }

  if (lockingState.status === "allowance_transaction_reverted") {
    return <div>reverted!</div>;
  }

  return (
    <Button
      onClick={() => {
        if (!contractWriteWrite) return;
        contractWriteWrite();
        setIsWalletOpen(true);
      }}
      disabled={isWalletOpen}
      fullWidth
    >
      Confirm transaction
    </Button>
  );
}
