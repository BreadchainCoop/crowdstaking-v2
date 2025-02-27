import { ReactElement } from "react";
import { header, boostPowerSection, boosterCardButton, expiry} from "@/app/governance/boosters/components/BoosterCard";
import CloseIcon from "@/app/core/components/Icons/CloseIcon";

const buttonStyle = "bg-[#FFCCF1] dark:bg-[#402639] text-breadviolet-violet dark:text-breadpink-shaded"

export function DetailedBoosterCard({
    iconName,
    boosterName,
    verified,
    boostAmmount,
    boostAmmountSubtitle,
    description,
    expiration,
    expirationUrgent = false,
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
            <p className="my-[24px]" >{description}</p>
            {buttons()}
            {expiry(expiration, expirationUrgent, "Helpful information loading...")}
        </div>
    )
}

function closeIcon(close: ()=>void): ReactElement {
    return <button onClick={close} className="w-[24px] h-[24px]">{CloseIcon()}</button>
}

function buttons(): ReactElement {
    return (
      <>
        {boosterCardButton(close, buttonStyle, "Accept")}
        {boosterCardButton(close, buttonStyle, "Decline")}
      </>
    );
  }

  