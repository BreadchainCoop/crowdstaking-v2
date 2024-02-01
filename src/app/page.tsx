"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Toaster } from "./core/components/Toaster/Toaster";
import { AppTitle } from "./bakery/components/AppTitle";

const Swap = dynamic(() => import("./bakery/components/Swap/Swap"), {
  ssr: false,
});

const FAQ = dynamic(() => import("./bakery/components/FAQ"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="grow relative">
      {/* <Toaster /> */}
      <AppTitle />
      <Suspense>
        <Swap />
        <FAQ />
      </Suspense>
    </main>
  );
}
