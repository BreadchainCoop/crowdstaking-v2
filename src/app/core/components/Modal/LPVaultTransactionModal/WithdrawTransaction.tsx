import { formatUnits, Hex } from "viem";
import Button from "../../Button";
import { ModalContent, ModalHeading, StatusMessage } from "../LPModalUI";
import { ReactNode, useEffect, useMemo, useReducer, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { BUTTERED_BREAD_ABI } from "@/abi";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import {
  LPVaultTransactionModalState,
  useModal,
} from "@/app/core/context/ModalContext";
import { getConfig } from "@/chainConfig";
import { TTransaction } from "@/app/core/context/TransactionsContext/TransactionsReducer";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { withdrawReducer } from "./withdrawReducer";
import { WithdrawVPRate } from "./VPRate";
import { StatusBadge } from "./Locking/Locking";

export function WithdrawTransaction({
  user,
  modalState,
}: {
  user: TUserConnected;
  modalState: LPVaultTransactionModalState;
}) {
  const { transactionsState, transactionsDispatch } = useTransactions();
  const { setModal } = useModal();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const chainConfig = getConfig(user.chain.id);
  const [withdrawState, withdrawDispatch] = useReducer(withdrawReducer, {
    status: "idle",
  });

  useEffect(() => {
    transactionsDispatch({
      type: "NEW",
      payload: {
        data: { type: "LP_VAULT", transactionType: "UNLOCK" },
      },
    });
  }, [transactionsDispatch]);

  const lockedBalance = useContractRead({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "accountToLPBalance",
    args: [user.address, chainConfig.LP_TOKEN.address],
    watch: true,
  });

  const prepareWrite = usePrepareContractWrite({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "withdraw",
    args: [chainConfig.LP_TOKEN.address, modalState.parsedValue],
    enabled:
      lockedBalance.status === "success" &&
      modalState.parsedValue <= (lockedBalance.data as bigint),
  });

  useEffect(() => {
    if (prepareWrite.status === "error") {
      console.log(prepareWrite.error);
    }
  }, [prepareWrite]);

  const {
    write: contractWriteWrite,
    status: contractWriteStatus,
    data: contractWriteData,
  } = useContractWrite(prepareWrite.config);

  useEffect(() => {
    if (contractWriteStatus === "success" && contractWriteData) {
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: contractWriteData.hash },
      });
      withdrawDispatch({
        type: "TRANSACTION_SUBMITTED",
        payload: { hash: contractWriteData.hash },
      });
      setIsWalletOpen(false);
    }
    if (contractWriteStatus === "error") {
      setIsWalletOpen(false);
    }
  }, [contractWriteStatus, contractWriteData, transactionsDispatch]);

  useEffect(() => {
    if (withdrawState.status === "idle") return;
    const tx = transactionsState.submitted.find((t) => {
      return t.hash === withdrawState.hash;
    });
    if (!tx || tx.status === "SUBMITTED") return;
    withdrawDispatch({
      type:
        tx.status === "CONFIRMED"
          ? "TRANSACTION_CONFIRMED"
          : "TRANSACTION_REVERTED",
    });
  }, [transactionsState, withdrawState]);

  return (
    <>
      <ModalHeading>Unlocking LP Tokens</ModalHeading>
      <ModalContent>
        <StatusBadge
          variant={
            withdrawState.status === "confirmed" ? "complete" : "in-progress"
          }
        />
        <WithdrawVPRate value={modalState.parsedValue} />
        <p className="p-4 rounded-xl border-2 border-status-warning text-center">
          By unlocking your LP tokens you will not be eligible to receive voting
          power within the Breadchain cooperative network in future voting
          cycles.
        </p>
        {withdrawState.status === "idle" && (
          <StatusMessage>
            Press ‘Unlock LP tokens’ to execute the transaction
          </StatusMessage>
        )}
        {withdrawState.status === "submitted" && (
          <StatusMessage>Awaiting on-chain confirmation...</StatusMessage>
        )}
        {(() => {
          if (withdrawState.status === "confirmed")
            return (
              <Button
                onClick={() => {
                  setModal(null);
                }}
                fullWidth
              >
                Return to vault page
              </Button>
            );
          if (withdrawState.status === "submitted")
            return (
              <Button onClick={() => {}} fullWidth disabled>
                Unlocking...
              </Button>
            );
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
              Unlock LP tokens
            </Button>
          );
        })()}
      </ModalContent>
    </>
  );
}
