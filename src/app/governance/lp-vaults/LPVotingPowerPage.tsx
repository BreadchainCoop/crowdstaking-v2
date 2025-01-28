"use client";
import { useEffect, useState } from "react";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { VaultPanel } from "./components/VaultPanel";
import { VotingPowerPanel } from "./components/VotingPowerPanel";
import { Accordion } from "@radix-ui/react-accordion";
import { getConfig } from "@/chainConfig";
import useLocalStorage from "@/app/core/hooks/useLocalStorage";
import { PageGrid } from "@/app/governance/components/PageGrid";

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
  }, [accordionState, setLocalStorage]);

  return (
    <section className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8">
      <PageGrid>
        <div className="col-span-12 lg:col-span-8 row-start-1 row-span-1">
          <TitleSection />
        </div>

        <VotingPowerPanel />
      </PageGrid>
      <div className="w-full pt-6">
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
    </section>
  );
}

function TitleSection() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-3xl text-breadgray-grey100 dark:text-breadgray-ultra-white">
        Voting Power LP Vaults
      </h1>
      <div className="max-w-xl text-lg text-breadgray-rye dark:text-breadgray-light-grey">
        <p>
          This page lets you provide liquidity for BREAD while maintaining your
          voting power for governing the monthly BREAD crowdstaking yield
          distribution. By staking your LP tokens into a vault, you still get
          your voting power as if you are holding BREAD normally.
        </p>
        <h4 className="mt-5 mb-2 font-bold text-2xl leading-none text-breadgray-grey100 dark:text-breadgray-ultra-white">
          Get Started:
        </h4>
        <ol className="list-decimal px-5">
          <li>
            <b>Provide Liquidity:</b> Add liquidity for BREAD on the listed
            liquidity pool of the vault to receive LP tokens.
          </li>
          <li>
            <b>Stake Your LP Tokens:</b> Deposit your LP tokens into the vault
            to retain your governance rights.
          </li>
          <li>
            <b>Participate in Governance:</b> Share your preferences for the
            monthly distribution on the vote page.
          </li>
        </ol>
      </div>
    </div>
  );
}
