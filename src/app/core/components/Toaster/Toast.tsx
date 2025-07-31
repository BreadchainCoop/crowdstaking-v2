import { ReactNode } from "react";
import clsx from "clsx";
import * as ToastPrimitive from "@radix-ui/react-toast";

import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { TToastType } from "@/app/core/context/ToastContext/ToastContextReducer";
import CloseIcon from "../Icons/CloseIcon";

const toastMessages: {
  [K in TToastType]: string;
} = {
  SUBMITTED: "Transaction Submitted",
  CONFIRMED: "Transaction Confirmed",
  REVERTED: "Transaction Reverted",
  CUSTOM: "", // Custom toasts use their own custom message
};

export function Toast({
  toastType,
  txHash,
  message,
  variant,
}: {
  toastType: TToastType;
  txHash?: string;
  message?: string;
  variant?: "neutral" | "success" | "error";
}) {
  const isMessageToast = toastType === "CUSTOM";
  const displayMessage = isMessageToast ? (
    <p className="w-[97%]">{message}</p>
  ) : (
    toastMessages[toastType]
  );

  return (
    <li
      className={clsx(
        "relative w-[270px] rounded-xl border-2 px-4 py-3 flex flex-col gap-2 align-self bg-breadgray-ultra-white dark:bg-breadgray-burnt",
        (toastType === "SUBMITTED" ||
          (toastType === "CUSTOM" && variant === "neutral")) &&
          "border-breadgray-grey",
        (toastType === "CONFIRMED" ||
          (toastType === "CUSTOM" && variant === "success")) &&
          "border-status-success",
        (toastType === "REVERTED" ||
          (toastType === "CUSTOM" && variant === "error")) &&
          "border-status-danger"
      )}
    >
      <ToastPrimitive.ToastClose className="absolute top-0 right-0 w-8 h-8 p-2">
        <CloseIcon />
      </ToastPrimitive.ToastClose>
      <ToastPrimitive.Title className="text-lg font-medium text-breadgray-charcoal dark:text-breadgray-light-grey">
        {displayMessage}
      </ToastPrimitive.Title>
      {!isMessageToast && txHash && (
        <ToastPrimitive.Description>
          <a
            href={`https://gnosisscan.io/tx//${txHash}`}
            target="_blank"
            className="flex flex-row gap-2 items-center text-breadviolet-violet dark:text-breadpink-300 font-medium"
          >
            View on explorer
            <LinkIcon />
          </a>
        </ToastPrimitive.Description>
      )}
    </li>
  );
}

export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <ol className="w-full absolute top-0 right-0 z-50">
      <div className="w-full max-w-6xl m-auto px-4 md:px-8 flex flex-col items-end gap-2">
        {children}
      </div>
    </ol>
  );
}
