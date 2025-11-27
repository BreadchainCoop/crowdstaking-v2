import { ReactNode } from "react";
import { TransactionType } from "./VaultPanel";
import clsx from "clsx";
import { Body } from "@breadcoop/ui";

export function SelectTransaction({
  transactionType,
  setTransactionType,
}: {
  transactionType: TransactionType;
  setTransactionType: (type: TransactionType) => void;
}) {
  return (
    <fieldset className="grid gap-4 grid-cols-2">
      <RadioInput
        name="Lock"
        isSelected={transactionType === "LOCK"}
        icon={<LockSvg />}
        setTransactionType={() => {
          setTransactionType("LOCK");
        }}
      />
      <RadioInput
        name="Unlock"
        isSelected={transactionType === "UNLOCK"}
        icon={<UnLockSvg />}
        setTransactionType={() => {
          setTransactionType("UNLOCK");
        }}
      />
    </fieldset>
  );
}

function RadioInput({
  setTransactionType,
  icon,
  name,
  isSelected,
}: {
  setTransactionType: () => void;
  icon: ReactNode;
  name: string;
  isSelected: boolean;
}) {
  return (
		<div className="grid">
			<button
				type="button"
				onClick={setTransactionType}
				className={clsx(
					"font-bold py-3 px-6 flex items-end justify-center cursor-pointer transition-colors border",
					isSelected
						? "border-primary-orange text-primary-orange bg-primary-orange/10"
						: "border-transparent text-surface-grey bg-paper-main bg-opacity-30"
				)}
			>
				<Body className="flex gap-2.5 items-end justify-center">
					<div className="size-6">{icon}</div>
					{name}
				</Body>
			</button>
		</div>
	);

  // return (
  //   <div className="grid">
  //     <Body>
  //       <label
  //         htmlFor={name}
  //         className={clsx(
  //           "font-bold py-3 flex gap-2.5 px-6 items-end justify-center cursor-pointer transition-colors border",
  //           isSelected
  //             ? "border-primary-orange text-primary-orange bg-primary-orange/10"
  //             : "border-transparent text-surface-grey bg-paper-main bg-opacity-30"
  //         )}
  //       >
  //         <div className="size-6">{icon}</div>
  //         {name}
  //       </label>
  //     </Body>
  //     <input
  //       type="radio"
  //       id={name}
  //       name="vault-transaction-type"
  //       value={name}
  //       className="col-start-1 row-start-1 opacity-0"
  //       onChange={setTransactionType}
  //     />
  //   </div>
  // );
}

function LockSvg() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19.5 8.25H4.5C4.08579 8.25 3.75 8.58579 3.75 9V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V9C20.25 8.58579 19.9142 8.25 19.5 8.25Z"
				stroke="currentcolor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 13.1875C12.5868 13.1875 13.0625 13.6632 13.0625 14.25C13.0625 14.8368 12.5868 15.3125 12 15.3125C11.4132 15.3125 10.9375 14.8368 10.9375 14.25C10.9375 13.6632 11.4132 13.1875 12 13.1875Z"
				fill="currentcolor"
				stroke="currentcolor"
				strokeWidth="0.125"
			/>
			<path
				d="M8.25 8.25V5.25C8.25 4.25544 8.64509 3.30161 9.34835 2.59835C10.0516 1.89509 11.0054 1.5 12 1.5C12.9946 1.5 13.9484 1.89509 14.6517 2.59835C15.3549 3.30161 15.75 4.25544 15.75 5.25V8.25"
				stroke="currentcolor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function UnLockSvg() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19.5 8.25H4.5C4.08579 8.25 3.75 8.58579 3.75 9V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V9C20.25 8.58579 19.9142 8.25 19.5 8.25Z"
				stroke="currentcolor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.25 8.25V5.25C8.25 4.25544 8.64509 3.30161 9.34835 2.59835C10.0516 1.89509 11.0054 1.5 12 1.5C13.8141 1.5 15.4022 2.78812 15.75 4.5"
				stroke="currentcolor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
