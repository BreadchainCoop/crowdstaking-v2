"use client";

import { Heading3, Heading2, Caption, Body, LiftedButton, Logo } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useVaultAPY, FALLBACK_APY_VALUE } from "@/app/core/hooks/useVaultAPY";
import { formatBalance } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import Link from "next/link";

/**
 * BreadHoldingsCard Component
 *
 * Displays user's total BREAD token balance and yield information
 * Combined card showing holdings, APY, monthly yield, and yearly yield
 */
export function BreadHoldingsCard() {
  const tokenBalances = useTokenBalances();
  const breadBalance = tokenBalances.BREAD;
  const { data: apyData, isLoading: apyLoading } = useVaultAPY();

  // Loading state
  if (!breadBalance || breadBalance.status === "LOADING" || apyLoading) {
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

  // Error state for balance
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

  // APY with fallback
  const apyPercentage = apyData
    ? Number(formatUnits(apyData, 16)) // APY is stored as basis points (18 decimals), display as percentage
    : FALLBACK_APY_VALUE;

  // Calculate yields
  const yearlyYield = balance * (apyPercentage / 100);
  const monthlyYield = yearlyYield / 12;

  return (
    <CardBox className="p-6">
      <Heading3 className="mb-4">BREAD Holdings & Yield</Heading3>

      {hasBalance ? (
        <>
          {/* BREAD Balance */}
          <div className="text-center py-6 mb-6 bg-paper-2 border border-paper-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Logo size={32} />
              <Heading2 className="text-4xl">
                {formatBalance(balance, 2)}
              </Heading2>
            </div>
            <Caption className="text-surface-grey-2">Total $BREAD Balance</Caption>
          </div>

          {/* Yield Information */}
          <div className="space-y-4 mb-6">
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

          <Caption className="text-surface-grey-2 text-center block text-xs mb-4 opacity-70">
            Yield automatically donated to Bread Solidarity Fund
          </Caption>

          <Link href="/" className="block">
            <LiftedButton className="w-full">
              Bake BREAD
            </LiftedButton>
          </Link>
        </>
      ) : (
        <div className="text-center py-6">
          <Body className="text-surface-grey-2 mb-4">
            You don&apos;t have any BREAD yet
          </Body>
          <Link href="/">
            <LiftedButton>
              Bake BREAD
            </LiftedButton>
          </Link>
        </div>
      )}
    </CardBox>
  );
}
