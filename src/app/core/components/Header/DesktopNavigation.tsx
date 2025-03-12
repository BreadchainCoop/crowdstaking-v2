import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { useConnectedUser } from "../../hooks/useConnectedUser";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";

export function DesktopNavigationLink(props: {
  children: ReactNode;
  href: string;
  isCurrentPage?: boolean;
  isExternal?: boolean;
}) {
  const { children, href, isCurrentPage, isExternal } = props;

  const classList = clsx(
    "font-redhat text-breadgray-grey100 hover:text-breadgray-grey100 dark:hover:text-breadgray-ultra-white active:text-breadgray-violet flex items-center px-3 py-2 text-xl font-bold leading-none tracking-wider",
    isCurrentPage
      ? "text-breadgray-grey100 dark:text-breadgray-ultra-white"
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
      className="hidden flex-grow items-center gap-2 pl-6 md:flex lg:gap-0 lg:pl-12"
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
      <DesktopNavigationLink
        href="https://dune.com/breadchain_cooperative/breadchain"
        isExternal
      >
        Analytics <span className="ml-2"></span><LinkIcon />
      </DesktopNavigationLink>
      <DesktopNavigationLink
        href="https://breadchain.notion.site/4d496b311b984bd9841ef9c192b9c1c7?v=2eb1762e6b83440f8b0556c9917f86ca"
        isExternal
      >
        Docs <span className="ml-2"></span><LinkIcon />
      </DesktopNavigationLink>
    </nav>
  );
}

export default DesktopNavigation;
