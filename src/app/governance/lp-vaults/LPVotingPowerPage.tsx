"use client";
import { useEffect, useState } from "react";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { VaultPanel } from "./components/VaultPanel";
import { VotingPowerPanel } from "./components/VotingPowerPanel";
import { Accordion } from "@radix-ui/react-accordion";
import useLocalStorage from "@/app/core/hooks/useLocalStorage";
import { PageGrid } from "@/app/governance/components/PageGrid";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { Body, Heading3, Caption, LiftedButton, Heading5 } from "@breadcoop/ui";
import { ArrowUpRightIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";

export function LPVotingPowerPage() {
  const { user } = useConnectedUser();
  const chainConfig = useActiveChain();
  const [setLocalStorage, getLocalStorage] = useLocalStorage();

  const [accordionState, setAccordionState] = useState(
    getLocalStorage("lpAccordionValue")
  );

  // Update localStorage to persist the accordion state between renders
  useEffect(() => {
    setLocalStorage("lpAccordionValue", accordionState);
  }, [accordionState, setLocalStorage]);

  return (
    <section className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8">
      <PageGrid>
        <div className="col-span-12 lg:col-span-7 row-start-1 row-span-1">
          <TitleSection />
        </div>

        <div className="col-span-12 lg:col-span-5 lg:justify-self-end lg:max-w-[383px] row-start-2 lg:row-start-1 lg:row-span-2">
          <VotingPowerPanel />
        </div>
      </PageGrid>
      <div className="w-full pt-6">
        <Heading3 className="text-[24px]">Manage your BREAD LP vaults</Heading3>
        <Body>
          Lock LP tokens for voting power within the Bread Cooperative
          solidarity fund.
        </Body>
        <Accordion
          value={accordionState}
          onValueChange={setAccordionState}
          type="single"
          collapsible
        >
          <VaultPanel tokenAddress={chainConfig.BUTTER.address} />
        </Accordion>
      </div>
    </section>
  );
}

function TitleSection() {
  return (
		<div className="flex flex-col gap-4">
			<Heading3 className="text-2xl lg:text-[2.5rem]">
				<span className="uppercase">Bread Solidarity Fund &mdash;</span>{" "}
				Voting power vaults
			</Heading3>
			<div className="text-lg md:pe-6">
				<Body>
					This page allows you to provide liquidity for BREAD while
					keeping your voting rights for the monthly BREAD
					crowdstaking yield distribution. By staking your LP tokens
					in a vault, you maintain your voting power just like if you
					were holding BREAD directly.
				</Body>
				<Body>Get Started:</Body>
				<ol className="list-disc px-5 pb-4">
					<li>
						<Body>
							Provide Liquidity: Add liquidity for BREAD in the
							vault&apos;s listed liquidity pool to get LP tokens.
						</Body>
					</li>
					<li>
						<Body>
							Lock your LP Tokens: Deposit your LP tokens into the
							vault to keep your governance rights.
						</Body>
					</li>
					<li>
						<Body>
							Participate in Governance: Share your preferences
							for the monthly distribution on the voting page.
						</Body>
					</li>
				</ol>
				<Caption>
					* Distributions will be made at the end of the month based
					on all votes received.
				</Caption>
				<div className="pt-4">
					<LiftedButton
						className="group relative py-10 px-10 bg-contain bg-right bg-no-repeat"
						style={{ backgroundImage: "url(/bread-logo-line.png)" }}
					>
						<img
							src="/breadwxdai.svg"
							alt="Bread/WXDAI"
							className="absolute mt-1 top-1/2 left-1 w-[88px] h-[64px] -translate-y-1/2"
						/>
						<div className="flex items-center w-full pl-[42px]">
							<div className="flex flex-col items-start flex-1">
								<Heading3 className="m-0 p-0 text-[24px]">
									Provide liquidity to earn
								</Heading3>
								<Heading5 className="text-[16px] -mt-2 p-0 text-orange-0">
									Deposit BREAD/WXDAI on{" "}
									<img
										src="/curve-logo.png"
										alt="Curve"
										className="inline w-6 h-6"
									/>
									<span className="text-white">Curve</span>
								</Heading5>
							</div>
							<div className="pl-16 relative w-6 h-6">
								<ArrowUpRightIcon
									size={24}
									className="text-white absolute top-0 right-0 group-hover:opacity-0 transition-opacity duration-200"
								/>
								<ArrowRightIcon
									size={24}
									className="text-white absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								/>
							</div>
						</div>
					</LiftedButton>
				</div>
			</div>
		</div>
  );
}
