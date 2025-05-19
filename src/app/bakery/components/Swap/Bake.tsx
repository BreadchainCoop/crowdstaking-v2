import { useWriteContract, useSimulateContract } from "wagmi";
import { parseEther } from "viem";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import Button from "@/app/core/components/Button";
import { getChain } from "@/chainConfig";
import { BREAD_ABI } from "@/abi";
import useDebounce from "@/app/bakery/hooks/useDebounce";

import { useEffect, useState } from "react";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk/dist/src/types";
import { useModal } from "@/app/core/context/ModalContext";

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
  const [buttonIsEnabled, setButtonIsEnabled] = useState(false);

  const { setModal } = useModal();

  const { BREAD } = getChain(user.chain.id);

  const debouncedValue = useDebounce(inputValue, 500);

  const parsedValue = parseEther(
    debouncedValue === "." ? "0" : debouncedValue || "0"
  );

  const {
    data: prepareConfig,
    status: prepareStatus,
    error: prepareError,
  } = useSimulateContract({
    address: BREAD.address,
    abi: BREAD_ABI,
    functionName: "mint",
    args: [user.address],
    value: parsedValue,
    query: {
      enabled: parseFloat(debouncedValue) > 0,
    },
  });

  useEffect(() => {
    setButtonIsEnabled(false);
  }, [inputValue, setButtonIsEnabled]);

  useEffect(() => {
    if (prepareStatus === "success") setButtonIsEnabled(true);
  }, [debouncedValue, prepareStatus, setButtonIsEnabled]);

  const {
    writeContract,
    isPending: writeIsLoading,
    isError: writeIsError,
    error: writeError,
    isSuccess: writeIsSuccess,
    data: writeData,
  } = useWriteContract();

  useEffect(() => {
    (async () => {
      if (!writeData) return;
      if (transactionsState.submitted.find((tx) => tx.hash === writeData)) {
        return;
      }
      if (isSafe) {
        // TODO look at using eth_getTransactionRecipt to catch submitted transactions
        const safeSdk = new SafeAppsSDK();
        const tx = await safeSdk.txs.getBySafeTxHash(writeData);
        if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
          transactionsDispatch({
            type: "SET_SAFE_SUBMITTED",
            payload: { hash: writeData },
          });
          setModal({ type: "BAKERY_TRANSACTION", hash: writeData });
          return;
        }
      }
      // not safe
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: writeData },
      });
      setModal({ type: "BAKERY_TRANSACTION", hash: writeData });
      clearInputValue();
    })();
  }, [
    writeData,
    transactionsState,
    transactionsDispatch,
    clearInputValue,
    isSafe,
    setModal,
  ]);

  useEffect(() => {
    if (!writeIsError && !writeError) return;
    // clear transaction closing modal on error including if user rejects the request
    setModal(null);
  }, [writeIsError, writeError, setModal]);

  return (
    <div className="relative">
      <Button
        fullWidth={true}
        size="xl"
        disabled={!buttonIsEnabled}
        onClick={() => {
          if (!writeContract) return;
          transactionsDispatch({
            type: "NEW",
            payload: {
              data: { type: "BAKE", value: debouncedValue },
            },
          });
          setModal({
            type: "BAKERY_TRANSACTION",
            hash: null,
          });
          writeContract(prepareConfig!.request);
        }}
      >
        Bake
      </Button>
    </div>
  );
}
