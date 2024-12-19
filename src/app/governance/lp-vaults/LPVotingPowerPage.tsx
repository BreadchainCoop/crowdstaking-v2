"use client";
import { useEffect, useState } from "react";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { VaultPanel } from "./components/VaultPanel";
import { VotingPowerPanel } from "./components/VotingPowerPanel";
import { Accordion } from "@radix-ui/react-accordion";
import { getConfig } from "@/chainConfig";
import useLocalStorage from "@/app/core/hooks/useLocalStorage";

export function LPVotingPowerPage() {
  const { user } = useConnectedUser();
  const config = getConfig(
    user.status === "CONNECTED" ? user.chain.id : "DEFAULT"
  );
  const [setLocalStorage, getLocalStorage] = useLocalStorage();

  const [accordionState, setAccordionState] = useState(
    getLocalStorage("lpAccordionValue")
  );

  // Update localStorage to persist the accordion state between renders
  useEffect(() => {
    setLocalStorage("lpAccordionValue", accordionState);
  }, [accordionState]);

  return (
    <div className="w-full lg:max-w-[67rem] m-auto px-4 md:px-8 grid gap-4">
      <div className="flex flex-wrap gap-6">
        <div className="grow">
          <TitleSection />
        </div>
        <div className="grow">
          <VotingPowerPanel />
        </div>
      </div>
      <div className="w-full">
        <h2 className="font-bold text-xl">Manage your BREAD LP vaults</h2>
        <p className="text-breadgray-rye dark:text-breadgray-grey mt-2 mb-4">
          Lock LP tokens for voting power within the Breadchain cooperative
          network
        </p>
        <Accordion
          value={accordionState}
          onValueChange={setAccordionState}
          type="single"
          collapsible
        >
          <VaultPanel tokenAddress={config.BUTTER.address} />
        </Accordion>
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
