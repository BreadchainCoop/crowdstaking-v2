"use client";

import { Heading3, Heading2, Caption, Body } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { formatBalance } from "@/app/core/util/formatter";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import Link from "next/link";

/**
 * BreadHoldingsCard Component
 *
 * Displays user's total BREAD token balance
 */
export function BreadHoldingsCard() {
  const tokenBalances = useTokenBalances();
  const breadBalance = tokenBalances.BREAD;

  // Loading state
  if (breadBalance.status === "LOADING") {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">BREAD Holdings</Heading3>
        <div className="flex justify-center py-8">
          <div className="size-8 text-breadgray-grey">
            <Spinner />
          </div>
        </div>
      </CardBox>
    );
  }

  // Error state
  if (breadBalance.status === "ERROR") {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">BREAD Holdings</Heading3>
        <Body className="text-surface-grey-2 text-center py-4">
          Unable to load balance
        </Body>
      </CardBox>
    );
  }

  const balance = parseFloat(breadBalance.value);
  const hasBalance = balance > 0;

  return (
    <CardBox className="p-6">
      <Heading3 className="mb-4 flex items-center gap-2">
        BREAD Holdings
      </Heading3>

      {hasBalance ? (
        <>
          <div className="text-center py-6">
            <Heading2 className="text-4xl mb-2">
              {formatBalance(balance, 2)}
            </Heading2>
            <Caption className="text-surface-grey-2">$BREAD</Caption>
          </div>
          <Caption className="text-surface-grey-2 text-center block text-xs">
            Total balance across wallet and LP vaults
          </Caption>
        </>
      ) : (
        <div className="text-center py-6">
          <Body className="text-surface-grey-2 mb-4">
            You don&apos;t have any BREAD yet
          </Body>
          <Link
            href="/"
            className="text-primary-orange hover:underline text-sm"
          >
            Get BREAD →
          </Link>
        </div>
      )}
    </CardBox>
  );
}
