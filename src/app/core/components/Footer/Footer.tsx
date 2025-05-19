import Image from "next/image";

import type { ReactNode } from "react";
import { LogoSVG } from "../Icons/Logo";
import clsx from "clsx";
import { MirrorIcon } from "../Icons/social";
import DiscordIcon from "../Icons/social/DiscordIcon";
import GithubIcon from "../Icons/social/GithubIcon";
import { LinkIcon } from "../Icons/LinkIcon";

export function Footer() {
  const renderLink = (href: string, children: ReactNode) => {
    return (
      <span className="flex items-center">
        <a
          className="flex items-center hover:text-breadpink-shaded transition-colors duration-300"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
        <span className="text-breadpink-shaded">
          <LinkIcon />
        </span>
      </span>
    );
  };

  return (
    <footer className="border-t-[0.16rem] border-breadviolet-shaded">
      <div className="w-full flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between items-center pt-6 pb-8 px-8">
        {/* branding */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center justify-center lg:justify-start">
            <span className="w-6 h-6">
              <LogoSVG />
            </span>
            <span className="text-xl font-bold">Breadchain</span>
          </div>
          <span className="text-breadgray-grey100 dark:text-breadgray-grey">
            Funding post-capitalism
          </span>
        </div>
        {/* navigation */}
        <div className="flex flex-col -mb-6">
          <nav className="flex flex-col gap-6 lg:flex-row items-center">
            <div className="flex items-center justify-center gap-6 lg:gap-4 w-full lg:w-auto">
              <FooterLink
                href="https://twitter.com/breadchain_"
                className="text-breadgray-grey100 dark:text-breadgray-ultra-white"
              >
                <svg
                  className="w-full h-full p-0.5 fill-current"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.7512 0H18.818L12.1179 8.47179L20 20H13.8284L8.99458 13.0082L3.46359 20H0.394938L7.5613 10.9385L0 0H6.32828L10.6976 6.39077L15.7512 0ZM14.6748 17.9692H16.3742L5.4049 1.9241H3.58133L14.6748 17.9692Z" />
                </svg>
              </FooterLink>
              <FooterLink href="https://breadchain.mirror.xyz/">
                <MirrorIcon />
              </FooterLink>
              <FooterLink
                href="https://cryptoleftists.xyz"
                className="text-breadgray-grey100 dark:text-breadgray-ultra-white"
              >
                <DiscordIcon />
              </FooterLink>
              <FooterLink
                href="https://github.com/BreadchainCoop"
                className="text-breadgray-grey100 dark:text-breadgray-ultra-white"
              >
                <GithubIcon />
              </FooterLink>
              <FooterLink
                href="https://guild.xyz/breadchain"
                className="text-breadgray-grey100 dark:text-breadgray-ultra-white"
              >
                <Image
                  className="guild-logo"
                  src="/guild_logo.png"
                  alt="Guild Logo"
                  width={38}
                  height={36.42}
                />

                <Image
                  className="guild-logo-dark"
                  src="/guild_logo_dark.png"
                  alt="Guild Logo"
                  width={38}
                  height={36.42}
                />
              </FooterLink>
            </div>
          </nav>
          <div className="text-breadgray-grey100 dark:text-breadgray-grey text-center text-xs pb-4 mt-3">
            Creative Common {new Date().getFullYear()}
          </div>
        </div>
        {/* copyright */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex flex-row gap-4 md:justify-end">
            {renderLink(
              "https://breadchain.mailchimpsites.com/",
              <span className="pr-2">Join our newsletter</span>
            )}
            {renderLink(
              "https://dune.com/breadchain_cooperative/breadchain",
              <span className="pr-2">Analytics</span>
            )}
          </div>
          <div className="flex flex-row gap-4 md:justify-end">
            {renderLink(
              "https://giveth.io/project/breadchain-cooperative",
              <span className="pr-2">Donate in crypto</span>
            )}
            {renderLink(
              "https://opencollective.com/breadchain-cooperative",
              <span className="pr-2">Donate in fiat</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={clsx("w-6 h-6", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
