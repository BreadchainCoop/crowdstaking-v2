import { projectsMeta } from "@/app/projectsMeta";
import { formatBalance, formatProjectPayment } from "@/app/core/util/formatter";
import { formatUnits, Hex } from "viem";

interface CycleDistribution {
  cycleNumber: number;
  totalYield: number;
  distributionDate: string;
  projectDistributions: Array<ProjectDistribution>;
}

interface ProjectDistribution {
  projectAddress: Hex;
  governancePayment: number;
  percentVotes: number;
  flatPayment: number;
}

export function VotingHistoryMobile({
  cycleDistribution,
}: {
  cycleDistribution: CycleDistribution | null;
}) {
  if (!cycleDistribution) {
    return <p>Loading...</p>;
  }

  return <div>// TODO mobile</div>;
}

export function VotingHistoryDesktop({
  cycleDistribution,
}: {
  cycleDistribution: CycleDistribution | null;
}) {
  if (!cycleDistribution) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Cycle number: {cycleDistribution.cycleNumber}</p>
      <p>
        Total yield:{" "}
        {formatBalance(
          Number(formatUnits(BigInt(cycleDistribution.totalYield), 18)),
          2
        )}
      </p>
      <p>Ended on: {cycleDistribution.distributionDate}</p>
      <p>Cycle number: {cycleDistribution.cycleNumber}</p>
      <br />
      <p>Project Results: </p>{" "}
      <div className="grid grid-cols-1 gap-4">
        {cycleDistribution.projectDistributions.map((project) => {
          const formatted = formatProjectPayment(
            project,
            cycleDistribution.totalYield
          );
          return (
            <div key={project.projectAddress}>
              {projectsMeta[project.projectAddress].name}
              <div>
                <p>Governance payment: {formatted.governancePayment}</p>
                <p>Percent votes: {formatted.percentVotes}%</p>
                <p>Flat payment: {formatted.flatPayment}</p>
                <p>Total payment: {formatted.totalPayment}</p>
                <p>% of total yield: {formatted.percentOfYield}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
