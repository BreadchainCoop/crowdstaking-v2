// "use client";
import { Suspense } from "react";
import { type Metadata } from "next";

import { AppTitle } from "./bakery/components/AppTitle";
import FAQWrapper from "./components/FAQWrapper";
import SwapWrapper from "./components/SwapWrapper";

export const metadata: Metadata = {
  title: "Bread Crowdstaking",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
};

export default function Home() {
  return (
    <>
      <AppTitle />
      <div className="min-h-[38rem] min-h-sm:h-[44rem]">
        <Suspense>
          <SwapWrapper />
        </Suspense>
      </div>
      <FAQWrapper />
    </>
  );
}
