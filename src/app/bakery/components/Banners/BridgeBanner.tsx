import { GnosisIcon } from "@/app/core/components/Icons/TokenIcons";
import Image from "next/image";
import {
  BannerCardLarge,
  BannerCardSmall,
  BannerContainer,
  BannerTitle,
  BannerDescription,
  BannerHighlight,
  ArrowIcon,
} from "./Shared";

const jumpLink = "https://app.debridge.finance/?outputChain=100";

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
    <BannerContainer>
      {/* large */}
      <a href={jumpLink} target="_blank" rel="noopener noreferrer">
        <BannerCardLarge>
          {renderGnosisLogo()}
          {/* First Column: Gnosis Icon */}
          <div className="w-[10%] flex justify-center items-center">
            <GnosisIcon />
          </div>
          {/* Second Column: Text */}
          <div className="w-[85%]">
            <BannerTitle>Gnosis Chain token bridge</BannerTitle>
            <BannerDescription>
              Deposit tokens to the Gnosis Chain network
            </BannerDescription>
          </div>
          {/* Third Column: Arrow */}
          <div className="w-[5%] flex justify-center items-center text-xl text-breadgray-grey300 dark:text-white transition-transform group-hover:translate-x-3">
            <ArrowIcon />
          </div>{" "}
        </BannerCardLarge>
      </a>
      {/* small */}
      <a href={jumpLink} target="_blank" rel="noopener noreferrer">
        <BannerCardSmall>
          {renderGnosisLogo()}
          {/* Title */}
          <BannerTitle>Gnosis Chain token bridge</BannerTitle>

          {/* Description */}
          <BannerDescription>
            Deposit tokens to the Gnosis Chain network
          </BannerDescription>

          {/* Icon Section */}

          <BannerHighlight icon={<GnosisIcon size="small" />}>
            Bridge to Gnosis
          </BannerHighlight>
        </BannerCardSmall>
      </a>
    </BannerContainer>
  );
}
