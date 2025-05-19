import { useEffect } from "react";
import {
  TTransactionSubmitted,
  TTransactionsDispatch,
} from "./TransactionsReducer";
import { useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "../ToastContext/ToastContext";
import { useAudio } from "../../hooks/useAudio/useAudio";

export function TransactionWatcher({
  transaction,
  transactionsDispatch,
}: {
  transaction: TTransactionSubmitted;
  transactionsDispatch: TTransactionsDispatch;
}) {
  const { status, hash } = transaction;
  const { toastDispatch } = useToast();
  const { playSound } = useAudio({ src: "/cookies.mp3" });

  const { data: waitData } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    toastDispatch({
      type: "NEW",
      payload: { toastType: "SUBMITTED", txHash: hash },
    });
  }, [hash, toastDispatch]);

  useEffect(() => {
    if (!waitData) return;
    if (status !== "SUBMITTED") return;
    if (waitData.status === "success") {
      transactionsDispatch({ type: "SET_SUCCESS", payload: { hash } });
      if (transaction.data.type === "BAKE") playSound();
    }
    if (waitData.status === "reverted") {
      transactionsDispatch({ type: "SET_REVERTED", payload: { hash } });
      toastDispatch({
        type: "NEW",
        payload: { toastType: "REVERTED", txHash: hash },
      });
    }
  }, [
    status,
    hash,
    waitData,
    transactionsDispatch,
    toastDispatch,
    playSound,
    transaction,
  ]);

  return null;
}
