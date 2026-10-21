import { forwardRef, Ref, useId, type ReactNode } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import TooltipIcon from "@/app/core/components/Icons/TooltipIcon";
import { Body } from "@breadcoop/ui";

interface IProps {
  children: ReactNode;
}

const Tooltip = forwardRef(
  ({ children }: IProps, ref: Ref<HTMLButtonElement>) => {
    const id = useId();

    return (
      <div>
        <ReactTooltip anchorSelect=".my-tooltip" place="top"></ReactTooltip>
        <button type="button" data-tooltip-id={id} aria-label="More info">
          {" "}
          <TooltipIcon />
        </button>
        <ReactTooltip
          id={id}
          className="!bg-paper-main !rounded-[15px] !text-surface-grey-2 !p-5 !backdrop-blur-sm"
          opacity={1}
        >
          <Body className="max-w-[210px]">{children}</Body>
        </ReactTooltip>
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
