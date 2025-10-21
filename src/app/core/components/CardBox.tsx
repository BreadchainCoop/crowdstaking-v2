import { ReactNode } from "react";

export function CardBox({ children }: { children: ReactNode }) {
  return (
    <div className="border border-surface-grey bg-paper-0">{children}</div>
  );
}
