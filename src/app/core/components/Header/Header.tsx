import clsx from "clsx";
import { type ReactNode, useState } from "react";

import MobileMenu from "../MobileMenu/MobileMenu";
import DesktopNavigation from "./DesktopNavigation";
import Logo from "./Logo";
import MobileNavigationToggle from "./MobileNavigationToggle";
import { WRAPPER_CLASSES } from "@/app/core/util/classes";
import { usePathname } from "next/navigation";
import { AccountMenu } from "./AccountMenu";
import { ColorToggle } from "./ColorToggle";

function Container({ children }: { children: ReactNode }) {
  return (
    <header>
      <div
        className={clsx(WRAPPER_CLASSES, "p-4 md:py-6 flex justify-between")}
      >
        {children}
      </div>
    </header>
  );
}

function Header() {
  const currentPath = usePathname();
  const [isMobNavOpen, setIsMobNavOpen] = useState(false);

  const handleNavToggle = () => {
    document.body.style.overflow = isMobNavOpen ? "auto" : "hidden";
    setIsMobNavOpen(!isMobNavOpen);
  };

  return (
    <Container>
      <Logo />
      <DesktopNavigation currentPath={currentPath} />
      <div className="hidden md:flex gap-4">
        <ColorToggle />
        <AccountMenu variant="regular" fullWidth={false} />
      </div>
      <MobileNavigationToggle
        isOpen={isMobNavOpen}
        handleClick={handleNavToggle}
      />
      <MobileMenu isOpen={isMobNavOpen} handleNavToggle={handleNavToggle} />
    </Container>
  );
}

export default Header;
