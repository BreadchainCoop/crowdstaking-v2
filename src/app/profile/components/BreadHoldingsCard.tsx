"use client";

import { Heading3, Heading2, Caption, Body, LiftedButton, Logo } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useVaultAPY, FALLBACK_APY_VALUE } from "@/app/core/hooks/useVaultAPY";
import { useVaultTokenBalance } from "@/app/governance/lp-vaults/context/VaultTokenBalanceContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { formatBalance } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import Link from "next/link";

/**
 * BreadHoldingsCard Component (now includes LP position)
 *
 * Displays comprehensive BREAD overview:
 * - Total BREAD token balance
 * - LP position and voting power
 * - Current APY and yield projections
 */
export function BreadHoldingsCard() {
  const tokenBalances = useTokenBalances();
  const breadBalance = tokenBalances.BREAD;
  const { data: apyData, isLoading: apyLoading } = useVaultAPY();
  const vaultBalance = useVaultTokenBalance();
  const { user } = useConnectedUser();

  // Loading state
  if (!breadBalance || breadBalance.status === "LOADING" || apyLoading) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">BREAD Overview</Heading3>
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
        <Heading3 className="mb-4">BREAD Overview</Heading3>
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

  // LP balance
  const butterBalance = vaultBalance?.butter;
  const lpBalance = butterBalance?.status === "success"
    ? Number(butterBalance.value) / 10 ** 18
    : 0;
  const hasLPPosition = lpBalance > 0;

  // Check if LP vaults feature is enabled
  const lpVaultsEnabled = user.status === "CONNECTED" && user.features.lpVaults;

  return (
    <CardBox className="p-6">
      <Heading3 className="mb-4">BREAD Overview</Heading3>

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

          {/* Combined Stats */}
          <div className="space-y-4 mb-6">
            {/* LP Position */}
            {hasLPPosition && (
              <>
                <div>
                  <Caption className="text-surface-grey-2 block text-xs mb-1">
                    Locked LP Tokens
                  </Caption>
                  <Body className="text-lg font-bold">
                    {formatBalance(lpBalance, 2)}
                  </Body>
                </div>

                <div className="h-px bg-paper-2" />

                <div>
                  <Caption className="text-surface-grey-2 block text-xs mb-1">
                    Voting Power from LP
                  </Caption>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center">
                      <FistIcon />
                    </span>
                    <Body className="text-lg font-bold">
                      {formatBalance(lpBalance, 2)}
                    </Body>
                  </div>
                </div>

                <div className="h-px bg-paper-2" />
              </>
            )}

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
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <Logo size={20} />
                </span>
                <Body className="text-lg font-bold">
                  {formatBalance(monthlyYield, 2)}
                </Body>
              </div>
            </div>

            <div className="h-px bg-paper-2" />

            {/* Yearly Yield */}
            <div>
              <Caption className="text-surface-grey-2 block text-xs mb-1">
                Yearly Yield
              </Caption>
              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <Logo size={20} />
                </span>
                <Body className="text-lg font-bold">
                  {formatBalance(yearlyYield, 2)}
                </Body>
              </div>
            </div>
          </div>

          <Caption className="text-surface-grey-2 text-center block text-xs mb-4 opacity-70">
            Yield automatically donated to Bread Solidarity Fund
          </Caption>

          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <LiftedButton className="w-full">
                Bake BREAD
              </LiftedButton>
            </Link>
            {lpVaultsEnabled && hasLPPosition && (
              <Link href="/governance/lp-vaults" className="flex-1">
                <LiftedButton className="w-full">
                  Manage LP
                </LiftedButton>
              </Link>
            )}
            {lpVaultsEnabled && !hasLPPosition && (
              <Link href="/governance/lp-vaults" className="flex-1">
                <LiftedButton className="w-full">
                  Explore LP
                </LiftedButton>
              </Link>
            )}
          </div>
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
