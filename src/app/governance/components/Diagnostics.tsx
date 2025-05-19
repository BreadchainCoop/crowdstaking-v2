"use client";
import { BREAD_ABI, DISTRIBUTOR_ABI } from "@/abi";
import Button from "@/app/core/components/Button";
import { projectsMeta } from "@/app/projectsMeta";
import { useEffect } from "react";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { formatUnits, Hex } from "viem";
import { useReadContract, useWriteContract, useSimulateContract } from "wagmi";

export function Diagnostics() {
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;

  const {
    data: prepareConfig,
    status: prepareStatus,
    error: prepareError,
  } = useSimulateContract({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "distributeYield",
  });

  const {
    writeContract,
    data: distributeYieldData,
    status: distributeYieldStatus,
  } = useWriteContract();

  useEffect(() => {
    if (prepareError) {
      console.error({ prepareError });
    }
  }, [prepareError]);

  return (
    <div className="m-4 p-4 rounded border border-neutral-500 grid grid-cols-1 gap-4">
      <div>
        <Button
          onClick={() => {
            writeContract?.(prepareConfig!.request);
          }}
        >
          Distribute Yield
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {Object.keys(projectsMeta).map((account) => (
          <ProjectDisplay key={account} account={account as Hex} />
        ))}
      </div>
    </div>
  );
}

function ProjectDisplay({ account }: { account: Hex }) {
  const chainConfig = useActiveChain();
  const breadAddress = chainConfig.BREAD.address;

  const { data: breadBalanceData, status: breadBalanceStatus } =
    useReadContract({
      address: breadAddress,
      abi: BREAD_ABI,
      functionName: "balanceOf",
      args: [account],
    });

  return (
    <div>
      <h3>{projectsMeta[account].name}</h3>
      <div className="text-sm text-neutral-500">
        BREAD:{" "}
        {formatUnits(
          breadBalanceData ? (breadBalanceData as bigint) : BigInt(0),
          18
        )}
      </div>
    </div>
  );
}
