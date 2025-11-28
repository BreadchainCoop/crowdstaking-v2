import { ReactNode, useEffect, useReducer } from "react";
import clsx from "clsx";
import { getChain } from "@/chainConfig";
import { ERC20_ABI } from "@/abi";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";
import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { LPVaultTransactionModalState } from "@/app/core/context/ModalContext";
import {
	ModalContent,
	// ModalHeading
} from "../../LPModalUI";
import {
	// ModalAdviceText,
	// ModalContainer,
	// ModalContent,
	ModalHeading,
	// transactionIcons,
	// TransactionValue,
} from "../../ModalUI";
import { lockingReducer, LockingState } from "./lockingReducer";
import { IncreaseAllowance } from "./IncreaseAllowance";
import { Lock } from "./Lock";
import { LockVPRate } from "../VPRate";
import { Spinner } from "../../../Icons/Spinner";
import { Body, Caption } from "@breadcoop/ui";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { Chip } from "@/app/bakery/components/Chip";
import { ArrowDownIcon } from "@phosphor-icons/react";

const statusesInfo: Record<LockingState["status"], string> = {
	// loading: "Click ‘Confirm transaction’ to allow LP tokens to be locked.",
	loading: "",
	allowance_transaction_idle:
		"Click ‘Confirm transaction’ to allow LP tokens to be locked.",
	allowance_transaction_reverted: "",
	allowance_transaction_submitted: "Awaiting on-chain confirmation...",
	deposit_transaction_confirmed: "",
	deposit_transaction_idle:
		"Press ‘Lock LP tokens’ to execute this transaction",
	deposit_transaction_reverted: "",
	deposit_transaction_submitted: "Awaiting on-chain confirmation...",
};

