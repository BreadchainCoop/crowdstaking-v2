import { ReactNode, useEffect, useReducer } from "react";
import clsx from "clsx";
import { getChain } from "@/chainConfig";
import { ERC20_ABI } from "@/abi";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { LPVaultTransactionModalState } from "@/app/core/context/ModalContext";
import { ModalContent, ModalHeading } from "../../LPModalUI";
import { lockingReducer } from "./lockingReducer";
import { CheckIcon } from "../../../Icons/CheckIcon";
import { IncreaseAllowance } from "./IncreaseAllowance";
import { Lock } from "./Lock";
import { formatUnits } from "viem";
import { LockVPRate } from "../VPRate";
import { Spinner } from "../../../Icons/Spinner";
import {
  Body,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Caption,
  LiftedButton,
  Logo,
  Heading5,
} from "@breadcoop/ui";
import { CheckCircleIcon } from "@phosphor-icons/react/ssr";

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
          <Body className="text-surface-grey">
            Press ‘Confirm transaction’ to allow LP tokens to be locked.
          </Body>
        )}
        {lockingState.status !== "deposit_transaction_confirmed" && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-20">
            <div className="flex flex-col gap-2 flex-1">
              <TransactionStage
                status={
                  !lockingState.status.includes("allowance_transaction")
                    ? "success"
                    : "pending"
                }
              >
                <Body className="whitespace-nowrap">
                  Step 1. Confirm token allowance
                </Body>
              </TransactionStage>
              <Caption>
                {lockingState.status === "allowance_transaction_idle" &&
                  "Please confirm the transaction"}
                {lockingState.status === "allowance_transaction_submitted" &&
                  "Confirm the transaction..."}
                {lockingState.status.includes("deposit") &&
                  "Token allowance granted!"}
              </Caption>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <TransactionStage
                status={
                  !lockingState.status.includes("deposit_transaction")
                    ? "disabled"
                    : "pending"
                }
              >
                2. Token locking
              </TransactionStage>
              <Caption>
                {lockingState.status.includes("allowance") &&
                  "Waiting for next action..."}
                {lockingState.status === "deposit_transaction_idle" &&
                  "Lock your LP tokens"}
                {lockingState.status === "deposit_transaction_submitted" &&
                  "Locking your LP tokens..."}
              </Caption>
            </div>
          </div>
        )}
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
              <div className="w-full">
                <IncreaseAllowance
                  user={user}
                  lockingState={lockingState}
                  lockingDispatch={lockingDispatch}
                />
              </div>
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
        "rounded-full px-1 text-system-green font-bold text-xs bg-opacity-10",
        variant === "in-progress" && "bg-status-success text-status-success",
        variant === "complete" && "bg-breadpink-shaded text-breadpink-shaded"
      )}
    >
      {variant === "in-progress" && "In progress..."}
      {variant === "complete" && (
        <div className="flex flex-col items-center gap-2">
          <CheckCircleIcon size={42} />
          <Body bold>Complete</Body>

          <Body className="text-surface-grey">Successfully locked!</Body>
        </div>
      )}
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
        "px-1.5 py-1 flex gap-2 items-center",
        status === "disabled" && "opacity-50"
      )}
    >
      {stageIcons[status]}
      <div className="">{children}</div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <span className="rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center border-system-green">
      <div className="size-full translate-y-0.5 text-system-green">
        <CheckIcon />
      </div>
    </span>
  );
}

function DisabledIcon() {
  return (
    <span className="rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center border-surface-grey" />
  );
}

function PendingIcon() {
  return (
    <div className="size-6 text-primary-orange">
      <Spinner />
    </div>
  );
}
