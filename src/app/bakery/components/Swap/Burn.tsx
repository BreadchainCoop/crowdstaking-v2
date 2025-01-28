import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { BREAD_ABI } from "@/abi";
import Button from "@/app/core/components/Button";
import { getConfig } from "@/chainConfig";
import useDebounce from "@/app/bakery/hooks/useDebounce";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { useEffect, useState } from "react";
import SafeAppsSDK from "@safe-global/safe-apps-sdk/dist/src/sdk";
import { TransactionStatus } from "@safe-global/safe-apps-sdk";
import { useModal } from "@/app/core/context/ModalContext";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import SwapBreadButton from "@/app/bakery/components/Swap/SwapBreadButton";

export default function Burn({
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
  const { BREAD } = getConfig(user.chain.id);
  const { setModal } = useModal();
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
    functionName: "burn",
    args: [parsedValue, user.address],
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
        const safeSdk = new SafeAppsSDK();
        const tx = await safeSdk.txs.getBySafeTxHash(writeData.hash);
        if (tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS) {
          transactionsDispatch({
            type: "SET_SAFE_SUBMITTED",
            payload: { hash: writeData.hash },
          });
          setModal({
            type: "BAKERY_TRANSACTION",
            hash: null,
          });
          return;
        }
      }
      // not safe
      transactionsDispatch({
        type: "SET_SUBMITTED",
        payload: { hash: writeData.hash },
      });
      setModal({
        type: "BAKERY_TRANSACTION",
        hash: writeData.hash,
      });
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
    setModal(null);
  }, [writeIsError, writeError, setModal]);

  return (
    <div className="relative">
      <div className="group">
        <SwapBreadButton withRecommended={true} />
      </div>
      <div className="m-3"></div>
      <Button
        fullWidth={true}
        size="xl"
        variant={"cancel"}
        disabled={!buttonIsEnabled}
        onClick={() => {
          setModal({
            type: "CONFIRM_BURN",
            breadValue: inputValue,
            xdaiValue: debouncedValue,
            write: write,
          });
        }}
      >
        Burn
      </Button>
    </div>
  );
}
