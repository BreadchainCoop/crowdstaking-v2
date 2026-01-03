"use client";

import { Heading3, Body, Caption, LiftedButton } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { useVaultTokenBalance } from "@/app/governance/lp-vaults/context/VaultTokenBalanceContext";
import { formatBalance } from "@/app/core/util/formatter";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { Scales } from "@phosphor-icons/react";
import Link from "next/link";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";

/**
 * LPPositionCard Component
 *
 * Displays user's locked BUTTER/BREAD LP tokens and voting power
 */
export function LPPositionCard() {
  const vaultBalance = useVaultTokenBalance();
  const { user } = useConnectedUser();

  // Not connected state
  if (!vaultBalance) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">LP Position</Heading3>
        <Body className="text-surface-grey-2 text-center py-4">
          Connect wallet to view LP position
        </Body>
      </CardBox>
    );
  }

  const butterBalance = vaultBalance.butter;

  // Loading state
  if (butterBalance.status === "loading") {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">LP Position</Heading3>
        <div className="flex justify-center py-8">
          <div className="size-8 text-breadgray-grey">
            <Spinner />
          </div>
        </div>
      </CardBox>
    );
  }

  // Error state
  if (butterBalance.status === "error") {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">LP Position</Heading3>
        <Body className="text-surface-grey-2 text-center py-4">
          Unable to load LP position
        </Body>
      </CardBox>
    );
  }

  const lpBalance = Number(butterBalance.value) / 10 ** 18;
  const hasLPPosition = lpBalance > 0;

  // Check if LP vaults feature is enabled
  const lpVaultsEnabled = user.status === "CONNECTED" && user.features.lpVaults;

  return (
    <CardBox className="p-6">
      <Heading3 className="mb-4">LP Position</Heading3>

      {hasLPPosition ? (
        <>
          <div className="space-y-4 mb-6">
            {/* Locked LP Tokens */}
            <div>
              <Caption className="text-surface-grey-2 block text-xs mb-1">
                Locked LP Tokens
              </Caption>
              <Body className="text-2xl font-bold">
                {formatBalance(lpBalance, 2)}
              </Body>
              <Caption className="text-surface-grey-2 text-xs">
                BUTTER/BREAD LP
              </Caption>
            </div>

            <div className="h-px bg-paper-2" />

            {/* Voting Power */}
            <div>
              <Caption className="text-surface-grey-2 block text-xs mb-1">
                Voting Power from LP
              </Caption>
              <div className="flex items-center gap-2">
                <Scales size={20} weight="duotone" className="text-primary-orange" />
                <Body className="text-lg font-bold">
                  {formatBalance(lpBalance, 2)}
                </Body>
              </div>
            </div>
          </div>

          {lpVaultsEnabled && (
            <Link href="/governance/lp-vaults" className="block">
              <LiftedButton className="w-full">
                Manage LP Vaults
              </LiftedButton>
            </Link>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <Body className="text-surface-grey-2 mb-4">
            You don&apos;t have any LP positions yet
          </Body>
          {lpVaultsEnabled && (
            <Link href="/governance/lp-vaults">
              <LiftedButton>
                Explore LP Vaults
              </LiftedButton>
            </Link>
          )}
        </div>
      )}
    </CardBox>
  );
}
