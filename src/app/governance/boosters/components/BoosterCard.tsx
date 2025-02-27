import { ReactElement } from "react";
import { CheckIcon } from "@/app/core/components/Icons/CheckIcon";
import Tooltip from "@/app/core/components/Tooltip";
import BoosterIcon, { IconName } from "@/app/governance/boosters/components/BoosterIcon";
import { Boost } from "@/app/governance/boosters/data/BoostData";
import { useModal } from "@/app/core/context/ModalContext";
import { DetailedBoosterCard } from "./DetailedBoosterCard";
import { mapBoostToDetailedCardProps } from "../data/BoostData"

export function BoosterCard({
    boost,
    iconName,
    boosterName,
    verified,
    boostAmmount,
    boostAmmountSubtitle,
    description,
    expiration,
    expirationUrgent = false,
}:{
    boost: Boost;
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
            {presentModalButton(boost)}
            {viewButton(verified, ()=>(alert(verified ? "Oh YEAH! VIP" : "Oh you're interested are ya?")))}
            {expiry(expiration, expirationUrgent, "Helpful information loading...")}
        </div>
    )
}

function presentModalButton(boost: Boost) {
    const { setModal } = useModal();
    const openModal = () => {
        setModal({
            type: "GENERIC_MODAL",
            showCloseButton: false,
            includeContainerStyling: false,
            children: (
                <DetailedBoosterCard close={()=>(setModal(null))} {...mapBoostToDetailedCardProps(boost) } />
            )
        })
    }
    return <button 
        onClick={openModal}
        className="w-full px-4 py-2 bg-green-500 text-white rounded"
        >
            Open Custom Modal
    </button>
}

export function header(iconName: string, boosterName: string, verified: boolean): ReactElement {
    return(
        <div className="w-full pb-6 flex items-center justify-between">
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

export function boostPowerSection(ammount: string, subtitle: string): ReactElement {
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
            <p className="font-bold text-[30px] bread-pink-text-gradient z-0">{ammount}</p>
            <div className="flex items-center gap-2 z-30">
                <p className="block text-[16px] pb-[5px]">{subtitle}</p>
                <Tooltip>Helpful information loading...</Tooltip>
            </div>
        </div>
    )
}

function getIcon(iconName: string): ReactElement {
    // To be updated once we have actual icons
    const iconNames = Object.values(IconName);
    const randomIconName = iconNames[Math.floor(Math.random() * iconNames.length)] as IconName
    return <BoosterIcon name={randomIconName} className="flex-shrink-0 bg-breadgray-charcoal"></BoosterIcon>
}

export function viewButton(verified: boolean, onClick: ()=>void): ReactElement {
    const buttonStyles = verified
      ? "bg-[rgba(152,151,151,0.1)] dark:bg-breadgray-charcoal text-status-success" // Verified
      : "bg-[#FFCCF1] dark:bg-[#402639] text-breadviolet-violet dark:text-breadpink-shaded"; // Not verified
  
    return (
      <button
        onClick={onClick}
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
  

export function expiry(
    expiration: number | undefined, 
    expirationUrgent: boolean,
    tooltipContent: string
): ReactElement | undefined {
    if (!expiration) {
        return undefined
    }
    const textColorClass = expirationUrgent ? "text-[#F2D54E]" : "text-breadgray-grey"
    return (
        <div className="flex flex-row items-center justify-center mb-[-6px]">
            <span className={`${textColorClass} leading-none mb-[6px] mr-[6px]`}>{expiration} days until booster expires</span>
            <Tooltip>{tooltipContent}</Tooltip>
        </div>
    )
}