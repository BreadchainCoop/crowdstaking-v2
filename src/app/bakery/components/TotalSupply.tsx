"use client";
import { ERC20_ABI } from "@/abi";
import { formatSupply } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { useReadContract } from "wagmi";
import { GradientLinkBadge } from "@/app/core/components/Badge/Badge";
import { BREAD_ADDRESS } from "@/constants";

export function TotalSupply() {
  const { data, status } = useRefetchOnBlockChange(
    BREAD_ADDRESS,
    ERC20_ABI,
    "totalSupply",
    []
  );

  return (
    <div className="flex justify-center pb-2 text-xl tracking-widest">
      <GradientLinkBadge
        href={"https://gnosisscan.io/token/" + BREAD_ADDRESS}
        icon={
          <span className="rounded-full w-2 h-2 bg-status-success supply-light" />
        }
      >
        <span className="font-bold">
          {data
            ? formatSupply(parseInt(formatUnits(data as bigint, 18)))
            : "--.--"}
        </span>
        <span className="ms-2 me-1">$BREAD baked</span>
      </GradientLinkBadge>
    </div>
  );
}
