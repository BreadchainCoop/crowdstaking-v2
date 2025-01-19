"use client";
import { ERC20_ABI } from "@/abi";
import { formatSupply } from "@/app/core/util/formatter";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { GradientLinkBadge } from "@/app/core/components/Badge/Badge";

export function TotalSupply() {
  const breadAddress = "0xa555d5344f6FB6c65da19e403Cb4c1eC4a1a5Ee3";
  const { data, status } = useReadContract({
    address: breadAddress,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    watch: true,
    cacheTime: 6_000,
  });

  return (
    <div className="flex justify-center pb-2 text-xl tracking-widest">
      <GradientLinkBadge
        href={"https://gnosisscan.io/token/" + breadAddress}
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
