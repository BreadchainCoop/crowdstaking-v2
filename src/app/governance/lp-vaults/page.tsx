import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LPVotingPowerPage } from "./LPVotingPowerPage";
import { parseFeatureVar } from "@/app/core/util/parseFeatureVar";
import { VaultTokenBalanceProvider } from "./context/VaultTokenBalanceContext";

export const metadata: Metadata = {
  title: "LP Vaults",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
};

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
