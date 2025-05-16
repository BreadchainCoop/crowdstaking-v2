import React, { ReactElement } from "react";
import { Metamask } from "@/app/core/components/Icons/Metamask";
import { Coinbase } from "@/app/core/components/Icons/Coinbase";
import { BreadSVG } from "@/app/core/components/Icons/Bread";

// To be filled in once we have the appropriate icons
export enum IconName {
    MetaMask = "metaMask",
    Coinbase = "coinBase",
    Network = "network"
}

interface SvgIconProps {
  name: IconName;
  className?: string;
}

const getIcon = (name: IconName): ReactElement => {
    switch (name) {
      case "metaMask":
        return Metamask();
      case "coinBase":
        return Coinbase();
      case "network":
        return BreadSVG({});
      default:
        throw new Error("Invalid icon name");
    }
};

function BoosterIcon({ name, className }: SvgIconProps) {
  const wrapperClasses = `inline-flex items-center justify-center rounded-full overflow-hidden w-[45px] h-[45px] ${className || ""}`;
  const IconComponent = getIcon(name);

  return (
    <div className={wrapperClasses}>
        {IconComponent}
    </div>
  );
}

export default BoosterIcon;
