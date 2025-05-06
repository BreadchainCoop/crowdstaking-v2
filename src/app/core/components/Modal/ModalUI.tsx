import { forwardRef, Ref, type ReactNode } from "react";
import { Close as DialogPrimitiveClose } from "@radix-ui/react-dialog";

import CloseIcon from "../Icons/CloseIcon";
import { formatBalance } from "../../util/formatter";
import { motion } from "framer-motion";
import { Spinner } from "../Icons/Spinner";
import { TTransactionStatus } from "../../context/TransactionsContext/TransactionsReducer";

export const ModalContainer = forwardRef(
  (
    {
      children,
      showCloseButton = true,
      includeContainerStyling = true,
      ...props
    }: {
      children: ReactNode;
      showCloseButton?: Boolean;
      includeContainerStyling?: Boolean;
    },
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className="h-screen max-h-[100vh] fixed w-screen top-0 p-2 grid place-items-center z-40 pointer-events-none"
        {...props}
      >
        <motion.section
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={
            "pointer-events-auto max-h-[calc(100vh-1rem)] overflow-y-auto mt-4" +
            (includeContainerStyling
              ? " w-[30rem] flex flex-col items-center rounded dark:bg-opacity-100 p-4 bg-breadgray-ultra-white border border-breadgray-light-grey dark:border-none dark:bg-breadgray-charcoal relative"
              : "")
          }
        >
          {showCloseButton && (
            <DialogPrimitiveClose className="absolute top-0 right-0 w-10 h-10 p-3">
              <CloseIcon />
            </DialogPrimitiveClose>
          )}
          {children}
        </motion.section>
      </div>
    );
  }
);

ModalContainer.displayName = "ModalContainer";

export function ModalHeading({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-row items-center justify-center border-b-[0.075rem] border-b-breadviolet-shaded dark:border-b-breadpink-shaded">
      <h2 className="text-2xl px-2 pb-3 leading-normal text-breadgray-burnt dark:text-breadgray-light-grey font-medium">
        {children}
      </h2>
    </div>
  );
}

export function ModalContent({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 pt-4 flex flex-col gap-4 items-center w-full">
      {children}
    </div>
  );
}

export function ModalAdviceText({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-xs text-lg leading-normal text-breadgray-burnt dark:text-breadgray-light-grey text-center pt-4 pb-2">
      {children}
    </p>
  );
}

export function TransactionValue({ value }: { value: string }) {
  return (
    <div
      className="w-full text-center text-3xl font-medium text-breadgray-grey100 dark:text-breadgray-light-grey"
      title={parseFloat(value).toString()}
    >
      {formatBalance(parseFloat(value), 2)}
    </div>
  );
}

export const ModalOverlay = forwardRef((props, ref: Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="z-40 fixed top-0 bg-[#F0F0F0] dark:bg-neutral-900 transition-opacity opacity-90 dark:opacity-70 h-screen w-screen"
      />
    </div>
  );
});

ModalOverlay.displayName = "ModalOverlay";

export function TransactionStatusSpinner() {
  return (
    <StatusIconWrapper>
      <Spinner />
    </StatusIconWrapper>
  );
}

export function TransactionStatusCheck() {
  return (
    <StatusIconWrapper>
      <svg
        width="44"
        height="33"
        viewBox="0 0 44 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38 0.5H43.3334V5.83333H38V0.5ZM32.6667 11.1667V5.83333H38L38 11.1667H32.6667ZM27.3334 16.5V11.1667H32.6667V16.5H27.3334ZM22 21.8333H27.3334V16.5L22 16.5V21.8333ZM16.6667 27.1667H22V21.8333H16.6667L16.6667 27.1667ZM11.3334 27.1667V32.5H16.6667V27.1667H11.3334ZM6.00002 21.8333H11.3334V27.1667H6.00002V21.8333ZM6.00002 21.8333H0.666687V16.5H6.00002V21.8333Z"
          fill="#9EC958"
        />
      </svg>
    </StatusIconWrapper>
  );
}

export function TransactionStatusCross() {
  return (
    <StatusIconWrapper>
      <svg
        width="32"
        height="33"
        viewBox="0 0 32 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0.5H4.57143V5.07014H9.14285V9.64145H4.57142V5.07131H0V0.5ZM4.57143 27.9285H0V32.4998H4.57143V27.9285ZM27.4286 27.9285H32V32.4998H27.4286V27.9285ZM13.7143 9.64306H9.14286V14.2144H13.7143L13.7143 18.7838H18.2857V14.2125H13.7143L13.7143 9.64306ZM22.8571 18.7861H18.2857V23.3574H22.8571L22.8571 27.9269H27.4286V23.3556H22.8571L22.8571 18.7861ZM22.8571 5.07014H27.4286L27.4286 0.5H32V5.07131H27.4286L27.4286 9.64145H22.8571V5.07014ZM18.2857 9.64306H22.8571V14.2144H18.2857V9.64306ZM13.7143 18.7861H9.14286L9.14286 23.3556H4.57143V27.9269H9.14286L9.14286 23.3574H13.7143V18.7861Z"
          fill="#D8745C"
        />
      </svg>
    </StatusIconWrapper>
  );
}

function StatusIconWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="size-8 pt-3 pb-4 text-breadpink-shaded flex items-center">
      {children}
    </div>
  );
}

export const transactionIcons: {
  [key in TTransactionStatus]: JSX.Element;
} & { PREPARED: JSX.Element } = {
  PREPARED: <TransactionStatusSpinner />,
  SUBMITTED: <TransactionStatusSpinner />,
  CONFIRMED: <TransactionStatusCheck />,
  SAFE_SUBMITTED: <TransactionStatusCheck />,
  REVERTED: <TransactionStatusCross />,
};
