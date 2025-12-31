import { Hex } from "viem";
import { useGapProjectData } from "../../useGapProjectData";
import { GapModalContent } from "./GapModalContent";
import TooltipIcon from "@/app/core/components/Icons/TooltipIcon";
import { useModal } from "@/app/core/context/ModalContext";

interface GapInfoIconProps {
  address: Hex;
}

/**
 * Info icon component that displays Karma GAP project data in a modal window
 *
 * Only renders for projects with GAP URLs
 * Modal shows comprehensive milestones, updates, and team information
 */
export function GapInfoIcon({ address }: GapInfoIconProps) {
  const { data, isLoading, error } = useGapProjectData(address);
  const { setModal } = useModal();

  const handleClick = () => {
    setModal({
      type: "GENERIC_MODAL",
      showCloseButton: true,
      includeContainerStyling: true,
      children: (
        <GapModalContent data={data ?? null} isLoading={isLoading} error={error} />
      ),
    });
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center cursor-pointer"
      aria-label="View project details from Karma GAP"
    >
      <TooltipIcon />
    </button>
  );
}
