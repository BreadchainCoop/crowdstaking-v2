"use client";

import { Body, Logo } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { useQuery } from "@tanstack/react-query";
import { formatSupply } from "@/app/core/util/formatter";

interface TotalBreadInCirculation {
  supply: number;
}

export const BreadCirculation = () => {
  const { data, error } = useQuery({
    queryKey: ["total-bread-in-circulation"],
    queryFn: async () => {
      const res = (await (
        await fetch("/api/total-bread-in-circulation")
      ).json()) as TotalBreadInCirculation;

      return res.supply;
    },
  });

  console.log("__ BREAD CIRCULATION DATA", data);

  return (
    <Chip className="max-w-max mb-4">
      <Logo />
      <Body bold className="flex items-center justify-center gap-1">
        {data ? formatSupply(data) : error ? "43,000+" : "..."} BREAD{" "}
        <span className="font-normal">in circulation</span>
      </Body>
    </Chip>
  );
};
