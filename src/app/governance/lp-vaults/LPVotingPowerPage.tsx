"use client";
import { VaultPanel } from "./components/VaultPanel";
import { VotingPowerPanel } from "./components/VotingPowerPanel";
import { Accordion } from "@radix-ui/react-accordion";

export function LPVotingPowerPage() {
  return (
    <div className="lg:max-w-[67rem] m-auto p-4 md:py-8 md:px-8">
      <div className="grid grid-cols[repeat(2, minmax(min-content, 1fr))] gap-4 md:gap-8">
        <div className="col-span-12 md:col-span-8">
          <TitleSection />
        </div>
        <div className="col-span-12 md:col-span-4">
          <VotingPowerPanel />
        </div>
        <div className="col-span-12">
          <Accordion type="single" collapsible>
            <VaultPanel tokenAddress="0xf3d8f3de71657d342db60dd714c8a2ae37eac6b4" />
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function TitleSection() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl text-breadgray-ultra-white">
        Voting Power LP Vaults
      </h1>
      <p className="text-breadgray-grey">
        Lock your LP tokens in the vault(s) below to receive voting power and
        participate in Breadchain Cooperative governance voting cycles. When
        locking your LP tokens you receive voting power for the next voting
        cycle.
      </p>
    </div>
  );
}