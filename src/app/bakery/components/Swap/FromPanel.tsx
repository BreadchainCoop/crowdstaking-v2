import type { ChangeEventHandler } from "react";
import Input from "../Input";

import { formatBalance } from "@/app/core/util/formatter";
import Elipsis from "@/app/core/components/Elipsis";
import type { TSwapMode } from "./Swap";
import { TTokenBalanceState } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { XDAIIcon, BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import {
  PanelBalanceRow,
  PanelContainer,
  PanelContent,
  PanelLabel,
  PanelTokenRow,
  TokenBalanceContainer,
  TokenBalanceText,
  TokenLabelContainer,
  TokenLabelText,
} from "./SwapUI";
import { MaxButton } from "@/app/core/components/MaxButton";

interface IProps {
  inputValue: string;
  swapMode: TSwapMode;
  tokenBalance: null | TTokenBalanceState;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  /* eslint-disable-next-line */
  handleBalanceClick: (balance: string) => void;
}

export function FromPanel({
  inputValue,
  swapMode,
  tokenBalance,
  handleBalanceClick,
  handleInputChange,
}: IProps) {
  return (
    <PanelContainer>
      <PanelLabel>You pay</PanelLabel>
      <PanelContent>
        <PanelTokenRow>
          <Input
            name="from"
            value={inputValue}
            handleInputChange={handleInputChange}
          />
          <TokenLabelContainer>
            {swapMode === "BURN" ? <BreadIcon /> : <XDAIIcon />}
            <TokenLabelText>
              {swapMode === "BURN" ? "BREAD" : "xDAI"}
            </TokenLabelText>
          </TokenLabelContainer>
        </PanelTokenRow>
        <PanelBalanceRow>
          {tokenBalance ? (
            <TokenBalance
              tokenBalance={tokenBalance}
              handleBalanceClick={handleBalanceClick}
            />
          ) : (
            <TokenBalanceContainer> </TokenBalanceContainer>
          )}
        </PanelBalanceRow>
      </PanelContent>
    </PanelContainer>
  );
}

function TokenBalance({
  tokenBalance,
  handleBalanceClick,
}: {
  tokenBalance: TTokenBalanceState;
  /* eslint-disable-next-line */
  handleBalanceClick: (balance: string) => void;
}) {
  return (
    <TokenBalanceContainer>
      <TokenBalanceText>
        Balance:{" "}
        {tokenBalance.status === "LOADING" ? (
          <Elipsis />
        ) : tokenBalance.status === "SUCCESS" ? (
          <span
            title={`${parseFloat(tokenBalance.value).toString()} ${
              tokenBalance.tokenName
            }`}
          >
            {formatBalance(parseFloat(tokenBalance.value), 2)}
          </span>
        ) : (
          ""
        )}
      </TokenBalanceText>
      {tokenBalance.status === "SUCCESS" && (
        <MaxButton
          onClick={() => {
            handleBalanceClick(tokenBalance.value);
          }}
        >
          max
        </MaxButton>
      )}
    </TokenBalanceContainer>
  );
}
