import { formatUnits, Hex } from "viem";
import {
  ModalContent,
  // ModalHeading
} from "../LPModalUI";
import {
  // ModalAdviceText,
  // ModalContainer,
  // ModalContent,
  ModalHeading,
  // transactionIcons,
  // TransactionValue,
} from "../ModalUI";
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
import { UnlockVPRate, ValueText, WXDaiBreadIcon } from "./VPRate";
import { StatusBadge } from "./Locking/LockingTransaction";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { Body, LiftedButton } from "@breadcoop/ui";
import {
  ArrowCounterClockwiseIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/ssr";

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

  const handleRetry = () => {
    // Reset to idle state to allow retry
    withdrawDispatch({
      type: "RESET",
    });
  };

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
    chainId: chainConfig.ID,
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
      <ModalContent className="!gap-2">
        <StatusBadge
          variant="unlock"
          status={
            withdrawState.status === "confirmed"
              ? "complete"
              : withdrawState.status === "reverted"
              ? "reverted"
              : "in-progress"
          }
        />
        {withdrawState.status !== "confirmed" && (
          <>
            <UnlockVPRate value={modalState.parsedValue} />
            <div className="border-l-4 border-system-warning shadow-md p-[20px] flex flex-col items-center gap-4">
              <Body>
                By unlocking your LP tokens you will not be eligible to receive
                voting power within the Bread Coop network in future voting
                cycles.
              </Body>
            </div>
          </>
        )}
        {withdrawState.status === "idle" && (
          <Body className="text-surface-grey">
            Press ‘Unlock LP tokens’ to execute the transaction
          </Body>
        )}
        {withdrawState.status === "submitted" && (
          <Body>Awaiting on-chain confirmation...</Body>
        )}
        {withdrawState.status === "reverted" && (
          <Body className="text-status-error">
            Transaction failed. Please try again.
          </Body>
        )}
        {(() => {
          if (withdrawState.status === "confirmed")
            return (
              <>
                <UnlockingSuccess
                  value={modalState.parsedValue}
                  explorerLink={`${chainConfig.EXPLORER}/tx/${withdrawState.txHash}`}
                />
                <div className="w-full">
                  <LiftedButton
                    preset="secondary"
                    onClick={() => {
                      setModal(null);
                    }}
                    disabled={isWalletOpen}
                    width="full"
                  >
                    Return to vault page
                  </LiftedButton>
                </div>
              </>
            );
          if (withdrawState.status === "submitted")
            return (
              <div className="w-full">
                <LiftedButton onClick={() => {}} disabled={true} width="full">
                  Unlocking...
                </LiftedButton>
              </div>
            );
          if (withdrawState.status === "reverted")
            return (
              <div className="w-full">
                <LiftedButton
                  onClick={() => {
                    if (!contractWriteWrite) return;
                    handleRetry();
                    setIsWalletOpen(true);
                    contractWriteWrite(prepareWrite.data!.request);
                  }}
                  disabled={isWalletOpen}
                  width="full"
                  leftIcon={<ArrowCounterClockwiseIcon size={24} />}
                >
                  Try again
                </LiftedButton>
              </div>
            );
          return (
            <div className="w-full">
              <LiftedButton
                onClick={() => {
                  if (!contractWriteWrite) return;
                  setIsWalletOpen(true);
                  contractWriteWrite(prepareWrite.data!.request);
                }}
                disabled={isWalletOpen}
                width="full"
              >
                Unlock LP tokens
              </LiftedButton>
            </div>
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
		<div className="w-full p-6 pb-0 flex flex-col items-center gap-4">
			<div className="w-auto border border-surface-ink flex items-center gap-2 px-2 mx-auto bg-paper-main">
				<WXDaiBreadIcon />
				<ValueText className="flex items-center justify-center pt-1">
					<span
						className="w-full max-w-[7.2rem] truncate mr-1.5"
						title={tokenAmount}
					>
						{tokenAmount}
					</span>{" "}
					<span className="shrink-0">LP TOKENS</span>
				</ValueText>
			</div>
			<ExternalLink href={explorerLink}>
				<LiftedButton preset="stroke" className="h-8">
					<span className="flex items-center gap-2">
						View receipt on Gnosisscan
						<ArrowUpRightIcon
							size={24}
							className="text-primary-orange"
						/>
					</span>
				</LiftedButton>
			</ExternalLink>
		</div>
	);
}
