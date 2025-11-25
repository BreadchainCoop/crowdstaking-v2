"use client";

import { Body, Logo } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { useQuery } from "@tanstack/react-query";
import { formatSupply } from "@/app/core/util/formatter";
import { ExternalLink } from "@/app/core/components/ExternalLink";

interface TotalBreadInCirculation {
	supply: number;
}

// Value as at when I ran the query
const FALLBACK_CIRCULATION_VALUE = 435464.49571094225;

export const BreadCirculation = () => {
	const { data, error } = useQuery({
		queryKey: ["total-bread-in-circulation"],
		refetchOnWindowFocus: false,
		queryFn: async () => {
			try {
				const req = await fetch("/api/total-bread-in-circulation");

				if (!req.ok) throw Error("Try again");

				return ((await req.json()) as TotalBreadInCirculation).supply;
			} catch (error) {
				throw Error("Try again");
			}
		},
	});

	return (
		<ExternalLink
			href="https://gnosisscan.io/token/0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3"
			className="!text-current shrink-0"
		>
			<Chip className="max-w-max mb-4 !gap-x-2.5 bg-paper-main hover:bg-[#EA581733] transition-colors md:mb-0">
				<Logo className="md:size-6" size={24} />
				<Body bold className="flex items-center justify-center gap-1">
					{data
						? formatSupply(data)
						: error
						? formatSupply(FALLBACK_CIRCULATION_VALUE)
						: "..."}{" "}
					BREAD <span className="font-normal">in circulation</span>
				</Body>
			</Chip>
		</ExternalLink>
	);
};
