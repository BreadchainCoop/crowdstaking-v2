"use client";

import { Body } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { useQuery } from "@tanstack/react-query";

export const Apy = () => {
  // Fetch data

  return (
    <Chip className="max-w-max">
      <ChartLine />
      <Body bold>5.4% APY</Body>
    </Chip>
  );
};

function ChartLine() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 19.5H3V4.5"
        stroke="#EA5817"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 9L15 14.25L9 9.75L3 15"
        stroke="#EA5817"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
