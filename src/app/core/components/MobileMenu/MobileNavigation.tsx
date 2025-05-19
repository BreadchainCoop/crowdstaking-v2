import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";

import { useConnectedUser } from "../../hooks/useConnectedUser";

interface IProps {
  handleNavToggle: () => void;
}

export function MobileNavigation({ handleNavToggle }: IProps) {
  const pathname = usePathname();
  const user = useConnectedUser();
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
      {user.user.features.lpVaults && (
        <>
          <Link
            href="/governance"
            onClick={() => handleNavToggle()}
            className="text-neutral-900 dark:text-breadgray-rye dark:hover:text-breadgray-light-grey flex gap-2 items-center justify-end px-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
            >
              <g opacity="0.5">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19 4H21V6H19V4ZM17 8V6H19V8H17ZM15 8H17V10H15V8ZM15 8H13V6H15V8ZM3 6H11V8H3V6ZM11 16H3V18H11V16ZM18 18V16H20V14H18V16H16V14H14V16H16V18H14V20H16V18H18ZM18 18V20H20V18H18Z"
                />
              </g>
            </svg>
            <span>Vote</span>
          </Link>
          <Link
            href="/governance/lp-vaults"
            onClick={() => handleNavToggle()}
            className="text-neutral-900 dark:text-breadgray-rye dark:hover:text-breadgray-light-grey flex gap-2 items-center justify-end px-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
            >
              <g opacity="0.5">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 5H20V6H21V7H22V17H21H20V18V19H17V18H12H7V19H6H5H4V18V17H3H2V7H3V6H4V5ZM20 12H14V13H13V14H12H11V13H10V12H4V13V14V15V16H7H8H9H10H11H12H13H20V12ZM20 10V7H13V10H12H11V7H4V8V9V10H11V11V12H12H13V11V10H20Z"
                />
              </g>
            </svg>

            <span>Vaults</span>
          </Link>{" "}
          <Link
            href="/governance/boosters"
            onClick={() => handleNavToggle()}
            className="text-neutral-900 dark:text-breadgray-rye dark:hover:text-breadgray-light-grey flex gap-2 items-center justify-end px-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
            >
              <g opacity="0.5">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14 6H20H22V8V14H20V10H18V8H14V6ZM16 12V10H18V12H16ZM14 14V12H16V14H14ZM12 14H14V16H12V14ZM10 12H12V14H10V12ZM8 12V10H10V12H8ZM6 14V12H8V14H6ZM4 16V14H6V16H4ZM4 16V18H2V16H4Z"
                />
              </g>
            </svg>

            <span>Boosters</span>
          </Link>
        </>
      )}
      <MobileNavigationLink
        isExternal
        href="https://dune.com/breadchain_cooperative/breadchain"
        onClick={handleNavToggle}
      >
        Analytics <span className="ml-2"></span><LinkIcon />
      </MobileNavigationLink>
      <MobileNavigationLink
        isExternal
        href="https://breadchain.notion.site/4d496b311b984bd9841ef9c192b9c1c7?v=2eb1762e6b83440f8b0556c9917f86ca"
        onClick={handleNavToggle}
      >
        Docs <span className="ml-2"></span><LinkIcon />
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
