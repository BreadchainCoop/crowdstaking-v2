// "use client";
import { Suspense } from "react";
import { type Metadata } from "next";

import { AppTitle } from "./bakery/components/AppTitle";
import FAQWrapper from "./components/FAQWrapper";
import SwapWrapper from "./components/SwapWrapper";
import { Body, Heading1, Heading2, LiftedButton } from "@breadcoop/ui";
import { Apy } from "./bakery/components/Apy";
import { BreadCirculation } from "./bakery/components/BreadCirculation";
import clsx from "clsx";
import { WRAPPER_CLASSES } from "./core/util/classes";
import { Interest } from "./bakery/components/Interest";
import { ProjectBackers } from "./bakery/components/Backers";
import { MonthlyVoters } from "./bakery/components/MonthlyVoters";
import { ViewAnalytics } from "./bakery/components/Analytics";
import Actions from "./bakery/components/Actions";

export const metadata: Metadata = {
  title: "Bread Crowdstaking",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
};

export default function Home() {
  return (
    <div className={clsx(WRAPPER_CLASSES, "")}>
      <div className="md:grid md:grid-cols-2 md:gap-x-6">
        <Heading1 className="text-[2.5rem] text-primary-orange mb-4 md:max-w-[32rem] md:flex md:flex-col md:leading-[0.9] md:text-[3.5rem] lg:text-[4rem]">
          <span>THE</span> <span>SOLIDARITY</span> <span>FUND</span>
        </Heading1>
        <div className="row-span-2">
          <Suspense>
            <SwapWrapper />
          </Suspense>
        </div>
        <div className="md:max-w-[32rem]">
          <Interest />
          <div className="md:flex md:items-center md:justify-start md:gap-4">
            <BreadCirculation />
            <Apy />
          </div>
        </div>
      </div>
      {/* <AppTitle /> */}
      {/* <div className="min-h-[38rem] min-h-sm:h-[44rem]">
        <Suspense>
          <SwapWrapper />
        </Suspense>
      </div> */}
      <div className="mt-12 md:flex md:items-start md:justify-between md:gap-8">
        <figure className="w-[23.82rem] h-[16rem] ml-auto bg-orange-0 overflow-hidden relative right-[-1rem] mb-8 md:w-[33.125rem] md:h-[22.25rem] md:order-2 md:right-[-1.5rem] md:static md:mt-8 md:grow-0">
          <img
            src="/bake_hand_mobile.png"
            alt=""
            className="w-full h-full aspect-auto object-cover md:hidden"
          />
          <img
            src="/bake_hand_desktop.png"
            alt=""
            className="hidden md:block w-full h-full aspect-auto object-cover md:aspect-square"
          />
        </figure>
        <div className="md:max-w-[32rem]">
          <div className="max-w-[42.375rem] md:max-w-[30rem]">
            <Heading2>In this fund, we decide together.</Heading2>
            <Body className="mt-4">
              We are unique because we allow anyone that bakes and
              holds $BREAD to decide over where the interest
              should go.
            </Body>
          </div>
          <div>
            <div className="flex items-center justify-start flex-wrap gap-4 mb-2 mt-4">
              <ProjectBackers />
              <MonthlyVoters />
            </div>
            <ViewAnalytics />
          </div>
          <Actions />
        </div>
      </div>
      <FAQWrapper />
    </div>
  );
}
