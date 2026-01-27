import { notFound } from "next/navigation";
import { LPVotingPowerPage } from "./LPVotingPowerPage";
import { parseFeatureVar } from "@/app/core/util/parseFeatureVar";
import { VaultTokenBalanceProvider } from "./context/VaultTokenBalanceContext";
import { generateMetadata } from "@/lib/site-metadata";

export const metadata = generateMetadata({title: "LP Vaults"});

export default function LPVotingPower() {
  if (!parseFeatureVar(process.env.FEATURE_LP_VAULTS)) {
    notFound();
  }

  return (
    <VaultTokenBalanceProvider>
      <LPVotingPowerPage />
    </VaultTokenBalanceProvider>
  );
}
