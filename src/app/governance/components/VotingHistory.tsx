import { projectsMeta } from "@/app/projectsMeta";
import { formatBalance, formatProjectPayment } from "@/app/core/util/formatter";
import { formatUnits, Hex } from "viem";
import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { format, parse } from "date-fns";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { useDistributions } from "../useDistributions";
import {
  Body,
  Logo,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Caption,
  LiftedButton,
} from "@breadcoop/ui";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
} from "@phosphor-icons/react/ssr";

interface CycleDistribution {
  cycleNumber: number;
  totalYield: number;
  distributionDate: string;
  projectDistributions: Array<ProjectDistribution>;
}

interface ProjectDistribution {
  projectAddress: Hex;
  governancePayment: number;
  percentVotes: number;
  flatPayment: number;
}

function TopCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="py-3 bg-paper-0 border border-paper-2 flex flex-col items-center justify-center mb-1 md:flex-1 md:mb-0">
      <div className="flex items-center justify-center mb-1">
        <div className="flex flex-col gap-2 items-center">
          <Body
            bold
            className="text-surface-grey-2 md:text-[20px] text-[16px] text-[1rem]"
          >
            {title}
          </Body>
          <div className="gap-2 inline-flex items-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function VotingHistory() {
  const [cycleIndex, setCycleIndex] = useState(0); // 0 returns the latest cycle
  const { cycleDistribution, totalDistributions } =
    useDistributions(cycleIndex);

  if (!cycleDistribution) {
    return <p>Loading...</p>;
  }

  const updateCycleIdex = (_index: number) => {
    setCycleIndex((prev) => {
      // Using non-null assertion (!) because totalDistributions is guaranteed to be available at this point.
      // The buttons are disabled if it's not available for whatever reason.
      const maxCycle = totalDistributions!;
      let newIndex = prev + _index;

      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex > maxCycle) {
        newIndex = maxCycle;
      }

      return newIndex;
    });
  };

  if (!cycleDistribution) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <header>
        <Heading3 className="pb-2">Previous cycle</Heading3>
        <Body className="">
          These are the results of the previous voting cycle #
          {cycleDistribution.cycleNumber}.
        </Body>
        <Caption className="pt-6 text-left">
          Ended on{" "}
          {format(
            parse(cycleDistribution.distributionDate, "MM/dd/yyyy", new Date()),
            "MMM d, yyyy"
          )}
        </Caption>
      </header>
      <div>
        <div className="my-3 md:flex md:flex-row-reverse md:gap-4">
          <TopCard title="Total yield distributed">
            <Logo className="mb-2" />
            <Heading3>
              {formatBalance(
                Number(formatUnits(BigInt(cycleDistribution.totalYield), 18)),
                2
              )}
            </Heading3>
          </TopCard>
          <TopCard title="Previous cycle">
            <LiftedButton
              preset="stroke"
              onClick={() => updateCycleIdex(1)}
              disabled={
                !totalDistributions || cycleIndex === totalDistributions - 1
              }
              className="h-[32px] w-[32px] p-0"
            >
              <ArrowLeftIcon size={20} className="text-primary-orange" />
            </LiftedButton>
            <Body bold className="text-[24px]">
              Cycle #{cycleDistribution.cycleNumber}
            </Body>
            <LiftedButton
              preset="stroke"
              onClick={() => updateCycleIdex(-1)}
              disabled={!totalDistributions || cycleIndex === 0}
              className="h-[32px] w-[32px] p-0"
            >
              <ArrowRightIcon size={20} className="text-primary-orange" />
            </LiftedButton>
          </TopCard>
        </div>

        <div className="p-3 border border border-paper-2 mt-1 md:px-8 md:py-4">
          <Body
            bold
            className="pb-2 md:text-[20px] text-[16px] text-surface-grey-2 text-center md:text-left md:mb-2"
          >
            How yield is distributed
          </Body>
          <div className="flex flex-col md:flex-row md:items-center justify-center gap-4">
            <div className="mb-4 flex-1 flex items-center mb-0">
              <div className="w-1 h-13 bg-primary-orange mr-4" />
              <div>
                <Body bold className="md:text-[20px] text-[16px] ">
                  Solidarity Amount
                </Body>
                <Caption className="pt-1 md:text-[16px] text-[12px] ">
                  50% of the total yield is distributed equally.
                </Caption>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-1 h-13 bg-orange-0 mr-4" />
              <div>
                <Body bold className="md:text-[20px] text-[16px]">
                  Democratic Amount
                </Body>
                <Caption className="pt-1 md:text-[16px] text-[12px] ">
                  50% of the total yield is distributed by vote.
                </Caption>
              </div>
            </div>
          </div>
        </div>
        <VotingHistoryDetail cycleDistribution={cycleDistribution} />
      </div>
    </>
  );
}

