"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Swap = dynamic(() => import("./bakery/components/Swap/Swap"), {
  ssr: false,
});

const FAQ = dynamic(() => import("./bakery/components/FAQ"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="grow">
      <div className="py-2 md:py-8">
        <h1 className="hidden md:flex justify-center text-[2.5rem] font-pressstart uppercase leading-tight">
          <span>Bread</span>
        </h1>
        <h2 className="flex justify-center uppercase md:text-2xl tracking-[0.1rem] font-bold md:font-normal">
          <span>crowdstaking</span>
        </h2>
      </div>
      <Suspense>
        <Swap />
        <FAQ />
      </Suspense>
    </main>
  );
}
