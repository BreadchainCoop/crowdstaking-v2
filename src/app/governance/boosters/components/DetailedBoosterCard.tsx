import { ReactElement } from "react";
import { header, boostPowerSection, boosterCardButton, expiry} from "@/app/governance/boosters/components/BoosterCard";
import { BoostProgress, BoostRequirement } from "../data/BoostData"
import CloseIcon from "@/app/core/components/Icons/CloseIcon";
import { CheckIcon } from "@/app/core/components/Icons/CheckIcon";

export function DetailedBoosterCard({
    iconName,
    boosterName,
    verified,
    boostAmmount,
    boostAmmountSubtitle,
    description,
    expiration,
    expirationUrgent = false,
    progress,
    requirements,
    close,
}:{
    iconName: string;
    boosterName: string;
    verified: boolean;
    boostAmmount: string;
    boostAmmountSubtitle: string;
    description: string;
    expiration: number | undefined;
    expirationUrgent: boolean;
    progress: BoostProgress, // TODO: avoid sending in Domain models
    requirements: [BoostRequirement],
    close: ()=>void;
}) {
    return (
        <div className="
        w-[512px] flex flex-col justify-center items-center justify-between
        rounded-[15px] p-[20px]
        border border-breadgray-light-grey dark:border-breadgray-burnt 
        bg-breadgray-ultra-white dark:bg-breadgray-grey200
        text-breadgray-rye dark:text-breadgray-grey
        ">
            {header(iconName, boosterName, verified, closeIcon(close))}
            {boostPowerSection(boostAmmount, boostAmmountSubtitle)}
            {detailsSection(description, requirements)}
            {buttons()}
            {expiry(expiration, expirationUrgent, "Helpful information loading...")}
        </div>
    )
}

function closeIcon(close: ()=>void): ReactElement {
    return <button onClick={close} className="w-[24px] h-[24px]">{CloseIcon()}</button>
}

function buttons(): ReactElement {
    const buttonStyleVerify = "bg-[#FFCCF1] dark:bg-[#402639] text-breadviolet-violet dark:text-breadpink-shaded"
    const buttonStyleGet = "text-[#FFCCF1] dark:text-[#402639] bg-breadviolet-violet dark:bg-breadpink-shaded"

    return (
      <>
        {boosterCardButton(close, buttonStyleGet, "Get")}
        {boosterCardButton(close, buttonStyleVerify, "Verify")}
      </>
    );
}

function detailsSection(description: String, requirements: [BoostRequirement]): ReactElement {
    return(
        <div className="px-[20px] flex flex-col gap-[24px] my-[24px]">
            <div className="flex flex-col gap-[8px]">
                {requirements.map((item, index)=>(
                    requirement(item.name, item.achieved)
                ))}
            </div>
            <p>{description}</p>
        </div>
    )
}

function requirement(text: String, complete: Boolean): ReactElement {
    return(
        <div className="flex flex-row gap-2 justify-start items-center">
            {complete ? 
                <span className="w-[18px] h-[20px] text-status-success ml-[4px] mt-[5px]">{CheckIcon()}</span> : 
                <span className="w-[24px] h-[24px] text-status-danger">{CloseIcon()}</span>
            }
            <span className="text-breadgray-og-dark dark:text-breadgray-ultra-white mb-[-2px]">{text}</span>
        </div>
    )
}