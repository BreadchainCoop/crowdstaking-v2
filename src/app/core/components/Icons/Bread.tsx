import { useId } from "react";

export function BreadSVG({ size = "regular" }: { size?: "small" | "regular" }) {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      className={size === "small" ? "w-4 h-4" : ""}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.1087 3.625C3.66795 3.625 2.5 4.79295 2.5 6.2337C2.5 7.58604 3.52903 8.69805 4.8468 8.82941V14.7119C4.8468 16.5128 6.30674 17.9727 8.10767 17.9727H11.7598C13.5607 17.9727 15.0206 16.5128 15.0206 14.7119V8.83924C16.4013 8.77184 17.5 7.63108 17.5 6.2337C17.5 4.79295 16.332 3.625 14.8913 3.625H5.1087Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="4.5625"
          y1="14.9238"
          x2="14.8529"
          y2="5.8642"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D04EC5" />
          <stop offset="1" stopColor="#ED7BC7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
