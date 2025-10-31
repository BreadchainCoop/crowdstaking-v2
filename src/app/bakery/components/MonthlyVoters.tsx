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
			const res = (await (
				await fetch("/api/bread-monthly-voters")
			).json()) as {
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
