"use client";

import { Body } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { useQuery } from "@tanstack/react-query";

// Value as at when I ran the query
const FALLBACK_BREAD_MONTHLY_VOTERS = 75;

export const MonthlyVoters = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["bread-monthly-voters"],
		queryFn: async () => {
			const response = await fetch("/api/bread-monthly-voters");
			if (!response.ok) throw new Error(`Failed to fetch monthly voters: ${response.status}`);
			const res = (await response.json()) as {
				_col0: number;
			};

			return res._col0;
		},
	});

	return (
		<Chip>
			<Body bold>
				{data || (isLoading ? "--" : FALLBACK_BREAD_MONTHLY_VOTERS)}{" "}
				Monthly voters
			</Body>
		</Chip>
	);
};
