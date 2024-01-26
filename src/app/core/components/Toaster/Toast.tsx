import { ReactNode } from "react";
import clsx from "clsx";
import * as ToastPrimitive from "@radix-ui/react-toast";

import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { TToastType } from "@/app/core/context/ToastContext/ToastContextReducer";

const toastMessages: {
  [K in TToastType]: string;
} = {
  SUBMITTED: "Transaction Submitted",
  CONFIRMED: "Transaction Confirmed",
  REVERTED: "Transaction Reverted",
};

export function Toast({
  toastType,
  explorerUrl,
}: {
  toastType: TToastType;
  explorerUrl: string;
}) {
  return (
    <li
      className={clsx(
        "rounded-xl border-2 px-6 py-4 flex flex-col gap-4 align-self bg-breadgray-burnt",
        toastType === "SUBMITTED" && "border-breadgray-rye",
        toastType === "CONFIRMED" && "border-status-success",
        toastType === "REVERTED" && "border-status-danger"
      )}
    >
      {/* <ToastPrimitive.Close /> */}

      <ToastPrimitive.Title className="text-xl font-medium">
        {toastMessages[toastType]}
      </ToastPrimitive.Title>
      <ToastPrimitive.Description>
        <a
          href={explorerUrl}
          target="_blank"
          className="flex flex-row gap-2 items-center text-breadpink-300 font-medium"
        >
          View on explorer
          <LinkIcon />
        </a>
      </ToastPrimitive.Description>
    </li>
  );
}

export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <ol className="absolute top-0 right-4 md:right-8 max-w-64 flex flex-col items-end gap-2">
      {children}
    </ol>
  );
}