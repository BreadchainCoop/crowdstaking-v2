// "use client";
import { Suspense } from "react";
import { type Metadata } from "next";

import { AppTitle } from "./bakery/components/AppTitle";
import FAQWrapper from "./components/FAQWrapper";
import SwapWrapper from "./components/SwapWrapper";
import { Body, Caption, Heading1, Heading3, Logo } from "@breadcoop/ui";
import { Chip } from "./bakery/components/Chip";
import { Apy } from "./bakery/components/Apy";
import { BreadCirculation } from "./bakery/components/BreadCirculation";
import clsx from "clsx";
import { WRAPPER_CLASSES } from "./core/util/classes";
import { Interest } from "./bakery/components/Interest";

export const metadata: Metadata = {
  title: "Bread Crowdstaking",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
};

export default function Home() {
  return (
    <div className={clsx(WRAPPER_CLASSES, "md:pr-14")}>
      <div className="md:grid md:grid-cols-2 md:gap-x-6">
        <Heading1 className="text-[2.5rem] text-primary-orange mb-4 md:max-w-[32rem] md:flex md:flex-col md:leading-[0.9]">
          <span>THE</span> <span>SOLIDARITY</span> <span>FUND</span>
        </Heading1>
        <div className="row-span-2">
          <Suspense>
            <SwapWrapper />
          </Suspense>
        </div>
        {/* Akzidenz-Grotesk Next */}
        <div className="md:max-w-[32rem]">
          <Interest />
          <div>
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
      {/* <FAQWrapper /> */}
    </div>
  );
}
