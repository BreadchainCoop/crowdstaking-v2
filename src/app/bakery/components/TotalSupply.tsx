"use client";
import { ERC20_ABI } from "@/abi";
import { formatSupply } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { useContractRead } from "wagmi";
import { GradientLinkBadge } from "@/app/core/components/Badge/Badge";
import { BREAD_ADDRESS } from "@/constants";

export function TotalSupply() {
  const { data, status } = useContractRead({
    address: BREAD_ADDRESS,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    watch: true,
    cacheTime: 6_000,
  });

  return (
    <div className="flex justify-center pb-2 text-xl tracking-widest">
      <GradientLinkBadge
        href={"https://gnosisscan.io/token/" + BREAD_ADDRESS}
        icon={
          <span className="rounded-full w-2 h-2 bg-status-success supply-light" />
        }
      >
        <span className="font-bold">
          {data ? formatSupply(parseInt(formatUnits(data, 18))) : "--.--"}
        </span>
        <span className="ms-2 me-1">$BREAD baked</span>
      </GradientLinkBadge>
    </div>
  );
}
