import clsx from "clsx";
import { useId } from "react";
export function FistIcon({
  size = "regular",
  bg = "rye",
}: {
  size?: "small" | "regular";
  bg?: "burnt" | "rye";
}) {
  const gradientId = useId();
  return (
    <div
      className={clsx(
        "rounded-full bg-breadpink-200 bg-opacity-10 flex items-center justify-center",
        size === "small" ? "size-5" : "size-6",
        "dark:bg-breadgray-" + bg
      )}
    >
      <svg
        width={size === "small" ? "16" : "20"}
        height={size === "small" ? "16" : "20"}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.99951 3H6.99854V5V7V9H7.99951V9.00002H9.99951V7.00002H8.99854V7V6.99997H9.99951V5V4.99997V3H8.99854H7.99951ZM2.99951 4.99997H3.99805H4.99951H5.99805V6.99997H4.99951H3.99805H2.99951V4.99997ZM5.99805 7.00002H4.99951H3.99854V7H1.99854V9H2.99951V9.00002H3.99805H4.99951H5.99805V7.00002ZM4.99902 9.99997H2.99951V12H4.99902V12H3.99805V14H5.99756V15V15V16V16V17V18H7.99756V17V16V16V15V15V14H7.99951V15V16V16V17V18H9.99902H9.99951H10.9976H11.999H12.9976V17V16V15H13.9985V14H14.9995V13H15.998V11H13.9985V11H14.999H14.9995H16.999V9.00002V8.99998V7.00002H14.9995H14.999H12.9995V8.99998V9.00002V10H11.9985V11H10.9976V12H9.99902V14H8.99854V12V12H9.99951V9.99997H7.99951V10H6.99902V9.99997H4.99951H4.99902ZM1.99854 10H2.99854V11H1.99854V10ZM12.9976 12V13H12.9995V12H13.998V12H12.9976ZM10.9976 7.00002H12.9976V9.00002H10.9976V7.00002ZM10.9976 3H11.9985H12.9976H13.9985V4V5V6H11.9985V5.99998H10.9976V5V3.99998V3Z"
          fill={`url(#${gradientId})`}
        />
        <defs>
          <linearGradient
            id={gradientId}
            x1="4.0611"
            y1="14.8125"
            x2="14.7487"
            y2="5.81218"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D04EC5" />
            <stop offset="1" stopColor="#ED7BC7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
