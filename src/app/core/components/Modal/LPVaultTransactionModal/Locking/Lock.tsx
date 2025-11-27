import { useEffect, useState } from "react";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { LockingDeposit, LockingEvent } from "./lockingReducer";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { getChain } from "@/chainConfig";
import { useWriteContract, useSimulateContract } from "wagmi";
import { BUTTERED_BREAD_ABI } from "@/abi";
import { useModal } from "@/app/core/context/ModalContext";
import { formatUnits } from "viem";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";
import { Body, LiftedButton } from "@breadcoop/ui";
import { LockVPRate } from "../VPRate";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";

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
  const chainConfig = getChain(user.chain.id);
  const { setModal } = useModal();
  const isMobile = useIsMobile();

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
    data: prepareWriteConfig,
  } = useSimulateContract({
    address: chainConfig.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "deposit",
    args: [chainConfig.BUTTER.address, lockingState.depositAmount],
    chainId: chainConfig.ID,
  });

  useEffect(() => {
    if (prepareWriteStatus === "error") {
      console.log({ prepareWriteError });
    }
  }, [prepareWriteStatus, prepareWriteError]);

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
      lockingDispatch({
        type: "TRANSACTION_SUBMITTED",
        payload: { hash: contractWriteData },
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
          status={contractWriteStatus}
        />
        <ExternalLink
          href={`${chainConfig.EXPLORER}/tx/${lockingState.txHash}`}
        >
          <LiftedButton
            preset="stroke"
            onClick={() => {
              setModal(null);
            }}
            className="h-[32px]"
            disabled={isWalletOpen}
          >
            <span className="flex items-center gap-2">
              View receipt on Gnosisscan
              <ArrowUpRightIcon size={24} className="text-primary-orange" />
            </span>
          </LiftedButton>
        </ExternalLink>
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
  }

  if (lockingState.status === "deposit_transaction_reverted") {
    return <div>reverted!</div>;
  }

  if (lockingState.status === "deposit_transaction_submitted") {
    return (
      <div className="lifted-button-container">
        <LiftedButton onClick={() => {}} disabled width="full">
          Locking...
        </LiftedButton>
      </div>
    );
  }

  return (
    <div className="w-full">
      <LiftedButton
        onClick={() => {
          if (!contractWriteWrite) return;
          setIsWalletOpen(true);
          contractWriteWrite(prepareWriteConfig!.request);
        }}
        disabled={isWalletOpen}
        width="full"
      >
        Lock LP Tokens
      </LiftedButton>
    </div>
  );
}

function LockSuccess({ value, status }: { value: bigint; status: string }) {
  const tokenAmount = formatUnits(value, 18);
  const vpAmount = tokenAmount;

  return (
    <div>
      <div className="w-3/4 mx-auto">
        <LockVPRate value={value} status={status} />
      </div>
      <div className="border-l-4 border-system-green shadow-md p-[20px] flex flex-col items-center gap-4">
        <Body>
          You successfully locked <strong>{tokenAmount} LP tokens</strong>. In
          the next voting cycles you will have a{" "}
          <strong>voting power of {vpAmount}</strong>.{" "}
          <span className="text-system-warning">
            You can unlock your LP tokens anytime.
          </span>
        </Body>
      </div>
    </div>
  );
}
