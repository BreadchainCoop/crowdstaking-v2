import { formatUnits } from "viem";
import { FistIcon } from "../../Icons/FistIcon";
import clsx from "clsx";
import { ReactNode } from "react";
import { formatBalance } from "@/app/core/util/formatter";

export function LockVPRate({ value }: { value: bigint }) {
  const tokenAmount = formatBalance(Number(formatUnits(value, 18)), 3);
  const vpAmount = tokenAmount;

  return (
    <VPRateGrid>
      <LeftLabel>
        <TextLabel>Locked LP tokens</TextLabel>
      </LeftLabel>
      <RightLabel>
        <TextLabel>Voting Power</TextLabel>
      </RightLabel>

      <LeftValueDisplay>
        <div className="dark:bg-breadgray-burnt rounded-full flex gap-2 items-center px-2 py-1">
          <img src="/wxdai_bread_lp_icon.png" alt="wxdai bread lp token icon" />
          <ValueText>{tokenAmount}</ValueText>
        </div>
      </LeftValueDisplay>
      <EqualityIcon />

      <RightValueDisplay>
        <div className="dark:bg-breadgray-burnt rounded-full flex gap-2 items-center px-2 py-1">
          <div className="size-6 rounded-full dark:bg-breadgray-toast">
            <FistIcon />
          </div>
          <ValueText>~ {vpAmount}</ValueText>
        </div>
      </RightValueDisplay>
    </VPRateGrid>
  );
}

export function UnlockVPRate({ value }: { value: bigint }) {
  const tokenAmount = formatBalance(Number(formatUnits(value, 18)), 3);
  const vpAmount = tokenAmount;

  return (
    <VPRateGrid>
      <LeftLabel>
        <TextLabel>Voting Power</TextLabel>
      </LeftLabel>
      <RightLabel>
        <TextLabel>Locked LP tokens</TextLabel>
      </RightLabel>

      <LeftValueDisplay>
        <PillContainer>
          <div className="size-6 rounded-full dark:bg-breadgray-toast">
            <FistIcon />
          </div>
          <ValueText>~ {vpAmount}</ValueText>
        </PillContainer>
      </LeftValueDisplay>
      <EqualityIcon />

      <RightValueDisplay>
        <PillContainer>
          <WXDaiBreadIcon />
          <ValueText>{tokenAmount}</ValueText>
        </PillContainer>
      </RightValueDisplay>
    </VPRateGrid>
  );
}

function VPRateGrid({ children }: { children: ReactNode }) {
  return (
    <div className="w-full grid gap-y-1 grid-cols-[1fr_2rem_1fr] grid-rows-[auto_1fr]">
      {children}
    </div>
  );
}
function TextLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium dark:text-breadgray-grey text-breadgray-natural text-breadgray-grey">
      {children}
    </p>
  );
}

function LeftLabel({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-1 row-span-1 row-start-1 flex justify-end">
      <TextLabel>{children}</TextLabel>
    </div>
  );
}

function RightLabel({ children }: { children: ReactNode }) {
  return (
    <div className={clsx("col-span-1 row-span-1 col-start-3 row-start-1 flex")}>
      <TextLabel>{children}</TextLabel>
    </div>
  );
}

function EqualityIcon() {
  return (
    <div className="row-start-2 col-start-2 flex items-center justify-center">
      =
    </div>
  );
}

function LeftValueDisplay({ children }: { children: ReactNode }) {
  return <div className="row-start-2 flex justify-end">{children}</div>;
}

function RightValueDisplay({ children }: { children: ReactNode }) {
  return <div className="row-start-2 col-start-3 flex">{children}</div>;
}

export function WXDaiBreadIcon() {
  return <img src="/wxdai_bread_lp_icon.png" alt="wxdai bread lp token icon" />;
}

export function PillContainer({ children }: { children: ReactNode }) {
  return (
    <div className="dark:bg-breadgray-burnt rounded-full flex gap-2 items-center px-2 py-1">
      {children}
    </div>
  );
}

export function ValueText({ children }: { children: ReactNode }) {
  return (
    <div className="text-xl font-semibold dark:text-breadgray-ultra-white">
      {children}
    </div>
  );
}