function VotingHistoryDetail({
  cycleDistribution,
}: {
  cycleDistribution: CycleDistribution;
}) {
  const projects = [...cycleDistribution.projectDistributions];
  const formattedProjects = [...projects].map((project) => ({
    formatted: formatProjectPayment(project, cycleDistribution.totalYield),
    project,
  }));
  const sortedProjects = formattedProjects.toSorted(
    (a, b) =>
      Number(b.formatted.totalPayment) - Number(a.formatted.totalPayment)
  );

  const isMobile = useIsMobile();

  if (isMobile)
    return <VotingHistoryDetailMobile sortedProjects={sortedProjects} />;

  return <VotingHistoryDetailDesktop sortedProjects={sortedProjects} />;
}

interface Details {
  sortedProjects: {
    formatted: ReturnType<typeof formatProjectPayment>;
    project: ProjectDistribution;
  }[];
}

function VotingHistoryDetailMobile({ sortedProjects }: Details) {
  return (
    <div className="mt-4">
      <div className="w-4/6 mx-auto h-[0.0625rem] my-6" />
      <div className="flex items-center justify-between mb-3">
        <Body bold>Project</Body>
        <Body bold>$BREAD Received</Body>
      </div>
      <div>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue={sortedProjects[0].project.projectAddress}
          collapsible
        >
          {sortedProjects.map(({ formatted, project }) => {
            const meta = projectsMeta[project.projectAddress];

            return (
              <Accordion.Item
                key={project.projectAddress}
                value={project.projectAddress}
                className="border border-paper-2 bg-paper-0 py-2 px-4 mb-4 last:mb-0"
              >
                <Accordion.Trigger className="flex items-center justify-between w-full group">
                  <span className="inline-flex items-center justify-start w-4/6">
                    <img
                      src={meta.logoSrc}
                      className="w-6 h-6 rounded-full mr-2"
                      alt={`${meta.name}'s logo`}
                    />
                    <Body bold className="text-surface-grey mt-1">
                      {meta.name}
                    </Body>
                  </span>
                  <span className="inline-flex items-center justify-end w-1/6">
                    <span className="inline-flex justify-start items-center w-16">
                      <span className="mr-2">
                        <Logo />
                      </span>
                      <span className="inline-flex w-20">
                        <Heading5 className="font-bold">
                          {formatted.totalPayment}
                        </Heading5>
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex justify-end w-1/6">
                    <span>
                      <div className="size-6 ms-2">
                        <CaretDownIcon className="w-full text-primary-orange h-full fill-current group-data-[state=open]:rotate-180" />
                      </div>
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div className="border border-paper-1 p-2 mt-6 mb-3">
                    <Caption className="mb-4">Amount breakdown</Caption>
                    <div className="flex items-center justify-between mb-3">
                      <Body className="text-surface-grey">
                        Democratic amount
                      </Body>
                      <div className="inline-flex items-center justify-end">
                        <span className="mr-1">
                          <Logo size={20} />
                        </span>
                        <Heading5 className="font-bold">
                          {formatted.governancePayment}
                        </Heading5>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Body className="text-surface-grey">
                        Solidarity amount
                      </Body>
                      <div className="inline-flex items-center justify-end">
                        <span className="mr-1">
                          <Logo size={20} />
                        </span>
                        <Heading5 className="font-bold">
                          {formatted.flatPayment}
                        </Heading5>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Body className="text-surface-grey">
                      Share of total yield
                    </Body>
                    <Heading5 className="font-bold">
                      {formatted.percentOfYield}%
                    </Heading5>
                  </div>
                  <div className="flex items-center justify-between">
                    <Body className="text-surface-grey">
                      Total votes received
                    </Body>
                    <Heading5 className="font-bold">
                      {formatted.percentVotes}%
                    </Heading5>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </div>
    </div>
  );
}

function VotingHistoryDetailDesktop({ sortedProjects }: Details) {
  return (
    <div className="mt-4 p-3 border border-paper-2 bg-paper-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-4 px-2">
                <Body bold className="text-surface-grey">
                  Project
                </Body>
              </th>
              <th className="text-center py-4 px-2">
                <Body bold className="text-surface-grey">
                  Total votes received
                </Body>
              </th>
              <th className="text-center py-4 px-2">
                <Body bold className="text-surface-grey">
                  Yield breakdown
                </Body>
              </th>
              <th className="text-right py-4 px-2">
                <Body bold className="text-surface-grey">
                  $BREAD Received
                </Body>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map(({ formatted, project }) => {
              const meta = projectsMeta[project.projectAddress];
              const vote = Number(formatted.percentVotes);

              return (
                <tr
                  key={project.projectAddress}
                  className="text-breadgray-pitchblack dark:text-breadgray-ultra-white"
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <span>
                        <img
                          src={meta.logoSrc}
                          className="w-6 h-6 rounded-full"
                          alt={`${meta.name}'s logo`}
                        />
                      </span>
                      <Body bold className="text-surface-grey">
                        {meta.name}
                      </Body>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <Heading5 className="text-center font-bold">
                      {formatted.percentVotes}%
                    </Heading5>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col gap-1 w-9/12 mx-auto">
                      <div className="h-4 p-1 bg-paper-2 w-full relative flex items-center justify-start">
                        <div
                          className="h-2 "
                          style={{
                            width: `${50 + vote}%`,
                            background: `linear-gradient(to right, #ea6023 0% ${
                              100 - vote
                            }%, #ffc080 ${100 - vote}%)`,
                          }}
                        />
                      </div>
                      <Caption className="font-bold">
                        {formatted.percentOfYield}% of total yield
                      </Caption>
                    </div>
                  </td>
                  <td className="py-4 ps-12">
                    <div className="flex items-center justify-end gap-2">
                      <span className="w-8 inline-block">
                        <Logo />
                      </span>
                      <Heading5 className="font-bold">
                        {formatted.totalPayment}
                      </Heading5>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeftArrowIcon() {
  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.5 4L28.5 6.66667L28.5 25.3333L28.5 28L4.5 28L4.5 25.3333L4.5 6.66667L7.16667 6.66667L7.16667 25.3333L25.8333 25.3333L25.8333 6.66667L4.5 6.66667L4.5 4L28.5 4ZM23.1667 14.6667L23.1667 17.3333L15.1667 17.3333L15.1667 20L12.5 20L12.5 17.3333L9.83333 17.3333L9.83333 14.6667L12.5 14.6667L12.5 12L15.1667 12L15.1667 14.6667L23.1667 14.6667ZM15.1667 12L15.1667 9.33333L17.8333 9.33333L17.8333 12L15.1667 12ZM15.1667 20L17.8333 20L17.8333 22.6667L15.1667 22.6667L15.1667 20Z"
        fill="#E873D3"
      />
    </svg>
  );
}

function RightArrowIcon() {
  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 28L4.5 25.3333L4.5 6.66667L4.5 4L28.5 4L28.5 6.66667L28.5 25.3333L28.5 28L4.5 28ZM25.8333 6.66667L7.16667 6.66667L7.16667 25.3333L25.8333 25.3333L25.8333 6.66667ZM9.83333 17.3333L9.83333 14.6667L17.8333 14.6667L17.8333 12L20.5 12L20.5 14.6667L23.1667 14.6667L23.1667 17.3333L20.5 17.3333L20.5 20L17.8333 20L17.8333 17.3333L9.83333 17.3333ZM15.1667 20L17.8333 20L17.8333 22.6667L15.1667 22.6667L15.1667 20ZM15.1667 9.33333L15.1667 12L17.8333 12L17.8333 9.33333L15.1667 9.33333Z"
        fill="#E873D3"
      />
    </svg>
  );
}
