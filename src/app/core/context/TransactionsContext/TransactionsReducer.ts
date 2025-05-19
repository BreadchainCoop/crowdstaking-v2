import { TransactionType } from "@/app/governance/lp-vaults/components/VaultPanel";
import { WriteContractReturnType } from "viem";

export type TTransactionHash = WriteContractReturnType;

export type TTransactionData =
  | {
      type: "BAKE" | "BURN";
      value: string;
      isSafe?: boolean;
    }
  | {
      type: "VOTE";
    }
  | {
      type: "LP_VAULT_ALLOWANCE";
      transactionType: TransactionType;
    }
  | {
      type: "LP_VAULT_DEPOSIT";
      transactionType: TransactionType;
    }
  | {
      type: "LP_VAULT_WITHDRAW";
      transactionType: TransactionType;
    };

export type TTransactionSubmitted = {
  status: "SUBMITTED";
  data: TTransactionData;
  hash: TTransactionHash;
};
export type TTransactionSuccess = {
  status: "CONFIRMED";
  data: TTransactionData;
  hash: TTransactionHash;
};
export type TTransactionPrepared = {
  status: "PREPARED";
  data: TTransactionData;
  hash: TTransactionHash;
};
export type TTransactionReverted = {
  status: "REVERTED";
  data: TTransactionData;
  hash: TTransactionHash;
};
export type TSafeTransactionSubmitted = {
  status: "SAFE_SUBMITTED";
  data: TTransactionData;
  hash: TTransactionHash;
};

export type TTransaction =
  | TTransactionSubmitted
  | TTransactionSuccess
  | TTransactionPrepared
  | TTransactionReverted
  | TSafeTransactionSubmitted;

export type TTransactionStatus = TTransaction["status"];

export type TTransactionsState = {
  new: TTransactionData | null;
  submitted: TTransaction[];
};

// TODO made value optional for now
// value could be a union eg. eth/bread amount | vote points

export type TTransactionsAction =
  | {
      type: "NEW";
      payload: { data: TTransactionData };
    }
  | {
      type: "SET_SUBMITTED";
      payload: { hash: TTransactionHash };
    }
  | {
      type: "SET_SUCCESS";
      payload: { hash: string };
    }
  | {
      type: "SET_REVERTED";
      payload: { hash: string };
    }
  | {
      type: "CLEAR";
      payload: { hash: string };
    }
  | {
      type: "CLEAR_NEW";
    }
  | {
      type: "SET_SAFE_SUBMITTED";
      payload: { hash: TTransactionHash };
    };

export type TTransactionsDispatch = (action: TTransactionsAction) => void;

export function TransactionsReducer(
  state: TTransactionsState,
  action: TTransactionsAction
): TTransactionsState {
  switch (action.type) {
    case "NEW": {
      return {
        new: action.payload.data,
        submitted: [...state.submitted],
      };
    }
    case "SET_SUBMITTED": {
      const tx = state.new;
      if (!tx) return state;
      return {
        new: null,
        submitted: [
          ...state.submitted,
          {
            status: "SUBMITTED",
            data: tx,
            hash: action.payload.hash,
          },
        ],
      };
    }
    case "SET_SUCCESS": {
      return {
        ...state,
        submitted: state.submitted.map((tx) => {
          if (tx.hash === action.payload.hash) {
            return {
              ...tx,
              status: "CONFIRMED",
            };
          }
          return tx;
        }),
      };
    }
    case "SET_REVERTED":
      return {
        ...state,
        submitted: state.submitted.map((tx) => {
          if (tx.hash === action.payload.hash) {
            return {
              ...tx,
              status: "REVERTED",
            };
          }
          return tx;
        }),
      };
    case "SET_SAFE_SUBMITTED":
      const tx = state.new;
      if (!tx) return state;
      return {
        new: null,
        submitted: [
          ...state.submitted,
          {
            status: "SAFE_SUBMITTED",
            data: tx,
            hash: action.payload.hash,
          },
        ],
      };
    case "CLEAR":
      return {
        ...state,
        submitted: state.submitted.filter(
          (transaction) => transaction.hash !== action.payload.hash
        ),
      };
    case "CLEAR_NEW":
      return {
        ...state,
        new: null,
      };
    default:
      throw new Error(`TransactionDisplay action not recognised`);
  }
}
