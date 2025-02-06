"use client";
import { ReactNode } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserVotingPowerProvider } from "./context/UserVotingPowerContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";

export default function GovernanceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useConnectedUser();

  return (
    <>
      {user.features.lpVaults && (
        <section className="hidden md:block w-full lg:max-w-[67rem] m-auto px-4 md:px-8">
          <GovernanceNavigation />
        </section>
      )}
      <UserVotingPowerProvider>
        <div className="py-4 md:py-8">{children}</div>
      </UserVotingPowerProvider>
    </>
  );
}

function GovernanceNavigation() {
  return (
    <div className="rounded-[15px] p-4 bg-breadgray-ultra-white dark:bg-breadgray-grey200 border-2 border-breadpink-300 border-opacity-30">
      <nav className="px-4 flex flex-row gap-4">
        <NavLink href="/governance">
          <div className="w-5 h-5">
            <svg
              className="w-full h-full fill-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 4H21V6H19V4ZM17 8V6H19V8H17ZM15 8H17V10H15V8ZM15 8H13V6H15V8ZM3 6H11V8H3V6ZM11 16H3V18H11V16ZM18 18V16H20V14H18V16H16V14H14V16H16V18H14V20H16V18H18ZM18 18V20H20V18H18Z"
              />
            </svg>
          </div>
          Vote
        </NavLink>

        <NavLink href="/governance/lp-vaults">
          <div className="w-5 h-5">
            <svg
              className="w-full h-full fill-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 5H20V6H21V7H22V17H21H20V18V19H17V18H12H7V19H6H5H4V18V17H3H2V7H3V6H4V5ZM20 12H14V13H13V14H12H11V13H10V12H4V13V14V15V16H7H8H9H10H11H12H13H20V12ZM20 10V7H13V10H12H11V7H4V8V9V10H11V11V12H12H13V11V10H20Z"
              />
            </svg>
          </div>
          LP Vaults
        </NavLink>
        <NavLink href="/governance/boosters">
          <div className="w-5 h-5">
            <svg
              className="w-full h-full fill-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14 6H20H22V8V14H20V10H18V8H14V6ZM16 12V10H18V12H16ZM14 14V12H16V14H14ZM12 14H14V16H12V14ZM10 12H12V14H10V12ZM8 12V10H10V12H8ZM6 14V12H8V14H6ZM4 16V14H6V16H4ZM4 16V18H2V16H4Z"
              />
            </svg>
          </div>
          Voting power boosters
        </NavLink>
      </nav>
    </div>
  );
}

function NavLink({
  children,
  ...props
}: {
  children: ReactNode;
  href: string;
}) {
  const currentPath = usePathname();

  return (
    <Link
      {...props}
      className={clsx(
        "flex flex-row items-center gap-2 dark:text-breadgray-ultra-white transition-all font-semibold",
        currentPath !== props.href && "opacity-50 hover:opacity-100"
      )}
    >
      {children}
    </Link>
  );
}
