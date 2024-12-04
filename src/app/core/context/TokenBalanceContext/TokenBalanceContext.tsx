import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getConfig } from "@/chainConfig";
import { TUserConnected, useConnectedUser } from "../../hooks/useConnectedUser";
import { useBalance, useContractRead } from "wagmi";
import { ERC20_ABI } from "@/abi";
import { formatUnits } from "viem";

export type TSupportedTokenKeys = "xDAI" | "BREAD";

export type TTokenBalanceState =
  | {
      status: "LOADING";
    }
  | {
      status: "ERROR";
    }
  | {
      status: "SUCCESS";
      tokenName: TSupportedTokenKeys;
      value: string;
    };

export type TTokenBalancesState = {
  [K in TSupportedTokenKeys]: null | TTokenBalanceState;
};

const initialState = {
  xDAI: null,
  BREAD: null,
};

const TokenBalancesContext = createContext<TTokenBalancesState>(initialState);

function TokenBalancesProvider({ children }: { children: ReactNode }) {
  const { user } = useConnectedUser();

  if (user.status === "CONNECTED") {
    return <ProviderWithUser user={user}>{children}</ProviderWithUser>;
  }

  return (
    <TokenBalancesContext.Provider value={initialState}>
      {children}
    </TokenBalancesContext.Provider>
  );
}

function ProviderWithUser({
  user,
  children,
}: {
  user: TUserConnected;
  children: ReactNode;
}) {
  const [breadBalanceState, setBreadBalanceState] =
    useState<TTokenBalanceState>({ status: "LOADING" });

  const [xdaiBalanceState, setXdaiBalanceState] = useState<TTokenBalanceState>({
    status: "LOADING",
  });

  const config = getConfig(user.chain.id);
  // BREAD balance
  const { data: breadBalanceData, status: breadBalanceStatus } =
    useContractRead({
      address: config.BREAD.address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [user.address],
      watch: true,
    });

  useEffect(() => {
    if (breadBalanceStatus === "error") {
      console.error("bread balance error!");
    }
    if (breadBalanceStatus === "success") {
      const value = breadBalanceData
        ? formatUnits(breadBalanceData, 18).toString()
        : "0";

      setBreadBalanceState({
        status: "SUCCESS",
        tokenName: "BREAD",
        value,
      });
    }
  }, [breadBalanceData, breadBalanceStatus]);

  // xDAI (native) balance
  const {
    data: xDAIBalanceData,
    status: xDAIBalanceStatus,
    error: xDAIBalanceError,
  } = useBalance({
    address: user.address,
    watch: true,
  });

  useEffect(() => {
    if (xDAIBalanceStatus === "success" && xDAIBalanceData) {
      setXdaiBalanceState({
        status: "SUCCESS",
        tokenName: "xDAI",
        value: xDAIBalanceData.formatted,
      });
    }
    if (xDAIBalanceStatus === "error") {
      console.error("xdai balance error!");
    }
  }, [xDAIBalanceData, xDAIBalanceStatus, xDAIBalanceError]);

  const value = useMemo(
    () => ({
      xDAI: xdaiBalanceState,
      BREAD: breadBalanceState,
    }),
    [breadBalanceState, xdaiBalanceState]
  );

  return (
    <TokenBalancesContext.Provider value={value}>
      {children}
    </TokenBalancesContext.Provider>
  );
}

const useTokenBalances = () => {
  const context = useContext(TokenBalancesContext);
  if (context === undefined) {
    throw new Error(
      "useTokenBalances must be used within a TokenBalancesProvider"
    );
  }
  return context;
};

export { TokenBalancesProvider, useTokenBalances };
