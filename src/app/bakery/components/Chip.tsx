import { ReactNode } from "react";

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  // TODO: Before merging, this border color is not saved in the library. The figma design calls it primary/core orange color but the library uses another color code for primary orange
  return (
    <div className={`border border-[#EA5817] py-3 px-6 flex items-center justify-center gap-x-3 ${className}`}>
      {children}
    </div>
  );
}
