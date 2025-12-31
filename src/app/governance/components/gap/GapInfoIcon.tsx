import { useId } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Hex } from "viem";
import { useGapProjectData } from "../../useGapProjectData";
import { GapTooltipContent } from "./GapTooltipContent";
import TooltipIcon from "@/app/core/components/Icons/TooltipIcon";

interface GapInfoIconProps {
  address: Hex;
}

/**
 * Info icon component that displays Karma GAP project data in a tooltip
 *
 * Only renders for projects with GAP URLs
 * Tooltip shows milestones, updates, and team information
 */
export function GapInfoIcon({ address }: GapInfoIconProps) {
  const tooltipId = useId();
  const { data, isLoading, error } = useGapProjectData(address);

  return (
    <>
      <a
        data-tooltip-id={tooltipId}
        className="inline-flex items-center cursor-pointer"
        aria-label="View project details from Karma GAP"
      >
        <TooltipIcon />
      </a>
      <ReactTooltip
        id={tooltipId}
        className="!bg-paper-main !rounded-[15px] !text-surface-grey-2 !p-5 !backdrop-blur-sm !z-50"
        opacity={1}
        place="top"
        clickable
      >
        <GapTooltipContent data={data ?? null} isLoading={isLoading} error={error} />
      </ReactTooltip>
    </>
  );
}
