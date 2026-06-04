import { useEffect, useRef } from "react";
import SafeAppsSDK, { TransactionStatus } from "@safe-global/safe-apps-sdk";
import {
  TSafeTransactionSubmitted,
  TTransactionsDispatch,
} from "./TransactionsReducer";
import { useToast } from "../ToastContext/ToastContext";

const POLL_INTERVAL_MS = 3000;

/**
 * A Safe transaction that sits unsigned for longer than this is treated as
 * expired/timed-out, so the user gets clear feedback instead of an endless
 * spinner. They can re-submit from the Safe transaction modal.
 */
const EXPIRY_TIMEOUT_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Watches a Safe Wallet transaction by polling getBySafeTxHash every
 * POLL_INTERVAL_MS milliseconds. Safe transactions don't resolve
 * synchronously — they require multi-sig confirmation and return a
 * safeTxHash instead of a regular on-chain txHash. Without this
 * watcher, SAFE_SUBMITTED transactions get stuck "in process" forever.
 *
 * The watcher also surfaces signer progress (X of Y confirmations) and
 * marks the transaction expired after EXPIRY_TIMEOUT_MS so the dedicated
 * Safe transaction modal can render the full guided flow.
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
    let expiryId: ReturnType<typeof setTimeout>;
    let settled = false;

    const stop = () => {
      settled = true;
      clearInterval(intervalId);
      clearTimeout(expiryId);
    };

    const poll = async () => {
      if (settled) return;
      try {
        const tx = await sdk.txs.getBySafeTxHash(typedHash);

        // Surface signer progress (X of Y) for non-terminal states.
        // Only multisig execution details carry confirmation counts.
        const execInfo = tx.detailedExecutionInfo;
        if (execInfo && "confirmationsRequired" in execInfo) {
          transactionsDispatch({
            type: "SET_SAFE_PROGRESS",
            payload: {
              hash: typedHash,
              confirmationsSubmitted: execInfo.confirmations?.length ?? 0,
              confirmationsRequired: execInfo.confirmationsRequired ?? 0,
            },
          });
        }

        if (tx.txStatus === TransactionStatus.SUCCESS) {
          transactionsDispatch({
            type: "SET_SUCCESS",
            payload: { hash: typedHash },
          });
          stop();
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
          stop();
        }
        // AWAITING_CONFIRMATIONS and AWAITING_EXECUTION are non-terminal;
        // keep polling.
      } catch {
        // SDK call failed — tx may not be indexed yet; keep polling.
      }
    };

    expiryId = setTimeout(() => {
      if (settled) return;
      transactionsDispatch({
        type: "SET_SAFE_EXPIRED",
        payload: { hash: typedHash },
      });
      stop();
    }, EXPIRY_TIMEOUT_MS);

    poll();
    intervalId = setInterval(poll, POLL_INTERVAL_MS);

    return () => stop();
  }, [typedHash, transactionsDispatch, toastDispatch]);

  return null;
}
