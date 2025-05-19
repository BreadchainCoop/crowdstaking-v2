import { ReactNode, useEffect, useReducer } from "react";
import clsx from "clsx";
import { getChain } from "@/chainConfig";
import { ERC20_ABI } from "@/abi";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { LPVaultTransactionModalState } from "@/app/core/context/ModalContext";
import {
  ModalContent,
  ModalHeading,
  StatusMessage,
  StatusMessageSmall,
} from "../../LPModalUI";
import { lockingReducer } from "./lockingReducer";
import { CheckIcon } from "../../../Icons/CheckIcon";
import { IncreaseAllowance } from "./IncreaseAllowance";
import { Lock } from "./Lock";
import { formatUnits } from "viem";
import { LockVPRate } from "../VPRate";
import { Spinner } from "../../../Icons/Spinner";

export function LockingTransaction({
  user,
  modalState,
}: {
  user: TUserConnected;
  modalState: LPVaultTransactionModalState;
}) {
  const chainConfig = getChain(user.chain.id);
  const [lockingState, lockingDispatch] = useReducer(lockingReducer, {
    depositAmount: modalState.parsedValue,
    status: "loading",
  });

  const { status: userAllowanceStatus, data: userAllowanceData } =
    useRefetchOnBlockChangeForUser(
      user.address,
      chainConfig.BUTTER.address,
      ERC20_ABI,
      "allowance",
      [user.address, chainConfig.BUTTERED_BREAD.address]
    );

  useEffect(() => {
    if (userAllowanceStatus === "success") {
      lockingDispatch({
        type: "ALLOWANCE_UPDATE",
        payload: { allowance: userAllowanceData as bigint },
      });
    }
  }, [userAllowanceStatus, userAllowanceData]);

  return (
    <>
      <ModalHeading>Locking LP Tokens</ModalHeading>
      <ModalContent>
        <StatusBadge
          variant={
            lockingState.status !== "deposit_transaction_confirmed"
              ? "in-progress"
              : "complete"
          }
        />

        {lockingState.status === "allowance_transaction_idle" && (
          <StatusMessage>
            Press ‘Confirm transaction’ to allow LP tokens to be locked.
          </StatusMessage>
        )}
        <div className="flex flex-col md:flex-row gap-4 md:gap-20">
          <div className="flex flex-col gap-2 flex-1">
            <TransactionStage
              status={
                !lockingState.status.includes("allowance_transaction")
                  ? "success"
                  : "pending"
              }
            >
              <span className="whitespace-nowrap">1. Token allowance</span>
            </TransactionStage>
            <StatusMessageSmall>
              {lockingState.status === "allowance_transaction_idle" &&
                "Please confirm the transaction"}
              {lockingState.status === "allowance_transaction_submitted" &&
                "Confirm the transaction..."}
              {lockingState.status.includes("deposit") &&
                "Token allowance granted!"}
            </StatusMessageSmall>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <TransactionStage
              status={
                !lockingState.status.includes("deposit_transaction")
                  ? "disabled"
                  : lockingState.status === "deposit_transaction_confirmed"
                  ? "success"
                  : "pending"
              }
            >
              2. Token locking
            </TransactionStage>
            <StatusMessageSmall>
              {lockingState.status.includes("allowance") &&
                "Waiting for next action..."}
              {lockingState.status === "deposit_transaction_idle" &&
                "Lock your LP tokens"}
              {lockingState.status === "deposit_transaction_submitted" &&
                "Locking your LP tokens..."}
              {lockingState.status === "deposit_transaction_confirmed" &&
                formatUnits(lockingState.depositAmount, 18) +
                  " LP tokens successfully locked!"}
            </StatusMessageSmall>
          </div>
        </div>

        {lockingState.status !== "deposit_transaction_confirmed" && (
          <LockVPRate
            value={lockingState.depositAmount}
            status={lockingState.status}
          />
        )}
        {(() => {
          if (lockingState.status === "loading") {
            return "loading....";
          }
          if (
            lockingState.status === "allowance_transaction_idle" ||
            lockingState.status === "allowance_transaction_submitted" ||
            lockingState.status === "allowance_transaction_reverted"
          ) {
            return (
              <IncreaseAllowance
                user={user}
                lockingState={lockingState}
                lockingDispatch={lockingDispatch}
              />
            );
          }
          if (
            lockingState.status === "deposit_transaction_idle" ||
            lockingState.status === "deposit_transaction_submitted" ||
            lockingState.status === "deposit_transaction_confirmed" ||
            lockingState.status === "deposit_transaction_reverted"
          ) {
            return (
              <Lock
                user={user}
                lockingState={lockingState}
                lockingDispatch={lockingDispatch}
              />
            );
          }
        })()}
      </ModalContent>
    </>
  );
}

export function StatusBadge({
  variant,
}: {
  variant: "complete" | "in-progress";
}) {
  return (
    <span
      className={clsx(
        "rounded-full px-1 font-bold text-xs bg-opacity-10",
        variant === "in-progress" && "bg-status-success text-status-success",
        variant === "complete" && "bg-breadpink-shaded text-breadpink-shaded"
      )}
    >
      {variant === "in-progress" && "In progress"}
      {variant === "complete" && "Complete"}
    </span>
  );
}

type TransactionStatus = "disabled" | "pending" | "success";

const stageIcons: {
  [key in TransactionStatus]: ReactNode;
} = {
  disabled: <DisabledIcon />,
  pending: <PendingIcon />,
  success: <SuccessIcon />,
};

function TransactionStage({
  status,
  children,
}: {
  status: TransactionStatus;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "px-1.5 py-1 flex gap-2 items-center dark:bg-breadgray-burnt rounded",
        status === "disabled" && "opacity-50"
      )}
    >
      {stageIcons[status]}
      <div className="dark:text-white font-bold">{children}</div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <span className="rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center border-status-success">
      <div className="size-full translate-y-0.5 text-status-success">
        <CheckIcon />
      </div>
    </span>
  );
}

function DisabledIcon() {
  return (
    <span className="rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center border-breadgray-toast" />
  );
}

function PendingIcon() {
  return (
    <div className="size-6 text-breadpink-shaded">
      <Spinner />
    </div>
  );
}
