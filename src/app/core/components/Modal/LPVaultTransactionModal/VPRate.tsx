import { formatUnits } from "viem";
import { FistIcon } from "../../Icons/FistIcon";
import { ReactNode } from "react";
import { formatBalance } from "@/app/core/util/formatter";
import { Chip } from "@/app/bakery/components/Chip";
import { Body } from "@breadcoop/ui";

export function LockVPRate({
  value,
  status,
}: {
  value: bigint;
  status: string;
}) {
  const tokenAmount = formatBalance(Number(formatUnits(value, 18)), 0);
  const vpAmount = tokenAmount;

  return (
    <VPRateGrid>
      <>
        <LpLabel />
        {/* empty div for column spacing */}
        <div className="w-12"></div>
        <VpLabel status={status} />
      </>
      <ValueDisplay>
        <PillContainer>
          <WXDaiBreadIcon />

          <ValueText>{tokenAmount}</ValueText>
        </PillContainer>
      </ValueDisplay>
      <EqualityIcon />
      <ValueDisplay>
        <PillContainer>
          <FistIcon />
          <ValueText>{vpAmount}</ValueText>
        </PillContainer>
      </ValueDisplay>
    </VPRateGrid>
  );
}

export function UnlockVPRate({ value }: { value: bigint }) {
  const tokenAmount = formatBalance(Number(formatUnits(value, 18)), 0);
  const vpAmount = tokenAmount;

  return (
    <VPRateGrid>
      <VpLabel />
      {/* empty div for column spacing */}
      <div className="w-12"></div>
      <LpLabel />
      <ValueDisplay>
        <PillContainer>
          <FistIcon />
          <ValueText>{vpAmount}</ValueText>
        </PillContainer>
      </ValueDisplay>
      <EqualityIcon />
      <ValueDisplay>
        <PillContainer>
          <WXDaiBreadIcon />
          <ValueText>{tokenAmount}</ValueText>
        </PillContainer>
      </ValueDisplay>
    </VPRateGrid>
  );
}

function VPRateGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center justify-center">
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

function LpLabel() {
  return (
    <div className="text-surface-grey col-span-1 row-span-1 justify-center flex">
      {/* <TextLabel>Locked LP tokens</TextLabel> */}
      <TextLabel>LP tokens</TextLabel>
    </div>
  );
}

function VpLabel({ status }: { status?: string }) {
  return (
    <div className="text-surface-grey col-span-1 row-span-1  justify-center flex">
      {status !== "success" && <TextLabel>Voting power</TextLabel>}
      {status === "success" && <TextLabel>Pending voting power</TextLabel>}
    </div>
  );
}

function EqualityIcon() {
  return (
    <div className="m-auto">
      <div className="mx-auto text-primary-orange text-3xl">=</div>
    </div>
  );
}

function ValueDisplay({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex w-full  gap-2 items-center">{children}</div>
  );
}

export function WXDaiBreadIcon() {
  return (
    <div>
      <img
        src="/breadwxdaihalves.svg"
        alt="bread and wxdai logos"
        className="size-6"
      />
    </div>
  );
}

export function PillContainer({ children }: { children: ReactNode }) {
  return (
    <Chip className="border-surface-ink py-1! px-4! bg-paper-main">
      {children}
    </Chip>
  );
  // return (
  //   <div className="border border-surface-grey w-full flex gap-2 items-center px-2 py-1">
  //     {children}
  //   </div>
  // );
}

export function ValueText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Body className={`text-xl m-auto font-semibold ${className}`}>
      {children}
    </Body>
  );
}
