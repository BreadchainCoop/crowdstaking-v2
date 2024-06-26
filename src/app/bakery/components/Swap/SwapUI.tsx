import { ReactNode } from "react";

export function PanelHeader({ children }: { children: ReactNode }) {
  return <div className="mb-6 sm:mb-8">{children}</div>;
}

export function PanelContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-start justify-between">{children}</div>
  );
}

export function PanelTokenRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-2 sm:gap-4">{children}</div>
  );
}

export function PanelBalanceRow({ children }: { children: ReactNode }) {
  return <div className="w-full flex justify-end">{children}</div>;
}

type TBalanceProps = {
  children: ReactNode;
  onClick: () => void;
};

export function PanelBalanceButton({ onClick, children }: TBalanceProps) {
  return (
    <button
      type="button"
      className="pb-3 text-xs hover:text-white hover:underline sm:text-sm"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function PanelBalance({ children }: { children: ReactNode }) {
  return <span className="inline-block pb-3 text-sm">{children}</span>;
}

export function PanelContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full p-2 sm:px-8 sm:py-3 md:px-6 text-gray-300 bg-breadgray-ultra-white border border-1 border-breadgray-light-grey dark:border-none dark:bg-breadgray-grey300 rounded">
      {children}
    </div>
  );
}

export function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm inline-block text-breadgray-rye dark:text-neutral-400 pl-3">
      {children}
    </span>
  );
}

export function TokenLabelContainer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-full token-label-shadow dark:bg-[#343434] px-1.5 py-0.5 pr-3 flex items-center sm:text-xl w-auto">
      {children}
    </div>
  );
}

export function TokenLabelText({ children }: { children: ReactNode }) {
  return (
    <span className="ml-2 font-medium text-xl text-breadgray-grey100 dark:text-gray-300">
      {children}
    </span>
  );
}

export function TokenBalanceContainer({ children }: { children: ReactNode }) {
  return <div className="h-6 flex items-center justify-end">{children}</div>;
}

export function TokenBalanceText({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 font-medium text-breadgray-rye dark:text-neutral-400 text-xs sm:text-[0.85rem] text-right">
      {children}
    </div>
  );
}
