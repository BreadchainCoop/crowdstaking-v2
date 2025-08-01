import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import React from "react";

export const DistributionCountdown = ({ end }: { end: Date }) => {
  const getTimeDisplay = () => {
    const now = new Date();
    const days = differenceInDays(end, now);

    if (days >= 1) return `${days} ${days === 1 ? "day" : "days"}`;

    const hours = differenceInHours(end, now);

    if (hours >= 1) return `${hours} ${hours === 1 ? "hour" : "hours"}`;

    const minutes = differenceInMinutes(end, now);

    if (minutes >= 1)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;

    return "0 days";
  };

  return (
    <p className="font-bold dark:text-breadgray-ultra-white">
      Distributing in {getTimeDisplay()}
    </p>
  );
};
