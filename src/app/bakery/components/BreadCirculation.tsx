"use client";

import { Body, Logo } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { useQuery } from "@tanstack/react-query";
import { formatSupply } from "@/app/core/util/formatter";

interface TotalBreadInCirculation {
  supply: number;
}


// Value as at when I ran the query
const FALLBACK_CIRCULATION_VALUE = "43,000+";

export const BreadCirculation = () => {
  const { data, error } = useQuery({
    queryKey: ["total-bread-in-circulation"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const req = await fetch("/api/total-bread-in-circulation");

        if (!req.ok) throw Error("Try again");

        return (await req.json() as TotalBreadInCirculation).supply;
      } catch (error) {
        throw Error("Try again");
      }
    },
  });

  return (
    <Chip className="max-w-max mb-4 md:mb-0">
      <Logo className="md:size-6" />
      <Body bold className="flex items-center justify-center gap-1">
        {data ? formatSupply(data) : error ? FALLBACK_CIRCULATION_VALUE : "..."} BREAD{" "}
        <span className="font-normal">in circulation</span>
      </Body>
    </Chip>
  );
};
