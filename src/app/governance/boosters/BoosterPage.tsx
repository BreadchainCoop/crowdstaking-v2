"use client";
import { useEffect, useState } from "react";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { getConfig } from "@/chainConfig";
import { PageGrid } from "@/app/governance/components/PageGrid";
import { VotingPowerPanel } from "@/app/governance/boosters/components/VotingPowerPanel";
import { BoosterCard } from "@/app/governance/boosters/components/BoosterCard";
import { boostData } from "@/app/governance/boosters/data/BoostData";

export function BoosterPage() {
  const { user } = useConnectedUser();
  const config = getConfig(
    user.status === "CONNECTED" ? user.chain.id : "DEFAULT"
  );

  return (
    <section className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8">
      <PageGrid>
        <div className="col-span-12 lg:col-span-8 row-start-1 row-span-1">
          <TitleSection />
        </div>
        <VotingPowerPanel />
      </PageGrid>
      <div className="w-full pt-6">
        <h2 className="font-bold text-xl">All boosters?</h2>
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {BoosterList()}
        </div>
      </div>
    </section>
  );
}

function TitleSection() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-3xl text-breadgray-grey100 dark:text-breadgray-ultra-white">
        Voting Power Boosters
      </h1>
      <div className="max-w-xl text-lg text-breadgray-rye dark:text-breadgray-light-grey">
        <p>
          Active voter? Top baker? If this is you, the Breadchain cooperative
          rewards you with voting power boosters for your engaging support of
          post-capitalism. Be active and your voice will be amplified.{" "}
        </p>
      </div>
    </div>
  );
}

function BoosterList() {
  return (
      boostData.map((boost, index) => {
        const now = new Date();
        const timeDifference = boost.expiration.getTime() - now.getTime();
        const daysUntilExpiration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return (
          <BoosterCard
            key={index}
            iconName={boost.iconName}
            boosterName={boost.boosterName}
            verified={boost.verified}
            boostAmmount={boost.boostAmmount}
            boostAmmountSubtitle={boost.boostAmmountSubtitle}
            description={boost.description}
            expiration={daysUntilExpiration}
            expirationUrgent={boost.expirationUrgent}
          />
        );
      })
  );
}
