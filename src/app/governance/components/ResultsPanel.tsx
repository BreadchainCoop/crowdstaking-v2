import { Hex } from "viem";

import { projectsMeta } from "@/app/projectsMeta";
import { formatVotePercentage } from "@/app/core/util/formatter";
import { CurrentVotingDistributionState } from "../useCurrentVotingDistribution";
import { CardBox } from "@/app/core/components/CardBox";
import { useMemo } from "react";
import { Body, Heading3 } from "@breadcoop/ui";

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
			.filter((item) => {
				const address = Object.keys(item)[0] as Hex;
				return projectsMeta[address]?.active; // Only include active projects
			})
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
			<CardBox className="lg:border-transparent">
				<div className="grid grid-cols-1 gap-8 p-4">
					<div className="grid grid-cols-1 gap-4">
						<Heading3 className="text-center text-2xl text-surface-grey-2 pb-1 border-b border-orange-0">
							RESULTS
						</Heading3>
						<div className="grid grid-cols-1 gap-4">
							{distributionsSorted &&
								distributionsSorted.distributions.map(
									(project) => (
										<ResultsProject
											key={`project_result_${
												Object.keys(project)[0]
											}`}
											address={
												Object.keys(project)[0] as Hex
											}
											projectPoints={
												project[Object.keys(project)[0]]
											}
											totalPoints={
												distributionsSorted.totalPoints
											}
											// projectPoints={20}
											// totalPoints={60}
										/>
									)
								)}
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
	const percentage =
		totalPoints > 0 ? (projectPoints / totalPoints) * 100 : 0;
	return (
		<div className="grid grid-cols-1 gap-2">
			<Body className="flex gap-2">
				<span className="grow font-bold">{projectsMeta[address].name}</span>
				<span className="text-surface-ink">{`${formatVotePercentage(
					percentage
				)}%`}</span>
			</Body>
			<div className="border border-black p-1">
				<div
					className="h-[0.5625rem] bg-[#EA5817] transform transition-width duration-1000 ease-in-out"
					style={{
						width: `${percentage}%`,
					}}
				/>
			</div>
		</div>
	);
}
