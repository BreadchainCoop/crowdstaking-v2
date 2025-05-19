import Button from "@/app/core/components/Button/Button";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { ReactNode } from "react";
import { CURVE_SWAP_URL } from "@/constants";

export default function SwapBreadButton({
  withRecommended,
}: {
  withRecommended: boolean;
}) {
  return (
    <ExternalLink href={CURVE_SWAP_URL}>
      {withRecommended && (
        <div
          id="text"
          className="flex transition-all duration-200 ease-in-out w-40 group-hover:w-full items-center justify-center bg-breadpink-500  bg-opacity-10 mb-[-19px] pb-5 pt-1 border border-breadpink-pink rounded-xl px-6"
        >
          <GradientText>Recommended</GradientText>
        </div>
      )}
      <Button fullWidth={true} size="xl" onClick={() => {}}>
        <div className="flex justify-center items-center dark:text-breadgray-grey200">
          Swap BREAD for WXDAI{" "}
          <span className="flex ms-auto hover:text-breadgray-ultra-white dark:hover:text-breadgray-grey200 md:ms-3 scale-150">
            <LinkIcon />
          </span>
        </div>
      </Button>
    </ExternalLink>
  );
}

function GradientText({ children }: { children: ReactNode }) {
  return (
    <div className="font-semibold text-base bread-pink-text-gradient">
      {children}
    </div>
  );
}
