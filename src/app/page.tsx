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

export const metadata: Metadata = {
  title: "Bread Crowdstaking",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
};

export default function Home() {
  return (
    // <div className="px-4">
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
        <div className="md:max-w-[32rem]">
          <div className="flex flex-col items-end mb-6">
            <div className="flex items-center justify-start">
              <Logo variant="line" className="mr-4" />
              <p className="flex items-end justify-start flex-nowrap xl:block">
                <span className="text-h1 md:text-[5rem]">50,067</span>
                <span className="text-h2 !text-2xl text-surface-grey-2 relative top-1.5 md:-left-2 md:top-[-0.4rem] xl:top-[-0.1rem]">
                  .5676
                </span>
              </p>
            </div>
            <Body className="text-surface-grey">
              ($ 50,067.56 USD)
            </Body>
          </div>
          <Heading3 className="text-2xl">Interest generated overtime</Heading3>
          <Body className="text-surface-grey text-[0.75rem] mb-3">
            This is the total interest accumulated since start of
            the fund in $BREAD.*
          </Body>
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
