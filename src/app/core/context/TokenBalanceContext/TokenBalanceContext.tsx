import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getChain } from "@/chainConfig";
import {
  useRefetchOnBlockChangeForUser,
  useRefetchBalanceOnBlockChange,
} from "@/app/core/hooks/useRefetchOnBlockChange";
import {
  TUserConnected,
  useConnectedUser,
} from "@/app/core/hooks/useConnectedUser";
import { ERC20_ABI } from "@/abi";
import { formatUnits } from "viem";

export type TSupportedTokenKeys = "xDAI" | "BREAD" | "BUTTER";

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
  BUTTER: null,
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

  const [butterBalanceState, setButterBalanceState] =
    useState<TTokenBalanceState>({
      status: "LOADING",
    });

  const config = getChain(user.chain.id);
  // BREAD balance
  const { data: breadBalanceData, status: breadBalanceStatus } =
    useRefetchOnBlockChangeForUser(
      user.address,
      config.BREAD.address,
      ERC20_ABI,
      "balanceOf",
      [user.address]
    );

  useEffect(() => {
    if (breadBalanceStatus === "error") {
      console.error("bread balance error!");
    }
    if (breadBalanceStatus === "success") {
      const value =
        typeof breadBalanceData === "bigint"
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
  } = useRefetchBalanceOnBlockChange(user.address);

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

  // BUTTER balance
  const { data: butterBalanceData, status: butterBalanceStatus } =
    useRefetchOnBlockChangeForUser(
      user.address,
      config.BUTTER.address,
      ERC20_ABI,
      "balanceOf",
      [user.address]
    );

  useEffect(() => {
    if (butterBalanceStatus === "error") {
      console.error("butter balance error!");
    }
    if (butterBalanceStatus === "success") {
      const value =
        typeof butterBalanceData === "bigint"
          ? formatUnits(butterBalanceData, 18).toString()
          : "0";

      setButterBalanceState({
        status: "SUCCESS",
        tokenName: "BUTTER",
        value,
      });
    }
  }, [butterBalanceData, butterBalanceStatus]);

  const value = useMemo(
    () => ({
      xDAI: xdaiBalanceState,
      BREAD: breadBalanceState,
      BUTTER: butterBalanceState,
    }),
    [breadBalanceState, xdaiBalanceState, butterBalanceState]
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
