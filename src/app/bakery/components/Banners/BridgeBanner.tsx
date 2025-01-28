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
  BannerLargeTextContainer,
} from "./Shared";

const jumpLink = "https://app.debridge.finance/?outputChain=100";

const BANNER_TITLE = "Gnosis Chain token bridge";
const BANNER_DESCRIPTION = "Deposit tokens to the Gnosis Chain network";

export function BridgeBanner() {
  return (
    <BannerContainer>
      {/* large */}
      <a href={jumpLink} target="_blank" rel="noopener noreferrer">
        <BannerCardLarge>
          <GnosisLogoBackground />
          <div className="w-[3rem] flex justify-center items-center">
            <GnosisIcon />
          </div>
          <BannerLargeTextContainer>
            <BannerTitle>{BANNER_TITLE}</BannerTitle>
            <BannerDescription>{BANNER_DESCRIPTION}</BannerDescription>
          </BannerLargeTextContainer>
          {/* Third Column: Arrow */}
          <div className="flex justify-center items-center group-hover:text-breadviolet-shaded group-hover:dark:text-breadpink-300 text-breadgray-rye dark:text-breadgray-grey group-hover:translate-x-3 transition-all">
            <ArrowIcon />
          </div>
        </BannerCardLarge>
      </a>
      {/* small */}
      <a href={jumpLink} target="_blank" rel="noopener noreferrer">
        <BannerCardSmall>
          <GnosisLogoBackground />
          <BannerTitle>{BANNER_TITLE}</BannerTitle>
          <BannerDescription>{BANNER_DESCRIPTION}</BannerDescription>
          <BannerHighlight
            variant="green"
            featureIcon={<GnosisIcon size="small" />}
            arrowIcon={<ArrowIcon />}
          >
            Bridge to Gnosis
          </BannerHighlight>
        </BannerCardSmall>
      </a>
    </BannerContainer>
  );
}

function GnosisLogoBackground() {
  return (
    <Image
      src="/gnosis-logo-bg.png"
      alt="Gnosis logo"
      className="absolute top-0 left-0 w-auto h-auto duration-300 group-hover:opacity-100 opacity-0 transition-all z-0"
      width="222"
      height="191"
    />
  );
}
