import React, { ReactElement } from "react";
import { header, boostPowerSection, boosterCardButton, expiry } from "@/app/governance/boosters/components/BoosterCard";
import CloseIcon from "@/app/core/components/Icons/CloseIcon";
import CheckDoubleIcon from "@/app/core/components/Icons/CheckDouble";

export interface ProgressItem {
  title: string;
  subtitle: string | null;
  achieved: boolean;
}

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
}: {
  iconName: string;
  boosterName: string;
  verified: boolean;
  boostAmmount: string;
  boostAmmountSubtitle: string;
  description: string;
  expiration: number | undefined;
  expirationUrgent: boolean;
  progress: ProgressItem[],
  requirements: ProgressItem[],
  close: () => void;
}) {
  return (
    <div className="
        max-w-[512px] flex flex-col justify-center items-center justify-between
        rounded-[15px] p-[20px]
        border border-breadgray-light-grey dark:border-breadgray-burnt 
        bg-breadgray-ultra-white dark:bg-breadgray-grey200
        text-breadgray-rye dark:text-breadgray-grey
        ">
      {header(iconName, boosterName, verified, closeIcon(close))}
      {boostPowerSection(boostAmmount, boostAmmountSubtitle)}
      {detailsSection(description, requirements, progress)}
      {buttons()}
      {expiry(expiration, expirationUrgent, "Helpful information loading...")}
    </div>
  )
}

function closeIcon(close: () => void): ReactElement {
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

function detailsSection(description: String, requirements: ProgressItem[], progress: ProgressItem[]): ReactElement {
  return (
    <div className="px-[20px] flex flex-col gap-[24px] my-[24px]">
      {(progress.length > 0) && boostProgress(progress)}
      {(requirements.length > 0) && requirementsList(requirements)}
      <p>{description}</p>
    </div>
  )
}

// Displays the horizontal progress bar with text beneath it
// Note, this component expects Boost Progress to be ordered with completed items at the start.
function boostProgress(progress: ProgressItem[]): ReactElement {
  let numberItems = progress.length
  let numberCompleted = progress.findIndex(item => item.achieved === false)
  if (numberCompleted == -1) { numberCompleted = numberItems }
  const percentComplete = numberItems > 0 ? (numberCompleted / numberItems) * 100 : 5;
  return (
    <div className="flex flex-col gap-4">
      {progressBar(percentComplete)}
      {/* Sequential items display */}
      <div className="flex flex-row w-full justify-around">
        {progress.map((item, index) => (
          <React.Fragment key="index">
            {progressText(item.title, item.subtitle)}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function progressText(title: String, subtitle: String | null): ReactElement {
  return (
    <div className="
      max-w-[100px] 
      flex flex-col items-center text-center 
      text-gray-400
    ">
      <div className="font-semibold text-[16px] mb-[4px] text-breadgray-pitchblack dark:text-breadgray-ultra-white">{title}</div>
      {subtitle && (
        <div className="text-[10px] text-breadgray-rye dark:text-breadgray">{subtitle}</div>
      )}
    </div>
  )
}

function progressBar(percentComplete: Number): ReactElement {
  return (
    <div className="
        w-full h-[16px] rounded-full
        bg-breadpink-shaded/10 
      ">
      <div // This inner container creates a clipping mask for the filled section, prevents over-filling at 100%
        className="
            h-[12px] m-[2px] rounded-full
            relative overflow-hidden"
      >
        <div
          className="
              h-full absolute top-0 left-0 
              bg-breadviolet-shaded rounded-full"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  )
}

function requirementsList(requirements: ProgressItem[]): ReactElement {
  return (
    <div className="flex flex-col gap-[8px]">
        {requirements.map((item) => (
          <React.Fragment key={item.title}>
            {requirement(item.title, item.achieved)}
          </React.Fragment>
        ))}
    </div>
  )
}

// Displays a requirement line item, with the tick or cross icon next to it
function requirement(text: String, complete: Boolean): ReactElement {
  return (
    <div className="flex flex-row gap-2 justify-start items-center">
      {complete ?
        <span className="w-[21px] h-[21px] text-status-success ml-[3px] mt-[2px]">{CheckDoubleIcon()}</span> :
        <span className="w-[24px] h-[24px] text-status-danger">{CloseIcon()}</span>
      }
      <span className="text-breadgray-og-dark dark:text-breadgray-ultra-white mb-[-2px]">{text}</span>
    </div>
  )
}