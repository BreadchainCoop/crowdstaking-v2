import { generateMetadata } from "@/lib/site-metadata";
import { GovernancePage } from "./GovernancePage";
import { Markee, MARKEE_ADDRESS } from "@/app/bakery/components/Markee";
import { Metadata } from "next";

export const metadata = generateMetadata({title: "Bread Coop Governance"});

export default function Governance() {
  return (
    <>
      {/* GovernancePage only renders its content after on-chain data loads, so
          the server HTML carries this marker for markee.xyz site verification. */}
      <span hidden data-markee-address={MARKEE_ADDRESS} />
      <GovernancePage markee={<Markee />} />
    </>
  );
}
