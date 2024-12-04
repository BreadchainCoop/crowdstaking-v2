import clsx from "clsx";
import { ReactNode } from "react";

export function PageGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid w-full grid-cols-12 governance-rows gap-y-8 sm:gap-8 lg:gap-5 lg:gap-y-3",
        className
      )}
    >
      {children}
    </div>
  );
}
