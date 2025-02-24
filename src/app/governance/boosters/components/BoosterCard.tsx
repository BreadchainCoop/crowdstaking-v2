import { ReactElement } from "react";
import { XDAIIcon } from "@/app/core/components/Icons/TokenIcons"; // Temporary for testing purposes
import { CheckIcon } from "@/app/core/components/Icons/CheckIcon";
import Tooltip from "@/app/core/components/Tooltip";

export function BoosterCard({
    iconName,
    boosterName,
    verified,
    boostAmmount,
    boostAmmountSubtitle,
    description,
    expiration,
    expirationUrgent = false,
}:{
    iconName: string;
    boosterName: string;
    verified: boolean;
    boostAmmount: string;
    boostAmmountSubtitle: string;
    description: string;
    expiration: number | undefined;
    expirationUrgent: boolean;
}) {
    return(
        <div className="
            w-full flex flex-col justify-center items-center justify-between
            rounded-[15px] p-[20px]
            border border-breadgray-light-grey dark:border-breadgray-burnt 
            bg-breadgray-ultra-white dark:bg-breadgray-grey200
            text-breadgray-rye dark:text-breadgray-grey
            ">
            {header(iconName, boosterName, verified)}
            {boostPowerSection(boostAmmount, boostAmmountSubtitle)}
            <p className="my-[24px]" >{description}</p>
            {viewButton(verified)}
            {expiry(expiration, expirationUrgent, "Helpful information loading")}
        </div>
    )
}

function header(iconName: string, boosterName: string, verified: boolean): ReactElement {
    return(
        <div className="flex items-center w-full justify-between pb-6">
            <div className="flex items-center space-x-3">
                {getIcon(iconName)}
                <span className="
                    shrink-[5]
                    text-[20px] uppercase font-medium leading-none
                    text-breadgray-rye dark:text-breadgray-grey 
                    ">
                    {boosterName}
                </span>
            </div>
            {verifiedBadge(verified)}
        </div>
    )
}

function verifiedBadge(verified: boolean): ReactElement {
    const colorClass = verified ? "text-status-success bg-status-success/10" : "bg-[rgba(152,151,151,0.1)]"
    return (
        <div className={`
            leading-none 
            ml-[12px] py-[4px] px-[6px] rounded-full 
            text-[12px] font-semibold 
            ${colorClass}
            `}>
            {verified ? "Verified" : "Unverified" }
        </div>
    )
}

function boostPowerSection(ammount: string, subtitle: string): ReactElement {
    return (
        <div className="
            h-[145px] w-full relative
            flex flex-col justify-center items-center 
            rounded-lg 
            bg-white dark:bg-breadgray-pitchblack
            p-4 text-center
            ">
            <div className="
                absolute inset-0 
                bg-[radial-gradient(50%_90%_at_50%_110%,rgba(232,115,211,0.3)_0%,rgba(64,38,56,0)_100%)]
                ">
                {/* This element simply adds the gradient. It has opacity and layers ontop of the solid background */}
            </div>
            <p className="font-bold text-[30px] bread-pink-text-gradient">{ammount}</p>
            <div className="flex items-center gap-2">
                <p className="block text-[16px] pb-[5px]">{subtitle}</p>
                <Tooltip>Helpful information loading...</Tooltip>
            </div>
        </div>
    )
}

function getIcon(iconName: string): ReactElement {
    return <XDAIIcon />
}

function viewButton(verified: boolean): ReactElement {
    const buttonStyles = verified
      ? "bg-[rgba(152,151,151,0.1)] dark:bg-breadgray-charcoal text-status-success" // Verified
      : "bg-[#FFCCF1] dark:bg-[#402639] text-breadviolet-violet dark:text-breadpink-shaded"; // Not verified
  
    const handleClick = () => {
      alert(verified ? "Oh YEAH! VIP" : "Oh you're interested are ya?");
    };
  
    return (
      <button
        onClick={handleClick}
        className={`
          w-full h-[50px] mb-[10px] rounded-[10px]
          flex items-center justify-center
          ${buttonStyles}
        `}
      >
        {verified ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-[20px] text-status-success"><CheckIcon /></div>
            <span className="font-semibold text-[20px]">Verified</span>
            <span className="font-normal text-[16px] dark:text-breadpink-shaded">view</span>
          </div>
        ) : (
          <span className="font-semibold text-[20px]">View</span>
        )}
      </button>
    );
  }
  

function expiry(
    expiration: number | undefined, 
    expirationUrgent: boolean,
    tooltipContent: string
): ReactElement | undefined {
    if (!expiration) {
        return undefined
    }
    const textColorClass = expirationUrgent ? "text-[#F2D54E]" : "text-breadgray-grey"
    return (
        <div className="flex flex-row items-center justify-center">
            <span className={`${textColorClass} leading-none mb-[6px] mr-[6px]`}>{expiration} days until booster expires</span>
            <Tooltip>Boo</Tooltip>
        </div>
    )
}