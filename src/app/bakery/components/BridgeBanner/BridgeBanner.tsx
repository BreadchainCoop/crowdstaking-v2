import { GnosisIcon } from "@/app/core/components/Icons/TokenIcons";
import Image from "next/image";

const jumpLink =
  "https://jumper.exchange/?fromChain=100&toChain=100&toToken=0x0000000000000000000000000000000000000000";

const renderGnosisLogo = () => {
  return (
    <Image
      src="/gnosis-logo-bg.png"
      alt="Gnosis logo"
      className="absolute top-0 left-0 w-auto h-auto duration-300 group-hover:opacity-100 opacity-0 transition-all z-0"
      width="222"
      height="191"
    ></Image>
  );
};

export function BridgeBanner() {
  return (
    <div>
      {/* large */}
      <div className="hidden sm:flex max-w-[30rem] px-3 border-breadgray-light-grey dark:border-transparent border hover:border-breadpink-300 m-auto rounded-xl bg-breadgray-ultra-white dark:bg-breadgray-charcoal transition-all group relative overflow-hidden">
        {renderGnosisLogo()}
        <a
          className="flex gap-4 p-4 w-full relative overflow-hidden items-center"
          href={jumpLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* First Column: Gnosis Icon */}
          <div className="w-[10%] flex justify-center items-center">
            <GnosisIcon />
          </div>
          {/* Second Column: Text */}
          <div className="w-[85%]">
            <div className="text-breadgray-grey300 dark:text-white text-2xl font-medium">
              Gnosis Chain token bridge
            </div>
            <div className="text-breadgray-grey300 dark:text-breadgray-grey">
              Deposit tokens to the Gnosis Chain network
            </div>
          </div>
          {/* Third Column: Arrow */}
          <div className="w-[5%] flex justify-center items-center text-xl text-breadgray-grey300 dark:text-white transition-transform group-hover:translate-x-3">
            <ArrowIcon />
          </div>{" "}
        </a>
      </div>
      {/* small */}
      <div className="sm:hidden transition-opacity flex max-w-[30rem] m-auto rounded-xl bg-breadgray-ultra-white dark:bg-breadgray-charcoal border border-transparent hover:border-breadpink-300 transition-all group relative overflow-hidden">
        {renderGnosisLogo()}
        <a
          className="flex flex-col gap-2 p-4 w-full relative overflow-hidden"
          href={jumpLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Title */}
          <div className="text-breadgray-grey300 dark:text-white text-2xl font-medium">
            Gnosis Chain token bridge
          </div>

          {/* Description */}
          <div className="text-breadgray-grey300 dark:text-breadgray-grey">
            Deposit tokens to the Gnosis Chain network
          </div>

          {/* Icon Section */}
          <div className="flex items-center gap-2 rounded-2xl text-xl px-7 py-3 bg-gnosis-green font-medium text-white">
            <span className="">
              <GnosisIcon size="small" />
            </span>
            <span>Bridge to Gnosis</span>
            <span className="ml-auto dark:fill-white">
              <ArrowIcon fill="white" />
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

function ArrowIcon({ fill = "" }) {
  return (
    <svg
      width="16"
      height="15"
      className="group-hover:fill-breadpink-300 fill-breadgray-rye dark:fill-breadgray-grey transition-colors"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill={fill ? fill : ""}
        d="M2.62268e-07 6.5L3.49691e-07 8.5L12 8.5L12 10.5L14 10.5L14 8.5L16 8.5L16 6.5L14 6.5L14 4.5L12 4.5L12 6.5L2.62268e-07 6.5ZM10 2.5L12 2.5L12 4.5L10 4.5L10 2.5ZM10 2.5L8 2.5L8 0.5L10 0.5L10 2.5ZM10 12.5L12 12.5L12 10.5L10 10.5L10 12.5ZM10 12.5L8 12.5L8 14.5L10 14.5L10 12.5Z"
      />
    </svg>
  );
}
