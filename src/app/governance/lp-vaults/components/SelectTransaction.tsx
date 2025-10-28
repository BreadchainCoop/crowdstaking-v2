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
        icon={<img src="/Lock.svg" alt="Lock" className="size-full" />}
        setTransactionType={() => {
          setTransactionType("LOCK");
        }}
      />
      <RadioInput
        name="Unlock"
        isSelected={transactionType === "UNLOCK"}
        icon={<img src="/Lock.svg" alt="Lock" className="size-full" />}
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
      <Body>
        <label
          htmlFor={name}
          className={clsx(
            "col-start-1 row-start-1 font-bold py-4 flex gap-4 px-8 items-end justify-center leading-none cursor-pointer transition-colors",
            isSelected
              ? "border border-primary-orange text-primary-orange bg-primary-orange/10"
              : "z-30 bg-paper-main text-surface-grey bg-opacity-30"
          )}
        >
          <div className="size-5">{icon}</div>
          {name}
        </label>
      </Body>
      <input
        type="radio"
        id={name}
        name="vault-transaction-type"
        value={name}
        className="col-start-1 row-start-1 opacity-0"
        onChange={setTransactionType}
      />
    </div>
  );
}
