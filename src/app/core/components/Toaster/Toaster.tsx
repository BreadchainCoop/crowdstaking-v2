"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";

import { useToast } from "@/app/core/context/ToastContext/ToastContext";
import {
  TToast,
  TToastDispatch,
} from "@/app/core/context/ToastContext/ToastContextReducer";
import { Toast as ToastUI, ToastContainer } from "./Toast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toastState, toastDispatch } = useToast();
  return (
    <ToastContainer>
      <AnimatePresence>
        {toastState.map((toast, i) => (
          <motion.div
            key={`toast_${toast.id}`}
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Toast toast={toast} toastDispatch={toastDispatch} />
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
}

function Toast({
  toast,
  toastDispatch,
}: {
  toast: TToast;
  toastDispatch: TToastDispatch;
}) {
  const { id, toastType } = toast;

  function handleOpenChange() {
    toastDispatch({ type: "CLEAR", payload: { id } });
  }

  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root forceMount onOpenChange={handleOpenChange}>
        <ToastUI
          toastType={toastType}
          txHash={
            toast.toastType !== "CUSTOM" ? toast.txHash : undefined
          }
          message={
            toast.toastType === "CUSTOM" ? toast.message : undefined
          }
          variant={
            toast.toastType === "CUSTOM" ? toast.variant : undefined
          }
        />
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
}
