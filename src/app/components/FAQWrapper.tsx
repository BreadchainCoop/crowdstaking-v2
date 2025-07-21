"use client";

import dynamic from "next/dynamic";

const FAQ = dynamic(() => import("../bakery/components/FAQ/FAQ"), {
  ssr: false,
});

export default function FAQWrapper() {
  return <FAQ />;
}
