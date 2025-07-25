import { projectsMeta } from "@/app/projectsMeta";
import { formatBalance, formatProjectPayment } from "@/app/core/util/formatter";
import { formatUnits, Hex } from "viem";
import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { format } from "date-fns";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { useDistributions } from "../useDistributions";

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
    <div className="py-3 border border-breadgray-light-grey dark:border-breadgray-rye rounded-[0.625rem] flex flex-col items-center justify-center mb-1 md:flex-1 md:mb-0">
      <div className="flex items-center justify-center mb-1 text-breadgray-pitchblack dark:text-breadgray-ultra-white">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-breadgray-rye md:text-[20px] text-[16px] dark:text-breadgray-ultra-white text-[1rem] dark:md:text-breadgray-grey md:uppercase">
            {title}
          </p>
          <p className="gap-2 md:text-[30px] text-[24px] font-semibold inline-flex items-center">
            {children}
          </p>
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
        <h2 className="pb-2 text-breadgray-pitchblack dark:text-breadgray-ultra-white text-lg font-bold tracking-wider md:text-[2rem]">
          Previous cycle
        </h2>
        <p className="text-breadgray-rye dark:text-breadgray-light-grey text-xl">
          These are the results of the previous voting cycle #
          {cycleDistribution.cycleNumber}.
        </p>
        <p className="pt-6 text-left text-breadgray-rye dark:text-breadgray-grey">
          Ended on{" "}
          {format(new Date(cycleDistribution.distributionDate), "MMM d, yyyy")}
        </p>
      </header>
      <div>
        <div className="my-3 md:flex md:flex-row-reverse md:gap-4">
          <TopCard title="Total yield distributed">
            <BreadIcon />
            {formatBalance(
              Number(formatUnits(BigInt(cycleDistribution.totalYield), 18)),
              2
            )}
          </TopCard>
          <TopCard title="Previous cycle">
            <button
              onClick={() => updateCycleIdex(1)}
              disabled={
                !totalDistributions || cycleIndex === totalDistributions - 1
              }
              className="disabled:opacity-50"
            >
              <LeftArrowIcon />
            </button>
            Cycle #{cycleDistribution.cycleNumber}
            <button
              onClick={() => updateCycleIdex(-1)}
              disabled={!totalDistributions || cycleIndex === 0}
              className="disabled:opacity-50"
            >
              <RightArrowIcon />
            </button>
          </TopCard>
        </div>

        <div className="p-3 border border-breadgray-light-grey dark:border-breadgray-rye rounded-[0.625rem] mt-1 md:px-8 md:py-4">
          <h3 className="pb-2 md:uppercase md:text-[20px] text-[16px] text-breadgray-pitchblack dark:text-breadgray-ultra-white md:text-breadgray-rye dark:md:text-breadgray-grey text-center md:font-medium md:text-left md:mb-2">
            How yield is distributed
          </h3>
          <div className="md:flex md:items-center md:justify-center md:gap-4">
            <div className="mb-4 md:flex-1 md:flex md:items-center md:mb-0">
              <div className="hidden md:inline-block md:rounded md:w-1 md:h-12 md:bg-breadpink-500 md:mr-2" />
              <div>
                <p className="font-bold md:text-[20px] text-[16px] text-breadgray-pitchblack dark:text-breadgray-ultra-white">
                  Solidarity Amount
                </p>
                <p className="pt-1 md:text-[16px] text-[12px] text-breadgray-rye dark:text-breadgray-grey md:dark:text-breadgray-white text-sm font-medium">
                  50% of the total yield is distributed equally.
                </p>
              </div>
            </div>
            <div className="md:flex-1 md:flex md:items-center">
              <div className="hidden md:inline-block md:rounded md:w-1 md:h-12 md:bg-breadpink-500 md:mr-2" />
              <div>
                <p className="font-bold md:text-[20px] text-[16px] text-breadgray-pitchblack dark:text-breadgray-ultra-white">
                  Democratic Amount
                </p>
                <p className="pt-1 md:text-[16px] text-[12px] text-breadgray-rye dark:text-breadgray-grey md:dark:text-breadgray-white text-sm font-medium">
                  50% of the total yield is distributed by vote.
                </p>
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
      <div className="w-4/6 mx-auto h-[0.0625rem] my-6 bg-breadgray-grey dark:bg-breadgray-rye" />
      <div className="flex items-center justify-between mb-3 text-breadgray-pitchblack dark:text-breadgray-ultra-white font-bold">
        <p>Project</p>
        <p>$BREAD Received</p>
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
                className="border border-breadgray-grey rounded-[0.625rem] py-2 px-4 mb-4 last:mb-0"
              >
                <Accordion.Trigger className="flex items-center justify-between w-full text-breadgray-pitchblack dark:text-breadgray-ultra-white group">
                  <span className="inline-flex items-center justify-start w-4/6">
                    <img
                      src={meta.logoSrc}
                      className="w-6 h-6 rounded-full mr-2"
                      alt={`${meta.name}'s logo`}
                    />
                    <span className="">{meta.name}</span>
                  </span>
                  <span className="inline-flex items-center justify-end w-1/6">
                    <span className="inline-flex justify-start items-center w-16">
                      <span className="mr-2">
                        <BreadIcon />
                      </span>
                      <span className="inline-flex w-20">
                        <span className="font-bold">
                          {formatted.totalPayment}
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex justify-end w-1/6">
                    <span>
                      <div className="size-6 ms-2 text-breadgray-grey100 dark:text-breadgray-ultra-white">
                        <svg
                          className="w-full h-full fill-current group-data-[state=open]:rotate-180"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7 8H5V10H7V12H9V14H11V16H13V14H15V12H17V10H19V8H17V10H15V12H13V14H11V12H9V10H7V8Z"
                          />
                        </svg>
                      </div>
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content className="text-breadgray-rye dark:text-breadgray-grey">
                  <div className="border border-breadgray-light-grey p-2 rounded-[0.3125rem] mt-6 mb-3">
                    <p className="mb-4 font-medium">Amount breakdown</p>
                    <div className="flex items-center justify-between mb-3">
                      <p>Democratic amount</p>
                      <div className="inline-flex items-center justify-end">
                        <span className="mr-1">
                          <BreadIcon />
                        </span>
                        <span className="text-breadgray-pitchblack dark:text-breadgray-ultra-white font-bold">
                          {formatted.governancePayment}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Solidarity amount</p>
                      <div className="inline-flex items-center justify-end">
                        <span className="mr-1">
                          <BreadIcon />
                        </span>
                        <span className="text-breadgray-pitchblack dark:text-breadgray-ultra-white font-bold">
                          {formatted.flatPayment}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p>Share of total yield</p>
                    <p className="text-breadgray-pitchblack dark:text-breadgray-ultra-white font-bold">
                      {formatted.percentOfYield}%
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Total votes received</p>
                    <p className="text-breadgray-pitchblack dark:text-breadgray-ultra-white font-bold">
                      {formatted.percentVotes}%
                    </p>
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
    <div className="mt-4 p-3 border border-breadgray-rye rounded-[0.625rem]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-4 px-2 text-breadgray-rye dark:text-breadgray-light-grey font-bold text-lg">
                Project
              </th>
              <th className="text-center py-4 px-2 text-breadgray-rye dark:text-breadgray-light-grey font-bold text-lg">
                Total votes received
              </th>
              <th className="text-center py-4 px-2 text-breadgray-rye dark:text-breadgray-light-grey font-bold text-lg">
                Yield breakdown
              </th>
              <th className="text-right py-4 px-2 text-breadgray-rye dark:text-breadgray-light-grey font-bold text-lg">
                $BREAD Received
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
                      <span className="font-normal text-lg">{meta.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="block font-medium text-xl text-center">
                      {formatted.percentVotes}%
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col gap-1 w-9/12 mx-auto">
                      <div className="h-4 p-1 bg-breadgray-charcoal rounded-full w-full relative flex items-center justify-start">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${50 + vote}%`,
                            background: `linear-gradient(to right, #D04EC5 0% ${
                              100 - vote
                            }%, #FF99E2 ${100 - vote}%)`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {formatted.percentOfYield}% of total yield
                      </span>
                    </div>
                  </td>
                  <td className="py-4 ps-12">
                    <div className="flex items-center justify-start gap-2">
                      <span className="w-8 inline-block">
                        <BreadIcon />
                      </span>
                      <span className="font-medium text-lg">
                        {formatted.totalPayment}
                      </span>
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
