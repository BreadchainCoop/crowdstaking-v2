import { format } from "date-fns";
import { ReactNode } from "react";
import { formatUnits } from "viem";
import { Hex } from "viem";

interface ProjectDistribution {
  projectAddress: Hex;
  governancePayment: number;
  percentVotes: number;
  flatPayment: number;
}

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

// Intl.NumberFormat construction is expensive, so formatters are built once.
const balanceFormatters = new Map<number, Intl.NumberFormat>();

export function formatBalance(value: number, decimals: number) {
  let balanceFormatter = balanceFormatters.get(decimals);
  if (!balanceFormatter) {
    balanceFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      minimumIntegerDigits: 1,
      useGrouping: true,
    });
    balanceFormatters.set(decimals, balanceFormatter);
  }
  return balanceFormatter.format(value);
}

const supplyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  minimumIntegerDigits: 1,
  useGrouping: true,
});

export function formatSupply(value: number) {
  return supplyFormatter.format(value);
}

const percentageFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  minimumIntegerDigits: 1,
  useGrouping: true,
});

export function formatVotePercentage(value: number) {
  return percentageFormatter.format(value);
}

const pointsInputFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  minimumIntegerDigits: 2,
  useGrouping: true,
});

export function formatPointsInput(value: number) {
  return pointsInputFormatter.format(value);
}

export function formatDate(date: Date): string {
  return `${format(date, "d")}/${format(date, "M")}/${format(date, "yy")}`;
}

export function formatProjectPayment(
  project: ProjectDistribution,
  totalYield: number
) {
  const totalPayment = project.governancePayment + project.flatPayment;
  const percentOfYield =
    (totalPayment / Number(formatUnits(BigInt(totalYield), 18))) * 100;

  return {
    governancePayment: project.governancePayment.toFixed(2),
    percentVotes: (project.percentVotes * 100).toFixed(2),
    flatPayment: project.flatPayment.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    percentOfYield: percentOfYield.toFixed(2),
  };
}

export function renderFormattedDecimalNumber(number: string): ReactNode {
  const part1 = number.split(".")[0];
  const part2 = number.split(".")[1];

  return (
    <div className="w-full text-end flex tracking-wider text-lg text-breadgray-grey100 dark:text-breadgray-ultra-white leading-none">
      <div className="flex gap-2 font-bold justify-end">
        <span>{part1}</span>
      </div>
      <div>.</div>
      <div className="text-sm font-semibold leading-[1.1] self-end">
        {part2}
      </div>
    </div>
  );
}
