import clsx from "clsx";
import type { MouseEvent, ReactNode } from "react";

function Overlay({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean;
  closeMenu: () => void;
}) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    closeMenu();
  }

  return (
    <div
      className={clsx(
        "fixed top-0 bottom-0 left-0 right-0 z-40 h-screen w-screen bg-paper-main backdrop-blur-md transition-all md:hidden",
        isOpen
          ? "bg-opacity-80 dark:bg-opacity-70"
          : "bg-opacity-0 dark:bg-opacity-0 invisible"
      )}
      onClick={handleClick}
    />
  );
}

export default Overlay;
