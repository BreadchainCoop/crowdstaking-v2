import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { useWatchAsset } from "@/app/core/hooks/useWatchAsset";
import clsx from "clsx";

export function AddTokenButton({ className }: { className?: string }) {
  const { watchAsset } = useWatchAsset();

  return (
    <button
      className={clsx(
        "flex w-full whitespace-nowrap rounded-full mt-2 px-3 py-2 dark:bg-breadgray-toast bg-breadgray-white border border-breadgray-white dark:hover:bg-breadgray-burnt dark:border-none dark:hover:border-none hover:border-breadpink-pink text-base",
        className
      )}
      onClick={watchAsset}
    >
      <div className="flex gap-2 m-auto items-center">
        <BreadIcon />
        <span className="text-center">Add token to wallet</span>
      </div>
    </button>
  );
}
