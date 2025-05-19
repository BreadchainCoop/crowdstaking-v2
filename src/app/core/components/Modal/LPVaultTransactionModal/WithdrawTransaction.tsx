import { formatUnits } from "viem";
import Button from "../../Button";
import { ModalContent, ModalHeading, StatusMessage } from "../LPModalUI";
import { useEffect, useReducer, useState } from "react";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";
import { useWriteContract, useSimulateContract } from "wagmi";
import { BUTTERED_BREAD_ABI } from "@/abi";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import {
  LPVaultTransactionModalState,
  useModal,
} from "@/app/core/context/ModalContext";
import { getChain } from "@/chainConfig";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  const chainConfig = getChain(user.chain.id);
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

  const { status: lockedBalanceStatus, data: lockedBalance } =
    useRefetchOnBlockChangeForUser(
      user.address,
      chainConfig.BUTTERED_BREAD.address,
      BUTTERED_BREAD_ABI,
      "accountToLPBalance",
      [user.address, chainConfig.BUTTER.address]
    );

  const prepareWrite = useSimulateContract({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "withdraw",
    args: [chainConfig.BUTTER.address, modalState.parsedValue],
    query: {
      enabled:
        lockedBalanceStatus === "success" &&
        modalState.parsedValue <= (lockedBalance as bigint),
    },
  });

  useEffect(() => {
    if (prepareWrite.status === "error") {
      console.log(prepareWrite.error);
    }
  }, [prepareWrite]);

  const {
    writeContract: contractWriteWrite,
    status: contractWriteStatus,
    data: contractWriteData,
  } = useWriteContract();

  useEffect(() => {
    if (contractWriteStatus === "success" && contractWriteData) {
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: contractWriteData },
      });
      withdrawDispatch({
        type: "TRANSACTION_SUBMITTED",
        payload: { hash: contractWriteData },
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
                  fullWidth={isMobile}
                >
                  Return to vault page
                </Button>
              </>
            );
          if (withdrawState.status === "submitted")
            return (
              <Button onClick={() => {}} fullWidth={isMobile} disabled>
                Unlocking...
              </Button>
            );
          return (
            <Button
              onClick={() => {
                if (!contractWriteWrite) return;
                setIsWalletOpen(true);
                contractWriteWrite(prepareWrite.data!.request);
              }}
              disabled={isWalletOpen}
              fullWidth={isMobile}
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
    <div className="w-full rounded-xl border-2 border-status-success md:mx-24 p-6 flex flex-col items-center gap-4">
      <div className="w-auto">
        <PillContainer>
          <WXDaiBreadIcon />
          <ValueText>{tokenAmount} LP TOKENS</ValueText>
        </PillContainer>
      </div>
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
