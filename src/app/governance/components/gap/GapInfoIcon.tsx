import { Hex } from "viem";
import { GapModalContent } from "./GapModalContent";
import InfoIcon from "@/app/core/components/Icons/InfoIcon";
import { useModal } from "@/app/core/context/ModalContext";

interface GapInfoIconProps {
  address: Hex;
}

/**
 * Info icon button that displays Karma GAP project data in a modal window
 *
 * Only renders for projects with GAP URLs
 * Modal shows comprehensive milestones, updates, and team information
 */
export function GapInfoIcon({ address }: GapInfoIconProps) {
  const { setModal } = useModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setModal({
      type: "GENERIC_MODAL",
      showCloseButton: true,
      includeContainerStyling: true,
      children: <GapModalContent address={address} />,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center cursor-pointer w-6 h-6 rounded hover:bg-surface-grey-3/20 transition-colors"
      aria-label="View project details from Karma GAP"
      type="button"
    >
      <InfoIcon />
    </button>
  );
}
