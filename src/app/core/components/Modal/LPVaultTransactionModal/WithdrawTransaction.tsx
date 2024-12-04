import { formatUnits, Hex } from "viem";
import Button from "../../Button";
import { ModalContent, ModalHeading, StatusMessage } from "../LPModalUI";
import { useEffect, useReducer, useState } from "react";
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

import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { withdrawReducer } from "./withdrawReducer";
import {
  PillContainer,
  UnlockVPRate,
  ValueText,
  WXDaiBreadIcon,
} from "./VPRate";
import { StatusBadge } from "./Locking/LockingTransaction";
import { LinkIcon } from "../../Icons/LinkIcon";
import { ExternalLink } from "@/app/core/components/ExternalLink";

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
        data: { type: "LP_VAULT_WITHDRAW", transactionType: "UNLOCK" },
      },
    });
  }, [transactionsDispatch]);

  const lockedBalance = useContractRead({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "accountToLPBalance",
    args: [user.address, chainConfig.BUTTER.address],
    watch: true,
  });

  const prepareWrite = usePrepareContractWrite({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "withdraw",
    args: [chainConfig.BUTTER.address, modalState.parsedValue],
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
      return t.hash === withdrawState.txHash;
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
        {withdrawState.status !== "confirmed" && (
          <>
            <UnlockVPRate value={modalState.parsedValue} />
            <p className="p-4 rounded-xl border-2 border-status-warning text-center">
              By unlocking your LP tokens you will not be eligible to receive
              voting power within the Breadchain cooperative network in future
              voting cycles.
            </p>
          </>
        )}
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
              <>
                <UnlockingSuccess
                  value={modalState.parsedValue}
                  explorerLink={`${chainConfig.EXPLORER}/tx/${withdrawState.txHash}`}
                />
                <Button
                  onClick={() => {
                    setModal(null);
                  }}
                  fullWidth
                >
                  Return to vault page
                </Button>
              </>
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

function UnlockingSuccess({
  value,
  explorerLink,
}: {
  value: bigint;
  explorerLink: string;
}) {
  const tokenAmount = formatUnits(value, 18);

  return (
    <div className="w-full rounded-xl border-2 border-status-success p-6 flex flex-col items-center gap-4">
      <PillContainer>
        <WXDaiBreadIcon />
        <ValueText>{tokenAmount} LP TOKENS</ValueText>
      </PillContainer>
      <p className="text-center">Successfully unlocked!</p>
      <ExternalLink href={explorerLink}>
        <div className="text-breadpink-shaded font-medium text-sm flex items-center gap-2">
          View on Explorer
          <LinkIcon />
        </div>
      </ExternalLink>
    </div>
  );
}
