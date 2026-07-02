"use client";

import { ReactNode } from "react";
import { LiftedButton } from "@breadcoop/ui";

export function BuyCard({
  children,
  extra,
  buttonLabel,
  onBuy,
  formId,
}: {
  children: ReactNode;
  extra?: ReactNode;
  buttonLabel: string;
  onBuy: () => void;
  formId?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div className="text-surface-grey-2 text-sm mb-4">{children}</div>
        {extra}
      </div>

      <div className="relative lifted-button-container">
        <LiftedButton onClick={onBuy} className="" form={formId}>
          {buttonLabel}
        </LiftedButton>
      </div>
    </div>
  );
}
