import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNetwork, useQuery } from "wagmi";
import { multicall } from "@wagmi/core";
import { Hex } from "viem";

import { getConfig } from "@/chainConfig";
import { DISTRIBUTOR_ABI } from "@/abi";

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
  const [votingPowerState, setVotingPowerState] = useState<TVotingPowerState>({
    bread: { status: "loading" },
    butteredBread: { status: "loading" },
  });
  const network = useNetwork();
  const config = getConfig(network.chain?.id || "DEFAULT");

  const { data, status, error } = useQuery(["vpMulticall"], async () => {
    return await multicall({
      contracts: [
        {
          address: config.DISBURSER.address,
          abi: DISTRIBUTOR_ABI,
          functionName: "getVotingPowerForPeriod",
          args: [
            config.BREAD.address,
            previousCycleStartingBlock,
            lastClaimedBlocknumber,
            account,
          ],
        },
        {
          address: config.DISBURSER.address,
          abi: DISTRIBUTOR_ABI,
          functionName: "getVotingPowerForPeriod",
          args: [
            config.BUTTERED_BREAD.address,
            previousCycleStartingBlock,
            lastClaimedBlocknumber,
            account,
          ],
        },
      ],
    });
  });

  useEffect(() => {
    if (status === "error") {
      setVotingPowerState(() => ({
        bread: { status: "error" },
        butteredBread: { status: "error" },
      }));
      return;
    }
    if (status === "success" && data && data[0].result && data[1].result) {
      const cycleLength = lastClaimedBlocknumber - previousCycleStartingBlock;
      const breadResult = data[0].result / cycleLength;
      const butteredBreadResult = data[1].result / cycleLength;

      setVotingPowerState(() => ({
        bread: { status: "success", value: breadResult },
        butteredBread: { status: "success", value: butteredBreadResult },
      }));
    }
  }, [data, status, error, lastClaimedBlocknumber, previousCycleStartingBlock]);

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
