import { Hex } from "viem";

/**
 * STATES
 */
export type LockingLoading = {
  depositAmount: bigint;
  status: "loading";
};

export type LockingAllowanceIdle = {
  depositAmount: bigint;
  allowance: bigint;
  status: "allowance_transaction_idle";
};

export type LockingAllowanceSubmitted = {
  depositAmount: bigint;
  allowance: bigint;
  status: "allowance_transaction_submitted";
  txHash: Hex;
};

export type LockingAllowanceReverted = {
  depositAmount: bigint;
  allowance: bigint;
  status: "allowance_transaction_reverted";
  txHash: Hex;
};

export type LockingAllowance =
  | LockingAllowanceIdle
  | LockingAllowanceSubmitted
  | LockingAllowanceReverted;

export type LockingDepositIdle = {
  depositAmount: bigint;
  status: "deposit_transaction_idle";
};

export type LockingDepositSubmitted = {
  depositAmount: bigint;
  status: "deposit_transaction_submitted";
  txHash: Hex;
};

export type LockingDepositConfirmed = {
  depositAmount: bigint;
  status: "deposit_transaction_confirmed";
  txHash: Hex;
};

export type LockingDepositReverted = {
  depositAmount: bigint;
  status: "deposit_transaction_reverted";
  txHash: Hex;
};

export type LockingDeposit =
  | LockingDepositIdle
  | LockingDepositSubmitted
  | LockingDepositConfirmed
  | LockingDepositReverted;

export type LockingState = LockingLoading | LockingAllowance | LockingDeposit;

/**
 * EVENTS
 */
export type LockingAllowanceUpdate = {
  type: "ALLOWANCE_UPDATE";
  payload: {
    allowance: bigint;
  };
};

export type LockingTransactionSubmitted = {
  type: "TRANSACTION_SUBMITTED";
  payload: { hash: Hex };
};

export type LockingTransactionReverted = {
  type: "TRANSACTION_REVERTED";
};

export type LockingTransactionConfirmed = {
  type: "TRANSACTION_CONFIRMED";
};

export type LockingEvent =
  | LockingAllowanceUpdate
  | LockingTransactionSubmitted
  | LockingTransactionReverted
  | LockingTransactionConfirmed;

export function lockingReducer(
  state: LockingState,
  event: LockingEvent
): LockingState {
  switch (state.status) {
    case "loading":
      if (event.type === "ALLOWANCE_UPDATE") {
        return {
          ...state,
          allowance: event.payload.allowance,
          status:
            event.payload.allowance >= state.depositAmount
              ? "deposit_transaction_idle"
              : "allowance_transaction_idle",
        };
      }
      return state;

    case "allowance_transaction_idle":
      if (event.type === "TRANSACTION_SUBMITTED") {
        return {
          ...state,
          status: "allowance_transaction_submitted",
          txHash: event.payload.hash,
        };
      }
      if (event.type === "ALLOWANCE_UPDATE") {
        return {
          ...state,
          allowance: event.payload.allowance,
          status:
            event.payload.allowance >= state.depositAmount
              ? "deposit_transaction_idle"
              : "allowance_transaction_idle",
        };
      }
      return state;

    case "allowance_transaction_submitted":
      if (event.type === "ALLOWANCE_UPDATE") {
        return {
          ...state,
          allowance: event.payload.allowance,
          status:
            event.payload.allowance >= state.depositAmount
              ? "deposit_transaction_idle"
              : "allowance_transaction_idle",
        };
      }
      if (event.type === "TRANSACTION_REVERTED") {
        return {
          ...state,
          status: "allowance_transaction_reverted",
        };
      }
      return state;

    case "deposit_transaction_idle":
      if (event.type === "TRANSACTION_SUBMITTED") {
        return {
          ...state,
          status: "deposit_transaction_submitted",
          txHash: event.payload.hash,
        };
      }
      return state;

    case "deposit_transaction_submitted":
      if (event.type === "TRANSACTION_CONFIRMED") {
        return {
          ...state,
          status: "deposit_transaction_confirmed",
        };
      }
      if (event.type === "TRANSACTION_REVERTED") {
        return {
          ...state,
          status: "deposit_transaction_reverted",
        };
      }
      return state;

    default:
      return state;
  }
}
