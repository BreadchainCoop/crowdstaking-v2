import { notFound } from "next/navigation";
import { Metadata } from "next";
import { parseFeatureVar } from "@/app/core/util/parseFeatureVar";
import { BoosterPage } from "./BoosterPage";

export const metadata: Metadata = {
  title: "Voting power boosters",
  description:
    "Get rewarded with voting power boosters. Fund post-capitalist web3.",
};

export default function Boosters() {
  if (!parseFeatureVar(process.env.FEATURE_BOOSTERS)) {
    notFound();
  }

  return <BoosterPage />;
}
