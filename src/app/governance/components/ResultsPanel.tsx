import { Hex } from "viem";

import { projectsMeta } from "@/app/projectsMeta";
import { formatVotePercentage } from "@/app/core/util/formatter";
import { CurrentVotingDistributionState } from "../useCurrentVotingDistribution";
import { CardBox } from "@/app/core/components/CardBox";
import { useMemo } from "react";

export function ResultsPanel({
  distribution,
}: {
  distribution: CurrentVotingDistributionState;
}) {
  // contract returns addresses and points in 2 separate arrays
  // this maps the values to the addresses before sorting them together
  const distributionsSorted = useMemo(() => {
    if (distribution.status !== "SUCCESS") return null;
    const distributions = distribution.data[0]
      .map((address, i) => {
        return { [address]: distribution.data[1][i] };
      })
      .filter((item) => projectsMeta[Object.keys(item)[0] as Hex]) // Filter out projects not in projectsMeta
      .toSorted((a, b) => {
        return (
          projectsMeta[Object.keys(a)[0] as Hex].order -
          projectsMeta[Object.keys(b)[0] as Hex].order
        );
      });
    const totalPoints = distribution.data[1].reduce(
      (acc, points) => acc + points,
      0
    );
    return { distributions, totalPoints };
  }, [distribution]);

  return (
    <section className="grid grid-cols-1 gap-4">
      <CardBox>
        <div className="grid grid-cols-1 gap-8 p-4">
          <div className="grid grid-cols-1 gap-4">
            <h3 className="uppercase font-medium text-xl text-breadgray-grey100 dark:text-breadgray-ultra-white">
              results
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {distributionsSorted &&
                distributionsSorted.distributions.map((project) => (
                  <ResultsProject
                    key={`project_result_${Object.keys(project)[0]}`}
                    address={Object.keys(project)[0] as Hex}
                    projectPoints={project[Object.keys(project)[0]]}
                    totalPoints={distributionsSorted.totalPoints}
                  />
                ))}
            </div>
          </div>
        </div>
      </CardBox>
    </section>
  );
}

function ResultsProject({
  projectPoints,
  totalPoints,
  address,
}: {
  projectPoints: number;
  totalPoints: number;
  address: Hex;
}) {
  const percentage = totalPoints > 0 ? (projectPoints / totalPoints) * 100 : 0;
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex gap-2">
        <h3 className="grow font-bold text-xl text-breadgray-grey100 dark:text-breadgray-ultra-white tracking-wide">
          {projectsMeta[address]?.name || "Unknown Project"}
        </h3>
        <span>{`${formatVotePercentage(percentage)}%`}</span>
      </div>
      <div className="bg-breadgray-white dark:bg-breadgray-grey100 overflow-clip rounded-full border-[4px] border-breadgray-white dark:border-breadgray-grey100">
        <div
          className="h-1.5 bg-breadviolet-shaded transform transition-width duration-1000 ease-in-out"
          style={{
            width: `${percentage}%`,
          }}
        >
          {" "}
        </div>
      </div>
    </div>
  );
}
