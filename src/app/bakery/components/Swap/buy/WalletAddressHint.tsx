"use client";

import { useState } from "react";
import { Body } from "@breadcoop/ui";

export function WalletAddressHint({ address, label }: { address: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — user can select the text manually
    }
  };

  return (
    <div className="bg-paper-main p-3 mt-3">
      <Body className="text-xs font-semibold text-surface-grey mb-1">
        {label}
      </Body>
      <div className="flex items-center gap-2">
        <code className="text-xs text-surface-ink break-all">{address}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-bold text-primary-orange hover:underline shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
