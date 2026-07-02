import { ReactNode } from "react";
import { Body } from "@breadcoop/ui";

export function HowItWorksDropdown({ steps }: { steps: ReactNode[] }) {
  return (
    <details className="animated-details group mb-3 border border-primary-orange p-2">
      <summary className="list-none flex items-center justify-between gap-2 cursor-pointer">
        <Body className="text-sm font-bold text-surface-ink">How it works:</Body>
        <svg
          viewBox="0 0 12 8"
          className="h-2 w-3 fill-none stroke-surface-ink stroke-2 transition-transform group-open:rotate-180"
        >
          <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ol className="text-sm list-decimal list-inside space-y-1 mt-2">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </details>
  );
}
