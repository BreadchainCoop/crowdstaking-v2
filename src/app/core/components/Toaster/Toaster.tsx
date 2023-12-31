// import * as ToastPrimitive from "@radix-ui/react-toast";

// import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
// import {
//   TTransactionPending,
//   TTransactionReverted,
//   TTransactionSuccess,
//   TTransactionsDispatch,
// } from "../../context/TransactionsContext/TransactionsReducer";
// import { useEffect, useState } from "react";
// import { useWaitForTransaction } from "wagmi";

// export function Toaster() {
//   const { state: transactionsState, dispatch: transactionsDispatch } =
//     useTransactions();

//   console.log({ transactionsState });

//   return (
//     <section className="absolute">
//       {/* {transactionsState.map((transaction) => {
//         return transaction.status === "PENDING" ? (
//           <PendingTxToast
//             key={`${transaction.hash}_${transaction.status}`}
//             transaction={transaction}
//             transactionsDispatch={transactionsDispatch}
//           />
//         ) : (
//           <Toast
//             key={`${transaction.hash}_${transaction.status}`}
//             transaction={transaction}
//             transactionsDispatch={transactionsDispatch}
//           />
//         );
//       })} */}
//     </section>
//   );
// }

// function Toast({
//   transaction,
//   transactionsDispatch,
// }: {
//   transaction: TTransactionSuccess | TTransactionReverted;
//   transactionsDispatch: TTransactionsDispatch;
// }) {
//   const { id, status, hash } = transaction;

//   function handleOpenChange() {
//     transactionsDispatch({ type: "CLEAR", payload: { id } });
//   }

//   return (
//     <ToastPrimitive.Provider>
//       <ToastPrimitive.Root
//         onOpenChange={handleOpenChange}
//         className="p-6 rounded bg-white text-black"
//       >
//         <ToastPrimitive.Title>{status}</ToastPrimitive.Title>
//         <ToastPrimitive.Description>{hash}</ToastPrimitive.Description>
//         <ToastPrimitive.Close />
//       </ToastPrimitive.Root>
//       <ToastPrimitive.Viewport />
//     </ToastPrimitive.Provider>
//   );
// }

// // function PendingTxToast({
// //   transaction,
// //   transactionsDispatch,
// // }: {
// //   transaction: TTransactionPending;
// //   transactionsDispatch: TTransactionsDispatch;
// // }) {
// //   const { id, status, hash } = transaction;

// //   const [haveResult, setHaveResult] = useState(false);

// //   const { data: waitData } = useWaitForTransaction({ hash });

// //   function handleOpenChange() {
// //     transactionsDispatch({ type: "CLEAR", payload: { id } });
// //   }

// //   useEffect(() => {
// //     if (!waitData || haveResult) return;
// //     console.log("we have waitdata: ", waitData);
// //     if (waitData.status === "success") {
// //       transactionsDispatch({ type: "SUCCESS", payload: { hash } });
// //     }
// //     if (waitData.status === "reverted") {
// //       transactionsDispatch({ type: "REVERTED", payload: { hash } });
// //     }
// //     setHaveResult(true);
// //   }, [status, hash, waitData, transactionsDispatch, haveResult, setHaveResult]);

// //   return (
// //     <ToastPrimitive.Provider>
// //       <ToastPrimitive.Root
// //         onOpenChange={handleOpenChange}
// //         className="p-6 rounded bg-white text-green-900 font-bold"
// //       >
// //         <ToastPrimitive.Title>{transaction.status}</ToastPrimitive.Title>
// //         <ToastPrimitive.Description>
// //           {transaction.hash}
// //         </ToastPrimitive.Description>
// //         <ToastPrimitive.Close />
// //       </ToastPrimitive.Root>
// //       <ToastPrimitive.Viewport />
// //     </ToastPrimitive.Provider>
// //   );
// // }
