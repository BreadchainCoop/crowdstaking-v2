import { forwardRef, Ref, type ReactNode } from "react";
import { Close as DialogPrimitiveClose } from "@radix-ui/react-dialog";

import CloseIcon from "../Icons/CloseIcon";
import { formatBalance } from "../../util/formatter";
import { motion } from "framer-motion";
import { Spinner } from "../Icons/Spinner";
import { TTransactionStatus } from "../../context/TransactionsContext/TransactionsReducer";
import { Body, Caption, Heading2, Heading3 } from "@breadcoop/ui";
import clsx from "clsx";
import CircularProgress from "@/app/components/circular-progress";

export const ModalContainer = forwardRef(
	(
		{
			children,
			showCloseButton = true,
			includeContainerStyling = true,
			className = "",
			...props
		}: {
			children: ReactNode;
			showCloseButton?: Boolean;
			includeContainerStyling?: Boolean;
			className?: string;
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
					className={clsx(
						"pointer-events-auto max-h-[calc(100vh-1rem)] overflow-y-auto mt-4",
						"shadow-[0_0.25rem_0.75rem_0_#1B201A26]",
						includeContainerStyling
							? "w-full max-w-[30rem] flex flex-col items-center bg-[#FDFAF3] relative p-5"
							: "",
						className
					)}
				>
					{/* {showCloseButton && (
						// TODO: Use color name from library
						<DialogPrimitiveClose className="absolute top-0 right-0 w-10 h-10 p-3 text-[#EA5817]">
							<CloseIcon />
						</DialogPrimitiveClose>
					)} */}
					{children}
				</motion.section>
			</div>
		);
	}
);

ModalContainer.displayName = "ModalContainer";

export function ModalHeading({
	children,
	showCloseButton = true,
}: {
	children: ReactNode;
	showCloseButton?: Boolean;
}) {
	return (
		<Heading2 className="text-2xl text-left w-full mr-auto flex items-center justify-between pl-2">
			{children}
			{showCloseButton && (
				// TODO: Use color name from library
				<DialogPrimitiveClose className="w-10 h-10 pr-3 pl-2 text-[#EA5817]">
					<CloseIcon />
				</DialogPrimitiveClose>
			)}
		</Heading2>
	);
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
		// <div className="px-2 pt-4 flex flex-col gap-4 items-center w-full">
		<div className="px-2 pt-4 flex flex-col gap-2 items-center w-full">
			{children}
		</div>
	);
}

export function ModalAdviceText({ children }: { children: ReactNode }) {
	return (
		// <p className="maxW-xs text-lg leading-normal text-breadgray-burnt dark:text-breadgray-light-grey text-center pt-4 pb-2">
		<Caption className="text-surface-grey font-bold">{children}</Caption>
	);
}

export function TransactionValue({
	value,
	children,
	className,
}: {
	value: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<Heading3
			className={clsx("leading-[1.5] pt-[0.2rem] md:text-2xl", className)}
		>
			{/* <span title={parseFloat(value).toString()}>
				{formatBalance(parseFloat(value), 2)}
			</span> */}
			{formatBalance(parseFloat(value), 2)}
			{children}
		</Heading3>
	);
	// return (
	//   <div
	//     className="w-full text-center text-3xl font-medium text-breadgray-grey100 dark:text-breadgray-light-grey"
	//     title={parseFloat(value).toString()}
	//   >
	//     {formatBalance(parseFloat(value), 2)}
	//   </div>
	// );
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
			{/* <Spinner /> */}
			<CircularProgress />
		</StatusIconWrapper>
	);
}

export function TransactionStatusCheck() {
	return (
		<StatusIconWrapper>
			<svg
				width="64"
				height="64"
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M22 34L28 40L42 26"
					strokeWidth="4"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="stroke-system-green"
				/>
				<path
					d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
					stroke="#32A800"
					strokeWidth="4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</StatusIconWrapper>
	);
}

export function TransactionStatusCross() {
	return (
		<StatusIconWrapper>
			<svg
				width="64"
				height="64"
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M32 34V20"
					stroke="#DF0B00"
					strokeWidth="4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M32 40.125C33.5878 40.125 34.875 41.4122 34.875 43C34.875 44.5878 33.5878 45.875 32 45.875C30.4122 45.875 29.125 44.5878 29.125 43C29.125 41.4122 30.4122 40.125 32 40.125Z"
					fill="#FF0420"
					stroke="#32A800"
					strokeWidth="0.25"
				/>
				<path
					d="M30.5927 6.58305L6.58116 30.5946C5.80499 31.3708 5.80499 32.6292 6.58116 33.4054L30.5927 57.417C31.3689 58.1931 32.6273 58.1931 33.4035 57.417L57.4151 33.4054C58.1912 32.6292 58.1912 31.3708 57.4151 30.5946L33.4035 6.58305C32.6273 5.80688 31.3689 5.80688 30.5927 6.58305Z"
					stroke="#DF0B00"
					strokeWidth="4"
					strokeLinecap="round"
					strokeLinejoin="round"
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
