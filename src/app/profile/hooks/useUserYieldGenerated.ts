import { useQuery } from "@tanstack/react-query";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { usePublicClient } from "wagmi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { formatUnits, parseAbiItem } from "viem";
import { BREAD_ADDRESS } from "@/constants";

/**
 * Calculate the total yield generated from a user's BREAD holdings
 *
 * Formula: Current Balance - (Total Minted - Total Burned)
 *
 * This represents the yield earned from the user's collateral over time,
 * as BREAD is a rebasing token where balances increase from yield accrual.
 */
export function useUserYieldGenerated() {
  const { user } = useConnectedUser();
  const userAddress = user.status === "CONNECTED" ? user.address : undefined;
  const tokenBalances = useTokenBalances();
  const breadBalance = tokenBalances.BREAD;
  const publicClient = usePublicClient();
  const chainConfig = useActiveChain();

  return useQuery<number>({
    queryKey: ["userYieldGenerated", userAddress],
    enabled: !!userAddress && !!publicClient,
    async queryFn() {
      if (!userAddress || !publicClient) return 0;

      // Get the user's current BREAD balance
      const currentBalance = breadBalance?.status === "SUCCESS"
        ? parseFloat(breadBalance.value)
        : 0;

      // Fetch all Transfer events involving this user to calculate net mints/burns
      // Transfer from 0x0 = mint, Transfer to 0x0 = burn
      const [mintLogs, burnLogs] = await Promise.all([
        // Mints (from address 0x0 to user)
        publicClient.getLogs({
          address: BREAD_ADDRESS,
          event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
          args: {
            from: "0x0000000000000000000000000000000000000000",
            to: userAddress,
          },
          fromBlock: BigInt(0),
          toBlock: "latest",
        }),
        // Burns (from user to address 0x0)
        publicClient.getLogs({
          address: BREAD_ADDRESS,
          event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
          args: {
            from: userAddress,
            to: "0x0000000000000000000000000000000000000000",
          },
          fromBlock: BigInt(0),
          toBlock: "latest",
        }),
      ]);

      // Calculate total minted
      const totalMinted = mintLogs.reduce((sum, log) => {
        const value = log.args.value ? Number(formatUnits(log.args.value, 18)) : 0;
        return sum + value;
      }, 0);

      // Calculate total burned
      const totalBurned = burnLogs.reduce((sum, log) => {
        const value = log.args.value ? Number(formatUnits(log.args.value, 18)) : 0;
        return sum + value;
      }, 0);

      // Net principal = minted - burned
      const netPrincipal = totalMinted - totalBurned;

      // Yield generated = current balance - net principal
      // If current balance is higher than principal, the difference is yield
      const yieldGenerated = Math.max(0, currentBalance - netPrincipal);

      return yieldGenerated;
    },
  });
}
