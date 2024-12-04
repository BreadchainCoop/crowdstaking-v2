import clsx from "clsx";
import { ReactNode } from "react";

const borderWidths: {
  [key: number]: string;
} = {
  1: "p-[1px]",
  2: "p-[2px]",
};

export function GradientBorder({
  children,
  borderWidth = 1,
}: {
  children: ReactNode;
  borderWidth?: 1 | 2;
}) {
  return (
    <div
      className={clsx(
        "rounded-full relative overflow-hidden",
        borderWidths[borderWidth]
      )}
    >
      <div className="absolute w-[250%] h-[300%] top-0 left-0 transform -translate-x-[15%] -translate-y-1/3 border-gradient" />
      <div className="rounded-full relative z-10">{children}</div>
    </div>
  );
}
