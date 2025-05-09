import { projectsMeta } from "@/app/projectsMeta";
import { formatBalance, formatProjectPayment } from "@/app/core/util/formatter";
import { formatUnits, Hex } from "viem";
import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { format } from "date-fns";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";
import * as Accordion from "@radix-ui/react-accordion";

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
    <div className="py-3  border border-breadgray-light-grey dark:border-breadgray-rye rounded-[0.625rem] flex flex-col items-center justify-center mb-1 md:flex-1 md:mb-0">
      <div className="flex items-center justify-center mb-1 text-breadgray-pitchblack dark:text-breadgray-ultra-white">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-breadgray-rye md:text-[20px] text-[16px] dark:text-breadgray-ultra-white text-[1rem] dark:md:text-breadgray-grey md:uppercase">
            {title}
          </p>
          <p className="gap-2 md:text-[38px] text-[24px] font-semibold inline-flex items-center">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

export function VotingHistory({
  cycleDistribution,
}: {
  cycleDistribution: CycleDistribution | null;
}) {
  if (!cycleDistribution) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <header>
        <h2 className="pb-2 text-breadgray-pitchblack dark:text-breadgray-ultra-white text-lg font-bold tracking-wider md:text-[2rem]">
          Last cycle
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
          <TopCard title="Last cycle">
            Cycle #{cycleDistribution.cycleNumber}
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
  const isMobile = useIsMobile();

  if (isMobile)
    return <VotingHistoryDetailMobile cycleDistribution={cycleDistribution} />;

  return <VotingHistoryDetailDesktop cycleDistribution={cycleDistribution} />;
}

function VotingHistoryDetailMobile({
  cycleDistribution,
}: {
  cycleDistribution: CycleDistribution;
}) {
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
          defaultValue={
            cycleDistribution.projectDistributions[0].projectAddress
          }
          collapsible
        >
          {cycleDistribution.projectDistributions.map((project) => {
            const formatted = formatProjectPayment(
              project,
              cycleDistribution.totalYield
            );

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

function VotingHistoryDetailDesktop({
  cycleDistribution,
}: {
  cycleDistribution: CycleDistribution;
}) {
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
            {cycleDistribution.projectDistributions.map((project) => {
              const formatted = formatProjectPayment(
                project,
                cycleDistribution.totalYield
              );

              const meta = projectsMeta[project.projectAddress];

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
                      <div className="h-2 bg-breadgray-charcoal rounded-full w-full relative">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-[linear-gradient(to_right,#D04EC5_60%,#FF99E2)]"
                          style={{
                            width: `${formatted.percentOfYield}%`,
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
