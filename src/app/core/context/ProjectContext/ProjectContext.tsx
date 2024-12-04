import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { useNetwork, useContractRead } from "wagmi";
import { getConfig } from "@/chainConfig";
import { formatBalance } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { ERC20_ABI } from "@/abi";
import { DISTRIBUTOR_ABI } from "@/abi";

export type TSupportedDataKeys = "POWER" | "BREAD";

export type TContractDataState =
  | { status: "LOADING" }
  | { status: "ERROR" }
  | { status: "SUCCESS"; dataKey: TSupportedDataKeys; value: string };

export type TProjectDataState = {
  [K in TSupportedDataKeys]: null | TContractDataState;
};

const initialState: TProjectDataState = {
  BREAD: null,
  POWER: null,
};

type ProjectContextType = {
  project: TProjectDataState;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
  cycleLength: number;
  address: `0x${string}`; // Ensuring address is a hex string
}

const ProjectsProvider = ({
  children,
  cycleLength,
  address,
}: ProjectProviderProps) => {
  const [breadBalanceState, setBreadBalanceState] =
    useState<TContractDataState>({ status: "LOADING" });
  const [votingPowerState, setVotingPowerState] = useState<TContractDataState>({
    status: "LOADING",
  });
  const { chain: activeChain } = useNetwork();
  const config = activeChain ? getConfig(activeChain.id) : getConfig("DEFAULT");
  const distributorAddress = config.DISBURSER.address;

  // BREAD token balance
  const { data: breadBalanceData, status: breadBalanceStatus } =
    useContractRead({
      address: config.BREAD.address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address],
      watch: true,
    });

  // Current voting power
  const {
    data: currentVotingPowerData,
    status: currentVotingPowerStatus,
    error: currentVotingPowerError,
  } = useContractRead({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "getCurrentVotingPower",
    args: [address],
  });

  useEffect(() => {
    if (currentVotingPowerStatus === "error") {
      setVotingPowerState({ status: "ERROR" });
    } else if (
      currentVotingPowerStatus === "success" &&
      currentVotingPowerData
    ) {
      const value = formatBalance(
        Number(formatUnits(currentVotingPowerData as bigint, 18)) / cycleLength,
        0
      );
      setVotingPowerState({ status: "SUCCESS", dataKey: "POWER", value });
    }
  }, [currentVotingPowerData, currentVotingPowerStatus, cycleLength]);

  useEffect(() => {
    if (breadBalanceStatus === "error") {
      setBreadBalanceState({ status: "ERROR" });
    } else if (breadBalanceStatus === "success" && breadBalanceData) {
      const value = formatUnits(breadBalanceData, 18);
      setBreadBalanceState({ status: "SUCCESS", dataKey: "BREAD", value });
    } else if (breadBalanceStatus === "success") {
      const value = "0.00";
      setBreadBalanceState({ status: "SUCCESS", dataKey: "BREAD", value });
    }
  }, [breadBalanceData, breadBalanceStatus]);

  const value = useMemo(
    () => ({ project: { BREAD: breadBalanceState, POWER: votingPowerState } }),
    [breadBalanceState, votingPowerState]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export { ProjectsProvider, useProject };
