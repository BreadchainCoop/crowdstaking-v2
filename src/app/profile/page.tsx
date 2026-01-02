import { Metadata } from "next";
import { ProfilePage } from "./ProfilePage";
import { VaultTokenBalanceProvider } from "@/app/governance/lp-vaults/context/VaultTokenBalanceContext";

export const metadata: Metadata = {
  title: "My Profile - Bread Crowdstaking",
  description: "View your BREAD holdings, yield, LP positions, and voting history",
};

export default function Profile() {
  return (
    <VaultTokenBalanceProvider>
      <ProfilePage />
    </VaultTokenBalanceProvider>
  );
}
