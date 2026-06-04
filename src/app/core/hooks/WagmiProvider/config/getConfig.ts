import { privyWagmiConfig } from "./privyConfig";

/**
 * Single source of truth for the app's wagmi config. Now Privy-managed
 * (embedded wallet as the active account); the old RainbowKit dev/prod configs
 * are no longer used.
 */
export function getConfig() {
	return { config: privyWagmiConfig, chains: privyWagmiConfig.chains };
}
