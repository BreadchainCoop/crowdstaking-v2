"use client";

import { Heading3, Body, Caption } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useVaultAPY, FALLBACK_APY_VALUE } from "@/app/core/hooks/useVaultAPY";
import { formatBalance } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { Spinner } from "@/app/core/components/Icons/Spinner";

/**
 * YieldInfoCard Component
 *
 * Displays current APY, monthly yield, and yearly yield
 * Auto-calculates based on BREAD balance and vault APY
 */
export function YieldInfoCard() {
  const tokenBalances = useTokenBalances();
  const breadBalance = tokenBalances.BREAD;
  const { data: apyData, isLoading: apyLoading } = useVaultAPY();

  // Loading state
  if (breadBalance.status === "LOADING" || apyLoading) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">Yield Information</Heading3>
        <div className="flex justify-center py-8">
          <div className="size-8 text-breadgray-grey">
            <Spinner />
          </div>
        </div>
      </CardBox>
    );
  }

  // Error state - use fallback APY
  const apyPercentage = apyData
    ? Number(formatUnits(apyData, 16)) // APY is stored as basis points (18 decimals), display as percentage
    : FALLBACK_APY_VALUE;

  const balance = breadBalance.status === "SUCCESS" ? parseFloat(breadBalance.value) : 0;

  // Calculate yields
  const yearlyYield = balance * (apyPercentage / 100);
  const monthlyYield = yearlyYield / 12;

  return (
    <CardBox className="p-6">
      <Heading3 className="mb-4">Yield Information</Heading3>

      <div className="space-y-4">
        {/* Current APY */}
        <div>
          <Caption className="text-surface-grey-2 block text-xs mb-1">
            Current APY
          </Caption>
          <Body className="text-2xl font-bold">
            {formatBalance(apyPercentage, 2)}%
          </Body>
        </div>

        <div className="h-px bg-paper-2" />

        {/* Monthly Yield */}
        <div>
          <Caption className="text-surface-grey-2 block text-xs mb-1">
            Monthly Yield
          </Caption>
          <Body className="text-lg font-bold">
            {formatBalance(monthlyYield, 2)} BREAD
          </Body>
        </div>

        <div className="h-px bg-paper-2" />

        {/* Yearly Yield */}
        <div>
          <Caption className="text-surface-grey-2 block text-xs mb-1">
            Yearly Yield
          </Caption>
          <Body className="text-lg font-bold">
            {formatBalance(yearlyYield, 2)} BREAD
          </Body>
        </div>
      </div>

      <Caption className="text-surface-grey-2 text-center block text-xs mt-6 opacity-70">
        Yield automatically donated to Bread Solidarity Fund
      </Caption>
    </CardBox>
  );
}
