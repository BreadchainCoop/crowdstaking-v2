"use client";

import { Heading3, Body, Caption, LiftedButton } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { CreditCard } from "@phosphor-icons/react";

/**
 * GnosisPayCard Component (Placeholder)
 *
 * Coming soon section for Gnosis Pay card integration
 * Purely informational with no interactions
 */
export function GnosisPayCard() {
  return (
    <CardBox className="p-6 bg-gradient-to-br from-paper-0 to-paper-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-surface-grey-2">
          <CreditCard size={32} weight="duotone" />
        </div>
        <Heading3>Gnosis Pay Card</Heading3>
      </div>

      <Body className="text-surface-grey-2 mb-4">
        Coming soon: Spend your BREAD directly with the Gnosis Pay card
      </Body>

      <Caption className="text-surface-grey-2 text-xs block mb-4">
        Subscribe to our blog to get updates on this feature and more.
      </Caption>

      <a
        href="https://bread.coop"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <LiftedButton className="w-full" preset="stroke">
          Subscribe to Blog
        </LiftedButton>
      </a>
    </CardBox>
  );
}
