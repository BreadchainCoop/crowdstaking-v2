import { ProfilePage } from "./ProfilePage";
import { VaultTokenBalanceProvider } from "@/app/governance/lp-vaults/context/VaultTokenBalanceContext";
import { generateMetadata } from "@/lib/site-metadata";

export const metadata = generateMetadata({
	title: "My Account | Bread Solidarity Fund",
	description: "View your BREAD holdings, yield, and Solidarity Fund stats",
});

export default function Profile() {
	return (
		<VaultTokenBalanceProvider>
			<ProfilePage />
		</VaultTokenBalanceProvider>
	);
}
