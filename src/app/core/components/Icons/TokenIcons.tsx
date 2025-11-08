import Image from "next/image";
import { BreadSVG } from "./Bread";
import clsx from "clsx";
import { Body } from "@breadcoop/ui";

// export function XDAIIcon() {
//   return (
//     <div className="rounded-full overflow-hidden w-6 h-6">
//       <Image src={"/xdai_icon.png"} alt="xdai icon" width="30" height="30" />
//     </div>
//   );
// }

interface IXDAIIcon {
	withLabel?: boolean;
	boldLabel?: boolean;
	labelClassName?: string;
}

export function XDAIIcon({ withLabel, boldLabel, labelClassName }: IXDAIIcon) {
	return (
		<div className="inline-flex items-center justify-start">
			<div className="bg-white rounded-xs overflow-hidden w-6 h-6">
				<Image
					src={"/xdai_icon.png"}
					alt="xdai icon"
					width="30"
					height="30"
				/>
			</div>
			{withLabel && (
				<span
					className={clsx(
						"ml-2",
						boldLabel ? "font-bold" : "",
						labelClassName
					)}
				>
					xDAI
				</span>
			)}
		</div>
	);
}

export function WXDAIIcon({ size = "regular" }: { size?: "regular" | "full" }) {
  return (
    <div
      className={clsx(
        "rounded-full overflow-hidden",
        size === "full" && "size-full",
        size === "regular" && "w-6 h-6"
      )}
    >
      <Image src={"/wxdai_icon.png"} alt="wxdai icon" width="30" height="30" />
    </div>
  );
}

export function GnosisIcon({
  size = "regular",
}: {
  size?: "small" | "regular";
}) {
  return (
    <div className={clsx("rounded-full overflow-hidden")}>
      <Image
        src={"/gnosis_icon.svg"}
        alt="Gnosis icon"
        className={size === "small" ? "size-6" : "size-10"}
        width="30"
        height="30"
      />
    </div>
  );
}

export function BreadIcon({
  size = "regular",
  bg = "rye",
}: {
  size?: "small" | "regular";
  bg?: "burnt" | "rye";
}) {
  return (
    <div
      className={clsx(
        "rounded-full bg-breadpink-200 bg-opacity-10 flex items-center justify-center",
        size === "small" ? "size-5" : "size-6",
        "dark:bg-breadgray-" + bg
      )}
    >
      <div>
        <BreadSVG size={size} />
      </div>
    </div>
  );
}
