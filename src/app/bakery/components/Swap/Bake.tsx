import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import Button from "@/app/core/components/Button";
import { getConfig } from "@/chainConfig";
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
    abi: BREAD_ABI,
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
      if (!writeData?.hash) return;
      if (
        transactionsState.submitted.find((tx) => tx.hash === writeData.hash)
      ) {
        return;
      }
      if (isSafe) {
        // TODO look at using eth_getTransactionRecipt to catch submitted transactions
        const safeSdk = new SafeAppsSDK();
        const tx = await safeSdk.txs.getBySafeTxHash(writeData.hash);
        if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
          transactionsDispatch({
            type: "SET_SAFE_SUBMITTED",
            payload: { hash: writeData.hash },
          });
          setModal({ type: "BAKERY_TRANSACTION", hash: writeData.hash });
          return;
        }
      }
      // not safe
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: writeData.hash },
      });
      setModal({ type: "BAKERY_TRANSACTION", hash: writeData.hash });
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
          if (!write) return;
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
          write();
        }}
      >
        Bake
      </Button>
    </div>
  );
}
