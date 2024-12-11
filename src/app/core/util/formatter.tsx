import { format } from "date-fns";

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

export function formatBalance(value: number, decimals: number) {
  const balanceFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    minimumIntegerDigits: 1,
    useGrouping: true,
  });
  return balanceFormatter.format(value);
}

export function formatSupply(value: number) {
  const supplyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    minimumIntegerDigits: 1,
    useGrouping: true,
  });
  return supplyFormatter.format(value);
}

export function formatVotePercentage(value: number) {
  const percentageFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 1,
    useGrouping: true,
  });
  return percentageFormatter.format(value);
}

export function formatPointsInput(value: number) {
  const pointsInputFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    minimumIntegerDigits: 2,
    useGrouping: true,
  });
  return pointsInputFormatter.format(value);
}

export function formatDate(date: Date): string {
  return `${format(date, "d")}/${format(date, "M")}/${format(date, "yy")}`;
}
