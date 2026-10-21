import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import { multicall } from "@wagmi/core";
import { Hex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/app/core/hooks/WagmiProvider/config/getConfig";

import { DISTRIBUTOR_ABI } from "@/abi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";

export type VpTokenLoading = {
  status: "loading";
};

export type VpTokenError = {
  status: "error";
};

export type VpTokenSuccess = {
  status: "success";
  value: bigint;
};

export type TVotingPowerState = null | {
  bread: VpTokenLoading | VpTokenSuccess | VpTokenError;
  butteredBread: VpTokenLoading | VpTokenSuccess | VpTokenError;
};

export const VotingPowerContext = createContext<TVotingPowerState>(null);

export function VotingPowerProvider({
  account,
  previousCycleStartingBlock,
  lastClaimedBlocknumber,

  children,
}: {
  account: Hex;
  previousCycleStartingBlock: bigint;
  lastClaimedBlocknumber: bigint;

  children: ReactNode;
}) {
  const chainConfig = useActiveChain();

  const { data, status } = useQuery({
    queryKey: ["vpMulticall", chainConfig.ID, account],
    queryFn: async () => {
      return await multicall(getConfig().config, {
        chainId: chainConfig.ID,
        contracts: [
          {
            address: chainConfig.DISBURSER.address,
            abi: DISTRIBUTOR_ABI,
            functionName: "getVotingPowerForPeriod",
            args: [
              chainConfig.BREAD.address,
              previousCycleStartingBlock,
              lastClaimedBlocknumber,
              account,
            ],
          },
          {
            address: chainConfig.DISBURSER.address,
            abi: DISTRIBUTOR_ABI,
            functionName: "getVotingPowerForPeriod",
            args: [
              chainConfig.BUTTERED_BREAD.address,
              previousCycleStartingBlock,
              lastClaimedBlocknumber,
              account,
            ],
          },
        ],
      });
    },
  });

  const votingPowerState = useMemo<TVotingPowerState>(() => {
    if (status === "error") {
      return {
        bread: { status: "error" },
        butteredBread: { status: "error" },
      };
    }
    if (
      status === "success" &&
      data &&
      data[0].result !== undefined &&
      data[1].result !== undefined
    ) {
      const cycleLength = lastClaimedBlocknumber - previousCycleStartingBlock;
      return {
        bread: { status: "success", value: data[0].result / cycleLength },
        butteredBread: { status: "success", value: data[1].result / cycleLength },
      };
    }
    return {
      bread: { status: "loading" },
      butteredBread: { status: "loading" },
    };
  }, [data, status, lastClaimedBlocknumber, previousCycleStartingBlock]);

  return (
    <VotingPowerContext.Provider value={votingPowerState}>
      {children}
    </VotingPowerContext.Provider>
  );
}

export function useVotingPower() {
  const context = useContext(VotingPowerContext);
  if (context === undefined) {
    throw new Error("useVotingPower must be used within a VotingPowerProvider");
  }
  return context;
}
