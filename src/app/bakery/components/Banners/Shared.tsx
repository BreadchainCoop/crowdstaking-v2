import { ReactNode } from "react";

export function BannerContainer({ children }: { children: ReactNode }) {
  return <div className="max-w-[30rem] m-auto">{children}</div>;
}

export function BannerCardLarge({ children }: { children: ReactNode }) {
  return (
    <div className="hidden gap-4 px-7 py-4 w-full items-center sm:flex max-w-[30rem] border-breadgray-light-grey dark:border-transparent border hover:border-breadviolet-shaded hover:dark:border-breadpink-300 m-auto rounded-xl bg-breadgray-ultra-white dark:bg-breadgray-charcoal transition-all group relative overflow-hidden">
      {children}
    </div>
  );
}

export function BannerCardSmall({ children }: { children: ReactNode }) {
  return (
    <div className="sm:hidden flex flex-col gap-2 p-4 w-full max-w-[30rem] m-auto rounded-xl bg-breadgray-ultra-white dark:bg-breadgray-charcoal border border-transparent hover:border-breadviolet-shaded hover:dark:border-breadpink-300 transition-all group relative overflow-hidden">
      {children}
    </div>
  );
}

export function BannerTitle({ children }: { children: string }) {
  return (
    <div className="text-breadgray-grey300 dark:text-white text-2xl font-medium">
      {children}
    </div>
  );
}

export function BannerDescription({ children }: { children: ReactNode }) {
  return (
    <div className="text-breadgray-grey300 dark:text-breadgray-grey">
      {children}
    </div>
  );
}

export function BannerHighlight({
  icon,
  children,
}: {
  children: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl text-xl px-7 py-3 bg-gnosis-green font-medium text-white">
      <span className="">{icon}</span>
      <span>{children}</span>
      <span className="ml-auto dark:fill-white">
        <ArrowIcon fill="white" />
      </span>
    </div>
  );
}

export function ArrowIcon({ fill = "" }) {
  return (
    <svg
      width="16"
      height="15"
      className="group-hover:fill-breadviolet-shaded group-hover:dark:fill-breadpink-300 fill-breadgray-rye dark:fill-breadgray-grey transition-colors"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={fill ? fill : ""}
        d="M2.62268e-07 6.5L3.49691e-07 8.5L12 8.5L12 10.5L14 10.5L14 8.5L16 8.5L16 6.5L14 6.5L14 4.5L12 4.5L12 6.5L2.62268e-07 6.5ZM10 2.5L12 2.5L12 4.5L10 4.5L10 2.5ZM10 2.5L8 2.5L8 0.5L10 0.5L10 2.5ZM10 12.5L12 12.5L12 10.5L10 10.5L10 12.5ZM10 12.5L8 12.5L8 14.5L10 14.5L10 12.5Z"
      />
    </svg>
  );
}
