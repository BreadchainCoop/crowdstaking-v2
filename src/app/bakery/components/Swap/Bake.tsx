import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";
import {
  Root as DialogPrimitiveRoot,
  Portal as DialogPrimitivePortal,
  Trigger as DialogPrimitiveTrigger,
} from "@radix-ui/react-dialog";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import Button from "@/app/core/components/Button";
import { getConfig } from "@/chainConfig";
import { BREAD_GNOSIS_ABI } from "@/abi";
import useDebounce from "@/app/bakery/hooks/useDebounce";

import { useEffect, useState } from "react";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { nanoid } from "nanoid";
import { BakeryTransactionModal } from "@/app/core/components/Modal/TransactionModal/BakeryTransactionModal";
import { AnimatePresence } from "framer-motion";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk/dist/src/types";

export default function Bake({
  user,
  inputValue,
  clearInputValue,
  isSafe,
}: {
  user: TUserConnected;
  inputValue: string;
  clearInputValue: () => void;
  isSafe: boolean;
}) {
  const { transactionsState, transactionsDispatch } = useTransactions();
  const [txId, setTxId] = useState<string | null>(null);
  const [buttonIsEnabled, setButtonIsEnabled] = useState(false);
  const [txInProgress, setTxInProgress] = useState(false);

  const { BREAD } = getConfig(user.chain.id);

  const debouncedValue = useDebounce(inputValue, 500);

  const parsedValue = parseEther(
    debouncedValue === "." ? "0" : debouncedValue || "0"
  );

  const {
    config: prepareConfig,
    status: prepareStatus,
    error: prepareError,
  } = usePrepareContractWrite({
    address: BREAD.address,
    abi: BREAD_GNOSIS_ABI,
    functionName: "mint",
    args: [user.address],
    value: parsedValue,
    enabled: parseFloat(debouncedValue) > 0,
  });

  useEffect(() => {
    setButtonIsEnabled(false);
  }, [inputValue, setButtonIsEnabled]);

  useEffect(() => {
    if (prepareStatus === "success") setButtonIsEnabled(true);
  }, [debouncedValue, prepareStatus, setButtonIsEnabled]);

  const {
    write,
    isLoading: writeIsLoading,
    isError: writeIsError,
    error: writeError,
    isSuccess: writeIsSuccess,
    data: writeData,
  } = useContractWrite(prepareConfig);

  useEffect(() => {
    (async () => {
      if (!writeData?.hash || !txId) return;
      if (isSafe) {
        const safeSdk = new SafeAppsSDK();
        const tx = await safeSdk.txs.getBySafeTxHash(writeData.hash);
        if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
          transactionsDispatch({
            type: "SET_SAFE_SUBMITTED",
            payload: { id: txId, hash: writeData.hash },
          });
          return;
        }
      }
      // not safe
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { id: txId, hash: writeData.hash },
      });
      clearInputValue();
    })();
  }, [txId, writeData, transactionsDispatch, clearInputValue, isSafe]);

  useEffect(() => {
    if (!writeIsError && !writeError) return;
    if (!txId) return;
    // clear transaction closing modal on error including if user rejects the request
    transactionsDispatch({ type: "CLEAR", payload: { id: txId } });
    setTxId(null);
  }, [writeIsError, writeError, txId, transactionsDispatch]);

  const transaction = transactionsState.find(
    (transaction) => transaction.id === txId
  );

  useEffect(() => {
    if (transaction?.status === "SUBMITTED") setTxInProgress(true);
  }, [transaction, setTxInProgress]);

  return (
    <div className="relative">
      <DialogPrimitiveRoot>
        <DialogPrimitiveTrigger asChild>
          <Button
            fullWidth={true}
            variant="xl"
            disabled={!buttonIsEnabled || txInProgress}
            onClick={() => {
              if (!write) return;
              const newId = nanoid();
              setTxId(newId);
              transactionsDispatch({
                type: "NEW",
                payload: {
                  id: newId,
                  data: { type: "BAKERY", value: debouncedValue },
                },
              });
              write();
            }}
          >
            Bake
          </Button>
        </DialogPrimitiveTrigger>
        <DialogPrimitivePortal forceMount>
          <AnimatePresence>
            {transaction && (
              <BakeryTransactionModal
                transactionType="BAKE"
                transaction={transaction}
              />
            )}
          </AnimatePresence>
        </DialogPrimitivePortal>
      </DialogPrimitiveRoot>
      {prepareStatus === "loading" && (
        <span className="absolute bottom-0 left-0 right-0 transform translate-y-full pt-4">
          Preparing transaction...
        </span>
      )}
    </div>
  );
}
