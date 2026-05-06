import { useEffect, useRef } from "react";
import SafeAppsSDK, { TransactionStatus } from "@safe-global/safe-apps-sdk";
import {
  TSafeTransactionSubmitted,
  TTransactionsDispatch,
} from "./TransactionsReducer";
import { useToast } from "../ToastContext/ToastContext";

const POLL_INTERVAL_MS = 3000;

/**
 * Watches a Safe Wallet transaction by polling getBySafeTxHash every
 * POLL_INTERVAL_MS milliseconds. Safe transactions don't resolve
 * synchronously — they require multi-sig confirmation and return a
 * safeTxHash instead of a regular on-chain txHash. Without this
 * watcher, SAFE_SUBMITTED transactions get stuck "in process" forever.
 */
export function SafeTransactionWatcher({
  transaction,
  transactionsDispatch,
}: {
  transaction: TSafeTransactionSubmitted;
  transactionsDispatch: TTransactionsDispatch;
}) {
  const { hash } = transaction;
  const typedHash = hash as `0x${string}`;
  const { toastDispatch } = useToast();
  const sdkRef = useRef(new SafeAppsSDK());

  useEffect(() => {
    toastDispatch({
      type: "NEW",
      payload: { toastType: "SUBMITTED", txHash: typedHash },
    });
  }, [typedHash, toastDispatch]);

  useEffect(() => {
    const sdk = sdkRef.current;
    let intervalId: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const tx = await sdk.txs.getBySafeTxHash(typedHash);

        if (tx.txStatus === TransactionStatus.SUCCESS) {
          transactionsDispatch({
            type: "SET_SUCCESS",
            payload: { hash: typedHash },
          });
          clearInterval(intervalId);
        } else if (
          tx.txStatus === TransactionStatus.CANCELLED ||
          tx.txStatus === TransactionStatus.FAILED
        ) {
          transactionsDispatch({
            type: "SET_REVERTED",
            payload: { hash: typedHash },
          });
          toastDispatch({
            type: "NEW",
            payload: { toastType: "REVERTED", txHash: typedHash },
          });
          clearInterval(intervalId);
        }
        // AWAITING_CONFIRMATIONS and AWAITING_EXECUTION are non-terminal;
        // keep polling.
      } catch {
        // SDK call failed — tx may not be indexed yet; keep polling.
      }
    };

    poll();
    intervalId = setInterval(poll, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [typedHash, transactionsDispatch, toastDispatch]);

  return null;
}
