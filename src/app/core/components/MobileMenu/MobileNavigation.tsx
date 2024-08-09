import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface IProps {
  handleNavToggle: () => void;
}

export function MobileNavigation({ handleNavToggle }: IProps) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-4 justify-end">
      <MobileNavigationLink
        isCurrentPage={pathname === "/"}
        href="/"
        onClick={() => handleNavToggle()}
      >
        Bake
      </MobileNavigationLink>
      <MobileNavigationLink
        isCurrentPage={pathname === "/governance"}
        href="/governance"
        onClick={() => handleNavToggle()}
      >
        Governance
      </MobileNavigationLink>
      <MobileNavigationLink
        isExternal
        href="https://breadchain.notion.site/4d496b311b984bd9841ef9c192b9c1c7?v=2eb1762e6b83440f8b0556c9917f86ca"
        onClick={handleNavToggle}
      >
        Docs
      </MobileNavigationLink>
    </nav>
  );
}
export function MobileNavigationLink(props: {
  children: ReactNode;
  href: string;
  onClick: () => void;
  isCurrentPage?: boolean;
  isExternal?: boolean;
}) {
  const { href, children, isCurrentPage, isExternal, onClick } = props;

  const classList = clsx(
    "font-redhat text-breadgray-grey100 hover:text-breadgray-grey100 dark:hover:text-breadgray-ultra-white active:text-breadgray-violet flex items-center justify-end p-2 text-xl font-bold leading-none tracking-wider min-[810px]:px-4",
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
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classList}>
      {children}
    </Link>
  );
}
