"use client";
import { ERC20_ABI } from "@/abi";
import { formatSupply } from "@/app/core/util/formatter";
import { ReactNode } from "react";
import { formatUnits } from "viem";
import { useContractRead } from "wagmi";

export function TotalSupply() {
  const { data, status } = useContractRead({
    address: "0xa555d5344f6FB6c65da19e403Cb4c1eC4a1a5Ee3",
    abi: ERC20_ABI,
    functionName: "totalSupply",
    watch: true,
    cacheTime: 6_000,
  });

  return (
    <div className="flex justify-center pb-2">
      <div className="flex items-center gap-2 p-2 bg-white dark:bg-breadgray-charcoal rounded">
        <span className="rounded-full w-2 h-2 bg-status-success supply-light" />
        <span className="text-xl font-semibold">
          {data ? formatSupply(parseInt(formatUnits(data, 18))) : "--.--"}
        </span>
        <GradientText>$BREAD</GradientText>
        <span className="font-bold text-xl">strong</span>
      </div>
    </div>
  );
}

function GradientText({ children }: { children: ReactNode }) {
  return (
    <div className="font-bold text-xl supply-text-gradient">{children}</div>
  );
}
