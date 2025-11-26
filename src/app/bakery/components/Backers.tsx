"use client";

import { Body } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "@/app/core/components/ExternalLink";

// Value as at when I ran the query
const FALLBACK_BREAD_BACKERS = 209;

export const ProjectBackers = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["bread-backers"],
		queryFn: async () => {
			const res = (await (await fetch("/api/bread-backers")).json()) as {
				_col0: number;
			};

			return res._col0;
		},
	});

	return (
		<ExternalLink
			href="https://dune.com/bread_cooperative/solidarity"
			className="!text-current shrink-0 w-full"
		>
			<Chip className="chip-transition w-full">
				<UsersThreeicon />
				<Body bold>
					{data || (isLoading ? "--" : FALLBACK_BREAD_BACKERS)}{" "}
					Backers
				</Body>
			</Chip>
		</ExternalLink>
	);
};

function UsersThreeicon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M18 11.25C18.8734 11.2493 19.7349 11.4524 20.516 11.843C21.2972 12.2335 21.9765 12.8009 22.5 13.5"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1.5 13.5C2.0235 12.8009 2.70281 12.2335 3.48398 11.843C4.26514 11.4524 5.12663 11.2493 6 11.25"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 17.25C14.0711 17.25 15.75 15.5711 15.75 13.5C15.75 11.4289 14.0711 9.75 12 9.75C9.92893 9.75 8.25 11.4289 8.25 13.5C8.25 15.5711 9.92893 17.25 12 17.25Z"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.75 20.25C7.2884 19.3364 8.0559 18.579 8.97665 18.0529C9.8974 17.5267 10.9395 17.25 12 17.25C13.0605 17.25 14.1026 17.5267 15.0233 18.0529C15.9441 18.579 16.7116 19.3364 17.25 20.25"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M15.0938 7.5C15.234 6.95678 15.5238 6.46377 15.9302 6.07697C16.3366 5.69017 16.8433 5.42508 17.3927 5.31179C17.9422 5.19851 18.5125 5.24158 19.0387 5.43611C19.5649 5.63064 20.0261 5.96883 20.3697 6.41229C20.7134 6.85574 20.9258 7.38668 20.9829 7.9448C21.04 8.50293 20.9394 9.06587 20.6926 9.56971C20.4458 10.0735 20.0627 10.4981 19.5867 10.7951C19.1108 11.0921 18.561 11.2497 18 11.25"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.99995 11.25C5.43892 11.2497 4.8892 11.0921 4.41324 10.7951C3.93727 10.4981 3.55413 10.0735 3.30733 9.56971C3.06053 9.06587 2.95996 8.50293 3.01703 7.9448C3.07411 7.38668 3.28655 6.85574 3.63022 6.41229C3.9739 5.96883 4.43504 5.63064 4.96127 5.43611C5.4875 5.24158 6.05774 5.19851 6.60722 5.31179C7.1567 5.42508 7.6634 5.69017 8.06979 6.07697C8.47617 6.46377 8.76594 6.95678 8.9062 7.5"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
