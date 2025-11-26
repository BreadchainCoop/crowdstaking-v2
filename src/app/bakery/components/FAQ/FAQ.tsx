"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ReactNode } from "react";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { Body, Heading2 } from "@breadcoop/ui";

function AccordionItem({
	children,
	value,
}: {
	children: ReactNode;
	value: string;
}) {
	return (
		<Accordion.Item
			value={value}
			className="bg-paper-0 px-6 py-3 border border-surface-ink hover:border-[#EA5817] transition-colors"
		>
			{children}
		</Accordion.Item>
	);
}

function AccordionHeader({ children }: { children: ReactNode }) {
	return (
		<Accordion.Header className="font-semibold">
			{children}
		</Accordion.Header>
	);
}

function AccordionTrigger({ children }: { children: ReactNode }) {
	return (
		<Accordion.Trigger className="w-full flex items-center justify-between group">
			{children}
			<div className="text-primary-orange">
				<svg
					width="17"
					height="9"
					viewBox="0 0 17 9"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="group-data-[state=open]:rotate-180"
				>
					<path
						d="M15.75 0.75L8.25 8.25L0.75 0.75"
						stroke="currentcolor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		</Accordion.Trigger>
	);
}

function AccordionContent({ children }: { children: ReactNode }) {
	return (
		<Accordion.Content>
			<div className="mt-2.5 flex flex-col gap-2.5 text-surface-grey-2">{children}</div>
		</Accordion.Content>
	);
}

export default function FAQ() {
	return (
		<section className="pb-16 mt-16 sm:pb-28">
			<Heading2 className="text-center mb-6">FAQ</Heading2>
			<Accordion.Root
				type="single"
				className="flex flex-col gap-2 max-w-2xl m-auto px-2"
				collapsible
			>
				<AccordionItem value="1">
					<AccordionHeader>
						<AccordionTrigger>What is $BREAD?</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>
							$BREAD is a digital currency designed for
							solidarity. When you hold $BREAD, you&apos;re part
							of a community that decides together how to use the
							interest generated from our fund.
						</Body>
						<Body>
							1 $BREAD = 1 xDAI = $1. BREAD is not about
							speculation, but about supporting causes that matter
							to working people.
						</Body>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="2">
					<AccordionHeader>
						<AccordionTrigger>
							Do I need xDAI to bake?
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>
							Yes, but you don&apos;t need to have it already. Our
							bridging feature converts whichever currency you
							hold into xDAI, which you can then use to bake
							BREAD.
						</Body>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="3">
					<AccordionHeader>
						<AccordionTrigger>
							How safe are my funds?
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>
							When you bake $BREAD, your funds get deposited into
							our smart contract. You receive $BREAD in return,
							which you can exchange back for your deposit anytime
							through the &quot;Burn&quot; tab.
						</Body>
						<Body>
							<span className="font-bold">Risks:</span> Smart
							contract risk (we use audited contracts, but no
							system is risk-free) and fluctuating interest rates.
						</Body>
						<Body>
							Check our code on{" "}
							<ExternalLink href="https://github.com/BreadchainCoop/breadchain">
								GitHub
							</ExternalLink>
							. Don&lsquo;t trust, verify.
						</Body>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="4">
					<AccordionHeader>
						<AccordionTrigger>
							What happens when I bake?
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>Three things happen:</Body>
						<Body>
							<ol className="list-['-'] list-inside -mt-2.5">
								<li>
									<span className="font-bold pl-1">
										Your funds are deposited
									</span>{" "}
									and start earning interest
								</li>
								<li>
									<span className="font-bold pl-1">
										You receive $BREAD
									</span>{" "}
									as proof of your deposit
								</li>
								<li>
									<span className="font-bold pl-1">
										You gain voting power
									</span>{" "}
									to decide where the accumulated interest
									goes
								</li>
							</ol>
						</Body>
						<Body>
							The interest goes into a collective pool. The
							community votes on which nonprofits, mutual aid
							organizations, and solidarity projects receive
							funding.
						</Body>
						<Body>
							Burn your $BREAD anytime to get your deposit back.
						</Body>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="5">
					<AccordionHeader>
						<AccordionTrigger>
							How does voting work?
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>
							Every $BREAD holder has a say in where each
							month&apos;s interest goes. More $BREAD = more
							interest + more voting power. You can check your
							voting power in the governance tab of the Bread
							Solidarity Fund.
						</Body>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="6">
					<AccordionHeader>
						<AccordionTrigger>
							Where does the interest come from?
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>
							The interest comes from DeFi across various chains.
							For technical details, learn more about the{" "}
							<ExternalLink href="https://docs.bread.coop/">
								DAI Savings Rate.
							</ExternalLink>
						</Body>
						<Body>
							We built our mechanism on Gnosis Chain, a network we
							love because they&apos;re battle-tested,
							transparent, and aligned with our values.
						</Body>
						<Body>
							Current APY is shown on the main page and fluctuates
							based on market conditions.
						</Body>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="7">
					<AccordionHeader>
						<AccordionTrigger>
							What&apos;s the catch?
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent>
						<Body>
							<span className="font-bold">
								This isn&apos;t a profit-maximizing tool.
							</span>{" "}
							The interest goes to community-selected causes, not
							back to you. You get your deposit back when you burn
							$BREAD, but you don&apos;t get a share of the
							interest.
						</Body>
						<Body>
							<span className="font-bold">Why participate?</span>{" "}
							Because you believe in collective action. Because
							you want your funds to generate good while staying
							liquid. Because you want a say in where resources
							go.
						</Body>
						<Body>
							If you&apos;re only looking to maximize personal
							returns, traditional DeFi might suit you better.
						</Body>
					</AccordionContent>
				</AccordionItem>
			</Accordion.Root>
		</section>
	);
}
