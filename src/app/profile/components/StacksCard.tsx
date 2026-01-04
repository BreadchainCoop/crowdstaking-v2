"use client";

import { Heading3, Body, LiftedButton } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { Stack } from "@phosphor-icons/react";

/**
 * StacksCard Component (Feature-Flagged)
 *
 * Only renders when FEATURE_STACKS is enabled
 * Placeholder for future Stacks (savings circles) functionality
 */
export function StacksCard() {
  return (
    <CardBox className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-surface-grey-2">
          <Stack size={32} weight="duotone" />
        </div>
        <Heading3>Stacks (Savings Circles)</Heading3>
      </div>

      <Body className="text-surface-grey-2 mb-4">
        Participate in community savings circles with BREAD
      </Body>

      <LiftedButton disabled className="opacity-50 cursor-not-allowed">
        Coming Soon
      </LiftedButton>
    </CardBox>
  );
}
