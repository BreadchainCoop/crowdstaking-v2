"use client";
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
import { Body, LiftedButton, Typography } from "@breadcoop/ui";
import { Logo as UILogo } from "@breadcoop/ui";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";


function Container({ children }: { children: ReactNode }) {
  return (
    <header>
      <div
        className={clsx(
          WRAPPER_CLASSES,
          "p-4 md:py-6 flex justify-between items-center mb-4"
        )}
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
      <Link href="/">
        <UILogo className="md:hidden" />
        <span className="hidden md:block"><UILogo text="Bread" /></span>
      </Link>
      <Body className="hidden md:block md:mr-auto md:ml-3 md:mt-1 md:text-surface-grey-2">
        Solidarity fund
      </Body>
      <DesktopNavigation currentPath={currentPath} />
      <div className="ml-auto mr-4 md:hidden">
        <LiftedButton className="h-12" rightIcon={<ArrowUpRight />}>Visit app</LiftedButton>
      </div>
      <MobileNavigationToggle
        isOpen={isMobNavOpen}
        handleClick={handleNavToggle}
      />
      <MobileMenu isOpen={isMobNavOpen} handleNavToggle={handleNavToggle} />
    </Container>
  );

  return (
    <>
      <Container>
        <Logo />
        <div className="md:hidden font-pressstart uppercase text-xs">bread</div>
        <DesktopNavigation currentPath={currentPath} />
        <div className="hidden md:flex gap-4">
          <ColorToggle />
          <AccountMenu size="regular" fullWidth={false}>
            Connect
          </AccountMenu>
        </div>
        <MobileNavigationToggle
          isOpen={isMobNavOpen}
          handleClick={handleNavToggle}
        />
        <MobileMenu isOpen={isMobNavOpen} handleNavToggle={handleNavToggle} />
      </Container>

    </>
  );
}

export default Header;