export function LockingTransaction({
	user,
	modalState,
}: {
	user: TUserConnected;
	modalState: LPVaultTransactionModalState;
}) {
	const chainConfig = getChain(user.chain.id);
	const [lockingState, lockingDispatch] = useReducer(lockingReducer, {
		depositAmount: modalState.parsedValue,
		status: "loading",
	});

	const { status: userAllowanceStatus, data: userAllowanceData } =
		useRefetchOnBlockChangeForUser(
			user.address,
			chainConfig.BUTTER.address,
			ERC20_ABI,
			"allowance",
			[user.address, chainConfig.BUTTERED_BREAD.address]
		);

	useEffect(() => {
		if (userAllowanceStatus === "success") {
			lockingDispatch({
				type: "ALLOWANCE_UPDATE",
				payload: { allowance: userAllowanceData as bigint },
			});
		}
	}, [userAllowanceStatus, userAllowanceData]);

	console.log("__ STATUS __", lockingState.status);

	const statusInfo = statusesInfo[lockingState.status];

	return (
		<>
			<ModalHeading>Locking LP Tokens</ModalHeading>
			<ModalContent>
				<StatusBadge
					variant="lock"
					status={
						lockingState.status !== "deposit_transaction_confirmed"
							? "in-progress"
							: "complete"
					}
				/>

				{/* {lockingState.status === "allowance_transaction_idle" && (
          <Body className="text-surface-grey">
            Click ‘Confirm transaction’ to allow LP tokens to be locked.
          </Body>
        )} */}
				{statusInfo && (
					<Body bold className="text-surface-grey">
						{statusInfo}
					</Body>
				)}
				{lockingState.status !== "deposit_transaction_confirmed" && (
					// <div className="flex flex-col gap-4 md:gap-20">
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-2 flex-1">
							<Caption className="text-surface-grey text-center">
								{/* {lockingState.status === "allowance_transaction_idle" &&
                  "Step 1: Confirm token allowance"}
                {lockingState.status === "allowance_transaction_submitted" &&
                  "Awaiting on-chain confirmation..."}
                {lockingState.status.includes("deposit") &&
                  "Press ‘Lock LP tokens’ to execute this transaction"} */}
								Step 1: Confirm token allowance
							</Caption>
							<TransactionStage
								// status={
								//   !lockingState.status.includes("allowance_transaction")
								//     ? "success"
								//     : "pending"
								// }
								status={
									lockingState.status ===
									"allowance_transaction_idle"
										? "disabled"
										: !lockingState.status.includes(
												"allowance_transaction"
										  )
										? "success"
										: "pending"
								}
							>
								<Body className="whitespace-nowrap">
									Token allowance
								</Body>
							</TransactionStage>
						</div>

						<div className="flex items-center justify-center">
							<ArrowDownIcon size={24} color="#EA5817" />
						</div>

						<div className="flex flex-col gap-2 flex-1">
							<Caption
								className={clsx(
									"text-center",
									lockingState.status.includes("allowance") &&
										"text-surface-grey"
								)}
							>
								{/* {lockingState.status.includes("allowance") &&
                  "Step 2: Waiting for token allowance"}
                {lockingState.status === "deposit_transaction_idle" &&
                  "Lock your LP tokens"}
                {lockingState.status === "deposit_transaction_submitted" &&
                  "Locking your LP tokens..."} */}
								{lockingState.status.includes("allowance")
									? "Step 2: Waiting for token allowance"
									: "Step 2: Lock your LP tokens"}
							</Caption>
							<TransactionStage
								status={
									!lockingState.status.includes(
										"deposit_transaction"
									)
										? "disabled"
										: "pending"
								}
								// status={(lockingState.status === "deposit_transaction_idle" || lockingState.status.includes("allowance")) ? "disabled" : "pending"}
							>
								Lock tokens
							</TransactionStage>
						</div>
					</div>
				)}
				{lockingState.status !== "deposit_transaction_confirmed" && (
					<LockVPRate
						value={lockingState.depositAmount}
						status={lockingState.status}
					/>
				)}
				{(() => {
					if (lockingState.status === "loading") {
						return "loading....";
					}
					if (
						lockingState.status === "allowance_transaction_idle" ||
						lockingState.status ===
							"allowance_transaction_submitted" ||
						lockingState.status === "allowance_transaction_reverted"
					) {
						return (
							<div className="w-full">
								<IncreaseAllowance
									user={user}
									lockingState={lockingState}
									lockingDispatch={lockingDispatch}
								/>
							</div>
						);
					}
					if (
						lockingState.status === "deposit_transaction_idle" ||
						lockingState.status ===
							"deposit_transaction_submitted" ||
						lockingState.status ===
							"deposit_transaction_confirmed" ||
						lockingState.status === "deposit_transaction_reverted"
					) {
						return (
							<Lock
								user={user}
								lockingState={lockingState}
								lockingDispatch={lockingDispatch}
							/>
						);
					}
				})()}
			</ModalContent>
		</>
	);
	// return (
	//   <>
	//     <ModalHeading>Locking LP Tokens</ModalHeading>
	//     <ModalContent>
	//       <StatusBadge
	//         variant="lock"
	//         status={
	//           lockingState.status !== "deposit_transaction_confirmed"
	//             ? "in-progress"
	//             : "complete"
	//         }
	//       />

	//       {lockingState.status === "allowance_transaction_idle" && (
	//         <Body className="text-surface-grey">
	//           {/* Press ‘Confirm transaction’ to allow LP tokens to be locked. */}
	//           Click ‘Confirm transaction’ to allow LP tokens to be locked.
	//         </Body>
	//       )}
	//       {lockingState.status !== "deposit_transaction_confirmed" && (
	//         <div className="flex flex-col gap-4 md:gap-20">
	//           <div className="flex flex-col gap-2 flex-1">
	//             <TransactionStage
	//               status={
	//                 !lockingState.status.includes("allowance_transaction")
	//                   ? "success"
	//                   : "pending"
	//               }
	//             >
	//               <Body className="whitespace-nowrap">
	//                 Step 1. Confirm token allowance
	//               </Body>
	//             </TransactionStage>
	//             <Caption className="px-2">
	//               {lockingState.status === "allowance_transaction_idle" &&
	//                 "Please confirm the transaction"}
	//               {lockingState.status === "allowance_transaction_submitted" &&
	//                 "Confirm the transaction..."}
	//               {lockingState.status.includes("deposit") &&
	//                 "Token allowance granted!"}
	//             </Caption>
	//           </div>
	//           <div className="flex flex-col gap-2 flex-1">
	//             <TransactionStage
	//               status={
	//                 !lockingState.status.includes("deposit_transaction")
	//                   ? "disabled"
	//                   : "pending"
	//               }
	//             >
	//               2. Token locking
	//             </TransactionStage>
	//             <Caption className="px-2">
	//               {lockingState.status.includes("allowance") &&
	//                 "Waiting for next action..."}
	//               {lockingState.status === "deposit_transaction_idle" &&
	//                 "Lock your LP tokens"}
	//               {lockingState.status === "deposit_transaction_submitted" &&
	//                 "Locking your LP tokens..."}
	//             </Caption>
	//           </div>
	//         </div>
	//       )}
	//       {lockingState.status !== "deposit_transaction_confirmed" && (
	//         <LockVPRate
	//           value={lockingState.depositAmount}
	//           status={lockingState.status}
	//         />
	//       )}
	//       {(() => {
	//         if (lockingState.status === "loading") {
	//           return "loading....";
	//         }
	//         if (
	//           lockingState.status === "allowance_transaction_idle" ||
	//           lockingState.status === "allowance_transaction_submitted" ||
	//           lockingState.status === "allowance_transaction_reverted"
	//         ) {
	//           return (
	//             <div className="w-full">
	//               <IncreaseAllowance
	//                 user={user}
	//                 lockingState={lockingState}
	//                 lockingDispatch={lockingDispatch}
	//               />
	//             </div>
	//           );
	//         }
	//         if (
	//           lockingState.status === "deposit_transaction_idle" ||
	//           lockingState.status === "deposit_transaction_submitted" ||
	//           lockingState.status === "deposit_transaction_confirmed" ||
	//           lockingState.status === "deposit_transaction_reverted"
	//         ) {
	//           return (
	//             <Lock
	//               user={user}
	//               lockingState={lockingState}
	//               lockingDispatch={lockingDispatch}
	//             />
	//           );
	//         }
	//       })()}
	//     </ModalContent>
	//   </>
	// );
}

