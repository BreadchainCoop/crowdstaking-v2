"use client";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { VaultPanel } from "./components/VaultPanel";
import { VotingPowerPanel } from "./components/VotingPowerPanel";
import { Accordion } from "@radix-ui/react-accordion";

import { getConfig } from "@/chainConfig";

export function LPVotingPowerPage() {
  const { user } = useConnectedUser();
  const config = getConfig(
    user.status === "CONNECTED" ? user.chain.id : "DEFAULT"
  );

  return (
    <div className="w-full lg:max-w-[67rem] m-auto px-4 md:px-8">
      <div className="grid grid-cols[repeat(2, minmax(min-content, 1fr))] gap-4 md:gap-8">
        <div className="col-span-12 lg:col-span-8">
          <TitleSection />
        </div>
        <div className="col-span-12 lg:col-span-4 sm:flex sm:justify-center lg:justify-end">
          <VotingPowerPanel />
        </div>
        <div className="col-span-12">
          <Accordion type="single" collapsible>
            <VaultPanel tokenAddress={config.BUTTER.address} />
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function TitleSection() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl text-breadgray-grey100 dark:text-breadgray-ultra-white">
        Voting Power LP Vaults
      </h1>
      <p className="text-breadgray-rye dark:text-breadgray-grey max-w-xl">
        Lock your LP tokens in the vault(s) below to receive voting power and
        participate in Breadchain Cooperative governance voting cycles. When
        locking your LP tokens you receive voting power for the next voting
        cycle.
      </p>
    </div>
  );
}
