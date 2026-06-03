// "use client";
import { type Metadata } from "next";

import { AppTitle } from "./bakery/components/AppTitle";
import FAQWrapper from "./components/FAQWrapper";
import { Body, Heading2 } from "@breadcoop/ui";
import clsx from "clsx";
import { WRAPPER_CLASSES } from "./core/util/classes";
import { ProjectBackers } from "./bakery/components/Backers";
import { MonthlyVoters } from "./bakery/components/MonthlyVoters";
import { ViewAnalytics } from "./bakery/components/Analytics";
import Actions from "./bakery/components/Actions";
import { generateMetadata } from "@/lib/site-metadata";
import { BalanceBanner } from "./bakery/components/Banners/BalanceBanner";
import { SolidarityHero } from "./bakery/components/SolidarityHero";

export default function Home() {
	return (
		<>
			<BalanceBanner />
			<div className={clsx(WRAPPER_CLASSES, "")}>
				<SolidarityHero />
				<div
					id="how-it-works"
					className="scroll-mt-24 mt-12 md:flex md:items-start md:justify-between md:gap-8"
				>
					<figure className="w-[23.82rem] h-[16rem] ml-auto bg-orange-0 overflow-hidden relative right-[-1rem] mb-8 md:w-[33.125rem] md:h-[22.25rem] md:order-2 md:right-[-1.5rem] md:static md:mt-8 md:grow-0">
						<img
							src="/bake_hand_mobile.png"
							alt=""
							className="w-full h-full aspect-auto object-cover md:hidden"
						/>
						<img
							src="/bake_hand_desktop.png"
							alt=""
							className="hidden md:block w-full h-full aspect-auto object-cover md:aspect-square"
						/>
					</figure>
					<div className="md:max-w-[32rem]">
						<div className="max-w-[42.375rem] md:max-w-[30rem]">
							<Heading2>We decide, together.</Heading2>
							<Body className="mt-3 mb-5 text-surface-grey-2">
								We are unique because we allow anyone that bakes
								and holds $BREAD to decide over where the
								interest should go.
							</Body>
						</div>
						<div>
							<div className="flex items-center justify-start flex-wrap gap-4">
								<ProjectBackers />
								{/* <MonthlyVoters /> */}
							</div>
							<Body className="my-5 text-surface-grey-2 text-xs">
								This is the total people that can decide where
								funding goes.*
							</Body>
							<ViewAnalytics />
						</div>
						<Actions />
					</div>
				</div>
				<FAQWrapper />
			</div>
		</>
	);
}
