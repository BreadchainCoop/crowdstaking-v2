import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { parseEther } from "viem";
import {
  Root as DialogPrimitiveRoot,
  Portal as DialogPrimitivePortal,
  Overlay as DialogPrimitiveOverlay,
  Trigger as DialogPrimitiveTrigger,
  Content as DialogPrimitiveContent,
  Close as DialogPrimitiveClose,
} from "@radix-ui/react-dialog";

import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { BREAD_GNOSIS_ABI } from "@/abi";
import Button from "@/app/core/components/Button";
import config from "@/chainConfig";
import useDebounce from "@/app/bakery/hooks/useDebounce";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { BurnModal } from "@/app/core/components/Modal/BurnModal/BurnModal";

export default function Burn({
  user,
  inputValue,
}: {
  user: TUserConnected;
  inputValue: string;
}) {
  const { transactionsState, transactionsDispatch } = useTransactions();
  const [txId, setTxId] = useState<string | null>(null);
  const [buttonIsEnabled, setButtonIsEnabled] = useState(false);

  const { BREAD } = config[user.chain.id];

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
    functionName: "burn",
    args: [parsedValue, user.address],
    enabled: parseFloat(debouncedValue) > 0,
  });

  useEffect(() => {
    setButtonIsEnabled(false);
  }, [inputValue, setButtonIsEnabled]);

  useEffect(() => {
    console.log({ prepareStatus });
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
    if (!writeData?.hash || !txId) return;
    transactionsDispatch({
      type: "SET_PENDING",
      payload: { id: txId, hash: writeData.hash },
    });
  }, [txId, writeData, transactionsDispatch]);

  useEffect(() => {
    if (!writeIsError && !writeError) return;
    // TODO tx not submitted, dispatch FAILED tx
    // !!! unless rejected by user:
    // -> error.cause.code === 4001

    console.log({ error: writeError });
  }, [writeIsError, writeError]);

  const transaction = transactionsState.find(
    (transaction) => transaction.id === txId
  );

  return (
    <div className="p-2 w-full flex flex-col gap-2">
      <DialogPrimitiveRoot>
        <DialogPrimitiveTrigger asChild>
          <Button
            fullWidth={true}
            variant="large"
            disabled={!buttonIsEnabled}
            onClick={() => {
              if (!write) return;
              const newId = nanoid();
              setTxId(newId);
              transactionsDispatch({
                type: "NEW",
                payload: { id: newId, value: debouncedValue },
              });
              write();
            }}
          >
            Burn
          </Button>
        </DialogPrimitiveTrigger>
        <DialogPrimitivePortal>
          {transaction && <BurnModal transaction={transaction} />}
        </DialogPrimitivePortal>
      </DialogPrimitiveRoot>
    </div>
  );
}
