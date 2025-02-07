import { lpTokenMeta } from "@/app/lpTokenMeta";
import {
  BannerCardSmall,
  BannerTitle,
  BannerContainer,
  BannerDescription,
  BannerHighlight,
  BannerCardLarge,
  ArrowIcon,
  BannerLargeTextContainer,
} from "./Shared";
import { useId } from "react";

const LIQUIDITY_TITLE = "Provide liquidity and earn";
const LIQUIDITY_DESCRIPTION = (
  <>
    Deposit BREAD/WXDAI on{" "}
    <img
      className="inline"
      src="/curve-logo.png"
      width={20}
      height={20}
      alt="curve finance logo"
    />{" "}
    <span className="font-bold">Curve</span>
  </>
);

export function LiquidityBanner() {
  return (
    <BannerContainer>
      {/* large */}
      <a
        href={
          lpTokenMeta["0xf3d8f3de71657d342db60dd714c8a2ae37eac6b4"].visitPool
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <BannerCardLarge>
          <div className="w-[3rem] p-[0.4rem] rounded-full bg-[#F5DDF1] text-breadgray-ultra-white dark:bg-breadgray-toast shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]">
            <LiquidBreadIcon />
          </div>
          <BannerLargeTextContainer>
            <BannerTitle>{LIQUIDITY_TITLE}</BannerTitle>
            <BannerDescription>
              Deposit BREAD/WXDAI on{" "}
              <img
                className="inline"
                src="/curve-logo.png"
                width={20}
                height={20}
                alt="curve finance logo"
              />{" "}
              <span className="font-bold text-breadgray-rye dark:text-breadgray-grey">
                Curve
              </span>
            </BannerDescription>
          </BannerLargeTextContainer>
          <div className="w-[5%] flex justify-center items-center group-hover:text-breadviolet-shaded group-hover:dark:text-breadpink-300 text-breadgray-rye dark:text-breadgray-grey group-hover:translate-x-3 transition-all">
            <ArrowIcon />
          </div>
        </BannerCardLarge>
      </a>
      {/* small */}
      <a
        href={
          lpTokenMeta["0xf3d8f3de71657d342db60dd714c8a2ae37eac6b4"].visitPool
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <BannerCardSmall>
          <BannerTitle>{LIQUIDITY_TITLE}</BannerTitle>
          <BannerDescription>{LIQUIDITY_DESCRIPTION}</BannerDescription>
          <BannerHighlight
            variant="pink"
            featureIcon={
              <div className="size-6 p-[0.2rem] rounded-full text-breadgray-light-grey dark:text-white bg-breadgray-ultra-white dark:bg-breadgray-toast shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]">
                <LiquidBreadIcon />
              </div>
            }
            arrowIcon={
              <div className="text-breadgray-ultra-white dark:text-breadgray-pitchblack">
                <ArrowIcon />
              </div>
            }
          >
            Provide liquidity
          </BannerHighlight>
        </BannerCardSmall>
      </a>
    </BannerContainer>
  );
}

export function LiquidBreadIcon() {
  const iconId = useId();

  return (
    <svg
      className="size-full transform translate-y-[2px]"
      viewBox="0 0 36 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id={`path-1-outside-1_2_128_${iconId}`}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="34"
        fill="black"
      >
        <rect fill="white" width="36" height="34" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.56522 2C4.49163 2 2 4.49163 2 7.56522C2 10.451 4.19646 12.8238 7.00879 13.103V25.6521C7.00879 29.4941 10.1233 32.6087 13.9653 32.6087H21.7564C25.5984 32.6087 28.7129 29.4941 28.7129 25.6521V13.1236C31.6573 12.9787 34 10.5455 34 7.56522C34 4.49163 31.5084 2 28.4348 2L7.56522 2Z"
        />
      </mask>
      <path
        d="M7.00879 13.103H8.34212V11.8954L7.1405 11.7762L7.00879 13.103ZM28.7129 13.1236L28.6474 11.7919L27.3796 11.8543V13.1236H28.7129ZM3.33333 7.56522C3.33333 5.22801 5.22801 3.33333 7.56522 3.33333V0.666667C3.75525 0.666667 0.666667 3.75525 0.666667 7.56522H3.33333ZM7.1405 11.7762C5.00338 11.564 3.33333 9.75882 3.33333 7.56522H0.666667C0.666667 11.1432 3.38954 14.0836 6.87708 14.4298L7.1405 11.7762ZM8.34212 25.6521V13.103H5.67546V25.6521H8.34212ZM13.9653 31.2753C10.8597 31.2753 8.34212 28.7577 8.34212 25.6521H5.67546C5.67546 30.2305 9.38695 33.942 13.9653 33.942V31.2753ZM21.7564 31.2753H13.9653V33.942H21.7564V31.2753ZM27.3796 25.6521C27.3796 28.7577 24.862 31.2753 21.7564 31.2753V33.942C26.3348 33.942 30.0463 30.2305 30.0463 25.6521H27.3796ZM27.3796 13.1236V25.6521H30.0463V13.1236H27.3796ZM32.6667 7.56522C32.6667 9.83111 30.8852 11.6817 28.6474 11.7919L28.7785 14.4553C32.4294 14.2756 35.3333 11.26 35.3333 7.56522L32.6667 7.56522ZM28.4348 3.33333C30.772 3.33333 32.6667 5.22801 32.6667 7.56522L35.3333 7.56522C35.3333 3.75525 32.2447 0.666667 28.4348 0.666667V3.33333ZM7.56522 3.33333L28.4348 3.33333V0.666667L7.56522 0.666667V3.33333Z"
        className="fill-current"
        mask={`url(#path-1-outside-1_2_128_${iconId})`}
      />
      <mask
        id={`mask0_2_128_${iconId}`}
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="2"
        y="2"
        width="32"
        height="31"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.56522 2C4.49163 2 2 4.49163 2 7.56522C2 10.451 4.19646 12.8238 7.00879 13.103V25.6521C7.00879 29.4941 10.1233 32.6087 13.9653 32.6087H21.7564C25.5984 32.6087 28.7129 29.4941 28.7129 25.6521V13.1236C31.6573 12.9787 34 10.5455 34 7.56522C34 4.49163 31.5084 2 28.4348 2L7.56522 2Z"
          fill={`url(#paint0_linear_2_128_${iconId})`}
        />
      </mask>
      <g mask={`url(#mask0_2_128_${iconId})`}>
        <path
          className="transition-transform duration-1000 group-hover:-translate-y-[96%] group-hover:translate-x-[80%]"
          d="M-100.116 26.0136C-107.856 26.0136 -112.667 32.2972 -112.667 32.2972V66.0002H39.3333V32.2972C39.3333 32.2972 34.5123 26.1787 26.7829 26.0136C18.698 25.841 20.8857 32.6581 12.8379 32.2972C5.47472 31.9671 9.07708 26.1863 1.68193 26.0136C-6.04552 25.8332 -3.13902 32.1322 -10.8685 32.2972C-18.9534 32.4699 -16.7177 26.0136 -24.8135 26.0136C-32.9093 26.0136 -30.7107 32.6581 -38.7584 32.2972C-46.1216 31.9671 -42.5512 26.3438 -49.9144 26.0136C-57.9622 25.6528 -55.8116 32.6581 -63.8593 32.2972C-71.2225 31.9671 -67.6202 26.1863 -75.0153 26.0136C-82.7428 25.8332 -79.8258 32.2972 -87.5658 32.2972C-95.3058 32.2972 -92.3762 26.0136 -100.116 26.0136Z"
          fill="#A416AD"
        />
        <path
          className="transition-transform duration-1000 group-hover:-translate-y-[96%] group-hover:-translate-x-[80%]"
          d="M14.5505 26.0136C6.81046 26.0136 2 32.2972 2 32.2972V66.0002H154V32.2972C154 32.2972 149.179 26.1787 141.45 26.0136C133.365 25.841 135.552 32.6581 127.505 32.2972C120.141 31.9671 123.744 26.1863 116.349 26.0136C108.621 25.8332 111.528 32.1322 103.798 32.2972C95.7133 32.4699 97.949 26.0136 89.8532 26.0136C81.7574 26.0136 83.956 32.6581 75.9083 32.2972C68.5451 31.9671 72.1155 26.3438 64.7523 26.0136C56.7045 25.6528 58.8551 32.6581 50.8073 32.2972C43.4442 31.9671 47.0465 26.1863 39.6514 26.0136C31.9239 25.8332 34.8409 32.2972 27.1009 32.2972C19.3609 32.2972 22.2905 26.0136 14.5505 26.0136Z"
          fill={`url(#paint1_linear_2_128_${iconId})`}
        />
      </g>
      <defs>
        <linearGradient
          id={`paint0_linear_2_128_${iconId}`}
          x1="6.4"
          y1="26.1041"
          x2="28.353"
          y2="6.77695"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D04EC5" />
          <stop offset="1" stop-color="#ED7BC7" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_2_128_${iconId}`}
          x1="2"
          y1="46.0002"
          x2="126.739"
          y2="-23.4653"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FC6BAA" />
          <stop offset="0.545065" stop-color="#D158D7" />
          <stop offset="1" stop-color="#AF2CEC" />
        </linearGradient>
      </defs>
    </svg>
  );
}
