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
      sdfsdf
    </div>
  );
}
