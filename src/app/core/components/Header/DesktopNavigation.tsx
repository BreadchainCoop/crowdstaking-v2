import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { useConnectedUser } from "../../hooks/useConnectedUser";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { LiftedButton } from "@breadcoop/ui";
import { SignIn } from "@phosphor-icons/react";

export function DesktopNavigationLink(props: {
  children: ReactNode;
  href: string;
  isCurrentPage?: boolean;
  isExternal?: boolean;
}) {
  const { children, href, isCurrentPage, isExternal } = props;

  const classList = clsx(
    "font-redhat text-text-standard hover:text-breadgray-grey100 dark:hover:text-breadgray-ultra-white active:text-breadgray-violet flex items-center px-3 py-2 text-xl font-normal leading-none tracking-wider",
    isCurrentPage
      ? "text-text-standard dark:text-breadgray-ultra-white"
      : "text-breadgray-rye"
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classList}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classList}>
      {children}
    </Link>
  );
}

function DesktopNavigation({ currentPath }: { currentPath: string }) {
  const {
    user: { features },
  } = useConnectedUser();
  return (
    <nav
      aria-label="site navigation"
      // className="hidden flex-grow items-center gap-2 pl-6 md:ml-auto md:flex lg:gap-0 lg:pl-12"
      className="hidden md:flex md:flex-grow md:items-center md:gap-2 md:ml-auto md:max-w-max"
    >
      <DesktopNavigationLink isCurrentPage={currentPath === "/"} href="/">
        Bake
      </DesktopNavigationLink>
      {features.governancePage === true && (
        <DesktopNavigationLink
          isCurrentPage={currentPath.includes("/governance")}
          href="/governance"
        >
          Governance
        </DesktopNavigationLink>
      )}
      <LiftedButton className="h-14 mt-0.5" rightIcon={<SignIn />}>Sign in</LiftedButton>
      {/* <DesktopNavigationLink
        href="https://dune.com/bread_cooperative/solidarity"
        isExternal
      >
        Analytics <span className="ml-2"></span>
        <LinkIcon />
      </DesktopNavigationLink>
      <DesktopNavigationLink href="https://docs.bread.coop" isExternal>
        Docs <span className="ml-2"></span><LinkIcon />
      </DesktopNavigationLink> */}
    </nav>
  );
}

export default DesktopNavigation;
