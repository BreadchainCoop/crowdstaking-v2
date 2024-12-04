import { Hex } from "viem";

export type WithdrawState =
  | WithdrawStateIdle
  | WithdrawStateSubmitted
  | WithdrawStateConfirmed
  | WithdrawStateReverted;

export type WithdrawStateIdle = {
  status: "idle";
};

export type WithdrawStateSubmitted = {
  status: "submitted";
  txHash: Hex;
};

export type WithdrawStateConfirmed = {
  status: "confirmed";
  txHash: Hex;
};
export type WithdrawStateReverted = {
  status: "reverted";
  txHash: Hex;
};

export type WithdrawEvent =
  | WithdrawTransactionSubmitted
  | WithdrawTransactionConfirmed
  | WithdrawTransactionReverted;

export type WithdrawTransactionSubmitted = {
  type: "TRANSACTION_SUBMITTED";
  payload: { hash: Hex };
};

export type WithdrawTransactionReverted = {
  type: "TRANSACTION_REVERTED";
};

export type WithdrawTransactionConfirmed = {
  type: "TRANSACTION_CONFIRMED";
};

export function withdrawReducer(
  state: WithdrawState,
  event: WithdrawEvent
): WithdrawState {
  switch (state.status) {
    case "idle":
      if (event.type === "TRANSACTION_SUBMITTED") {
        return {
          ...state,
          status: "submitted",
          txHash: event.payload.hash,
        };
      }
      return state;

    case "submitted":
      if (event.type === "TRANSACTION_CONFIRMED") {
        return {
          ...state,
          status: "confirmed",
        };
      }
      if (event.type === "TRANSACTION_REVERTED") {
        return {
          ...state,
          status: "reverted",
        };
      }
      return state;

    default:
      return state;
  }
}