export function StatusBadge({
	variant,
	status,
}: {
	variant: "lock" | "unlock";
	status: "complete" | "in-progress" | "reverted";
}) {
	return (
		<span
			className={clsx(
				"px-1 text-system-green font-bold text-xs bg-opacity-10",
				status === "in-progress" && "text-system-green",
				status === "reverted" && "text-system-red"
			)}
		>
			{status === "in-progress" && <Body>In progress...</Body>}
			{status === "complete" && (
				<div className="flex flex-col items-center gap-2">
					<CheckCircleIcon size={42} />
					<Body bold>Complete</Body>

					<Body className="text-surface-grey">
						{variant === "lock"
							? "Successfully locked!"
							: "Successfully unlocked!"}
					</Body>
				</div>
			)}
			{status === "reverted" && (
				<div className="flex flex-col items-center gap-2">
					<WarningCircleIcon size={42} />
					<Body bold>Transaction failed</Body>
					<Body className="text-surface-grey">
						Something went wrong. Please try again!
					</Body>
				</div>
			)}
		</span>
	);
}

type TransactionStatus = "disabled" | "pending" | "success";

const stageIcons: {
	[key in TransactionStatus]: ReactNode;
} = {
	disabled: <DisabledIcon />,
	pending: <PendingIcon />,
	success: <SuccessIcon />,
};

function TransactionStage({
	status,
	children,
}: {
	status: TransactionStatus;
	children: ReactNode;
}) {
	return (
		<Chip
			className={clsx(
				"flex items-center justify-center gap-2.5! py-1! px-4! font-bold border-surface-ink!",
				status === "disabled" && "opacity-50"
			)}
		>
			{stageIcons[status]}
			{children}
		</Chip>
	);
	// return (
	//   <div
	//     className={clsx(
	//       "px-1.5 py-1 flex gap-2 items-center flex-col",
	//       status === "disabled" && "opacity-50"
	//     )}
	//   >
	//     {stageIcons[status]}
	//     <div className="">{children}</div>
	//   </div>
	// );
}

function SuccessIcon() {
	return (
		<div className="text-system-green">
			<CheckCircleIcon size={24} />
		</div>
	);
}

function DisabledIcon() {
	return (
		<span className="rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center border-primary-orange" />
		// <span className="rounded-full p-[3.5px] border-[3px] transform size-6 flex items-center border-surface-grey" />
	);
}

function PendingIcon() {
	return (
		<div className="size-5 text-primary-orange">
			<Spinner className="!w-5 !h-5" />
		</div>
	);
}
