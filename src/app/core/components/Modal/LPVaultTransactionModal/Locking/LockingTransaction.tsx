import { ReactNode, useEffect, useReducer } from "react";
import { useContractRead } from "wagmi";
import clsx from "clsx";

import { getConfig } from "@/chainConfig";
import { ERC20_ABI } from "@/abi";
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

export function LockingTransaction({
  user,
  modalState,
}: {
  user: TUserConnected;
  modalState: LPVaultTransactionModalState;
}) {
  const chainConfig = getConfig(user.chain.id);
  const [lockingState, lockingDispatch] = useReducer(lockingReducer, {
    depositAmount: modalState.parsedValue,
    status: "loading",
  });

  const { status: userAllowanceStatus, data: userAllowanceData } =
    useContractRead({
      address: chainConfig.LP_TOKEN.address,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [user.address, chainConfig.BUTTERED_BREAD.address],
      watch: true,
    });

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
        <div className="flex flex-col gap-2">
          <TransactionStage
            status={
              !lockingState.status.includes("allowance_transaction")
                ? "success"
                : "pending"
            }
          >
            1. Token allowance
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

        <div className="flex flex-col gap-2">
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
        {lockingState.status !== "deposit_transaction_confirmed" && (
          <LockVPRate value={lockingState.depositAmount} />
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

function TransactionStage({
  status,
  children,
}: {
  status: "disabled" | "pending" | "success";
  children: ReactNode;
}) {
  console.log({ children, status });
  return (
    <div
      className={clsx(
        "px-1.5 py-1 flex gap-2 items-center dark:bg-breadgray-burnt rounded",
        status === "disabled" && "opacity-50"
      )}
    >
      <span
        className={clsx(
          "rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center",
          status === "success"
            ? "border-status-success"
            : "border-breadgray-toast"
        )}
      >
        {status === "success" && (
          <div className="size-full translate-y-0.5 text-status-success">
            <CheckIcon />
          </div>
        )}
      </span>
      <div className="dark:text-white font-bold">{children}</div>
    </div>
  );
}
