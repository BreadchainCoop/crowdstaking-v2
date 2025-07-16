import { WriteContractReturnType } from "viem";
import { nanoid } from "nanoid";

export type TTransactionHash = WriteContractReturnType;
export type TToastType = "SUBMITTED" | "CONFIRMED" | "REVERTED" | "CUSTOM";

export type TToastSubmitted = {
  id: string;
  toastType: "SUBMITTED";
  txHash: TTransactionHash;
};

export type TToastConfirmed = {
  id: string;
  toastType: "CONFIRMED";
  txHash: TTransactionHash;
};

export type TToastReverted = {
  id: string;
  toastType: "REVERTED";
  txHash: TTransactionHash;
};

export type TToastCustom = {
  id: string;
  toastType: "CUSTOM";
  message: string;
  variant: "neutral" | "success" | "error";
};

export type TToast =
  | TToastSubmitted
  | TToastConfirmed
  | TToastReverted
  | TToastCustom;

export type TToastState = TToast[];

export type TToastAction =
  | {
      type: "NEW";
      payload: {
        toastType: Exclude<TToastType, "CUSTOM">;
        txHash: TTransactionHash;
      };
    }
  | {
      type: "CUSTOM";
      payload: {
        message: string;
        variant: "neutral" | "success" | "error";
      };
    }
  | {
      type: "CLEAR";
      payload: { id: string };
    };

export type TToastDispatch = (action: TToastAction) => void;

export function ToastReducer(
  state: TToastState,
  action: TToastAction
): TToastState {
  switch (action.type) {
    case "NEW": {
      if (
        action.payload.toastType === "SUBMITTED" &&
        state.filter(
          (toast) =>
            toast.toastType === "SUBMITTED" &&
            toast.txHash === action.payload.txHash
        ).length > 0
      )
        return state;
      return [
        {
          id: nanoid(),
          toastType: action.payload.toastType,
          txHash: action.payload.txHash,
        },
        ...state,
      ];
    }
    case "CUSTOM": {
      return [
        {
          id: nanoid(),
          toastType: "CUSTOM",
          message: action.payload.message,
          variant: action.payload.variant,
        },
        ...state,
      ];
    }
    case "CLEAR":
      return state.filter((toast) => toast.id !== action.payload.id);
    default:
      throw new Error(`ToastContext action not recognised`);
  }
}

/*
    May want to use this function as CLEAR would fail silently if no
    toast was found with provided id
*/
function getIndex(state: TToastState, id: string): number {
  const toastIndex = state.findIndex((toast) => toast.id === id);
  if (toastIndex < 0) throw new Error("no message found with that id!");
  return toastIndex;
}
