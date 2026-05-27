import { type Metadata } from "next";
import { ProfilePage } from "./ProfilePage";
import { VaultTokenBalanceProvider } from "@/app/governance/lp-vaults/context/VaultTokenBalanceContext";

export const metadata: Metadata = {
	title: "My Account | Bread Solidarity Fund",
	description: "View your BREAD holdings, yield, and Solidarity Fund stats",
};

export default function Profile() {
	return (
		<VaultTokenBalanceProvider>
			<ProfilePage />
		</VaultTokenBalanceProvider>
	);
}
