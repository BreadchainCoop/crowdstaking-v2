// import { useWriteContract } from "wagmi";
// import { parseEther } from "viem";
// import {
//   Root as DialogPrimitiveRoot,
//   Portal as DialogPrimitivePortal,
//   Trigger as DialogPrimitiveTrigger,
// } from "@radix-ui/react-dialog";

// import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
// import Button from "@/app/core/components/Button";
// import config from "@/chainConfig";
// import { BREAD_GNOSIS_ABI } from "@/abi";
// import useDebounce from "@/app/bakery/hooks/useDebounce";

// import { useEffect, useState } from "react";
// import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
// import { nanoid } from "nanoid";
// import { TransactionModal } from "@/app/core/components/Modal/TransactionModal/TransactionModal";

// export default function Bake({
//   user,
//   inputValue,
//   clearInputValue,
// }: {
//   user: TUserConnected;
//   inputValue: string;
//   clearInputValue: () => void;
// }) {
//   const { transactionsState, transactionsDispatch } = useTransactions();
//   const [txId, setTxId] = useState<string | null>(null);
//   const [buttonIsEnabled, setButtonIsEnabled] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   const { BREAD } = config[user.chain.id];

//   const debouncedValue = useDebounce(inputValue, 500);

//   const parsedValue = parseEther(
//     debouncedValue === "." ? "0" : debouncedValue || "0"
//   );

//   const {
//     config: prepareConfig,
//     status: prepareStatus,
//     error: prepareError,
//   } = usePrepareContractWrite({
//     address: BREAD.address,
//     abi: BREAD_GNOSIS_ABI,
//     functionName: "mint",
//     args: [user.address],
//     value: parsedValue,
//     enabled: parseFloat(debouncedValue) > 0,
//   });

//   useEffect(() => {
//     setButtonIsEnabled(false);
//   }, [inputValue, setButtonIsEnabled]);

//   useEffect(() => {
//     if (prepareStatus === "success") setButtonIsEnabled(true);
//   }, [debouncedValue, prepareStatus, setButtonIsEnabled]);

//   const {
//     write,
//     isLoading: writeIsLoading,
//     isError: writeIsError,
//     error: writeError,
//     isSuccess: writeIsSuccess,
//     data: writeData,
//   } = useContractWrite(prepareConfig);

//   useEffect(() => {
//     if (!writeData?.hash || !txId) return;
//     transactionsDispatch({
//       type: "SET_PENDING",
//       payload: { id: txId, hash: writeData.hash },
//     });
//     clearInputValue();
//   }, [txId, writeData, transactionsDispatch, clearInputValue]);

//   useEffect(() => {
//     if (!writeIsError && !writeError) return;
//     if (!txId) return;
//     // clear transaction closing modal on error including if user rejects the request
//     transactionsDispatch({ type: "CLEAR", payload: { id: txId } });
//     setTxId(null);
//   }, [writeIsError, writeError, txId, transactionsDispatch]);

//   const transaction = transactionsState.find(
//     (transaction) => transaction.id === txId
//   );

//   useEffect(() => {
//     if (transaction?.status === "PREPARED") setModalOpen(true);
//   }, [transaction, setModalOpen]);

//   return (
//     <DialogPrimitiveRoot open={modalOpen} onOpenChange={setModalOpen}>
//       <DialogPrimitiveTrigger asChild>
//         <Button
//           fullWidth={true}
//           variant="large"
//           disabled={!buttonIsEnabled}
//           onClick={() => {
//             if (!write) return;
//             const newId = nanoid();
//             setTxId(newId);
//             transactionsDispatch({
//               type: "NEW",
//               payload: { id: newId, value: debouncedValue },
//             });
//             write();
//           }}
//         >
//           Bake
//         </Button>
//       </DialogPrimitiveTrigger>
//       <DialogPrimitivePortal>
//         {transaction && (
//           <TransactionModal transactionType="BAKE" transaction={transaction} />
//         )}
//       </DialogPrimitivePortal>
//     </DialogPrimitiveRoot>
//   );
// }
