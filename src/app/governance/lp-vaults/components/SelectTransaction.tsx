import { ReactNode } from "react";
import { TransactionType } from "./VaultPanel";
import clsx from "clsx";

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
        icon={
          <svg
            viewBox="0 0 17 20"
            className="fill-current size-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.75 0H5.75V2H3.75V6H2.75H0.75V8V18V20H2.75H14.75H16.75V18V8V6H14.75H13.75V2H11.75V0ZM11.75 2V6H5.75V2H11.75ZM5.75 8H11.75H13.75H14.75V18H2.75V8H3.75H5.75ZM9.75 11H7.75V15H9.75V11Z"
            />
          </svg>
        }
        setTransactionType={() => {
          setTransactionType("LOCK");
        }}
      />
      <RadioInput
        name="Unlock"
        isSelected={transactionType === "UNLOCK"}
        icon={
          <svg
            viewBox="0 0 17 20"
            className="fill-current size-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.75 0H5.75V2H3.75V4H5.75V2H11.75V6H2.75H0.75V8V18V20H2.75H14.75H16.75V18V8V6H14.75H13.75V2H11.75V0ZM11.75 8H13.75H14.75V18H2.75V8H11.75ZM9.75 11H7.75V15H9.75V11Z"
            />
          </svg>
        }
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
      <label
        htmlFor={name}
        className={clsx(
          "col-start-1 row-start-1 rounded-full text-lg border-2 dark:border-[#00000000] bg-opacity-10 font-bold py-3 flex gap-4 px-8 items-end justify-center leading-none text-breadgray-light-grey",
          isSelected
            ? "dark:border-breadpink-300 text-breadpink-300 bg-[#DE56E7]"
            : " bg-breadgray-light-grey"
        )}
      >
        <div className="size-5">{icon}</div>
        {name}
      </label>
      <input
        type="radio"
        id={name}
        name="vault-transaction-type"
        value={name}
        className="col-start-1 row-start-1 opacity-0 cursor-pointer"
        onChange={setTransactionType}
      />
    </div>
  );
}
