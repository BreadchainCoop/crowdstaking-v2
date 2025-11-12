import { type ReactNode } from "react";
import clsx from "clsx";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { GradientBorder } from "@/app/core/components/GradientBorder";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

const sharedClasses =
	// "px-1 pe-2 py-1 text-sm flex gap-2 rounded-full items-center bg-transparent border border-gray-400 text-gray-700 dark:text-gray-300 font-bold";
	"px-1 pe-2 py-1 text-sm flex gap-2 items-center bg-transparent border border-surface-ink font-bold";

export function Badge({
	children,
	icon,
}: {
	children: ReactNode;
	icon: ReactNode;
}) {
	return (
		<div className={sharedClasses}>
			{icon}
			{children}
		</div>
	);
}

export function LinkBadge({
	children,
	icon,
	href,
	className,
}: {
	children: ReactNode;
	icon: ReactNode;
	href: string;
	className?: string;
}) {
	return (
		<ExternalLink href={href}>
			<div
				className={clsx(
					sharedClasses,
					className
					// "hover:text-breadpink-500 hover:border-breadpink-500 dark:hover:text-breadpink-shaded dark:hover:border-breadpink-shaded cursor-pointer transition-all"
				)}
			>
				{icon}
				<span className="text-surface-ink font-bold">{children}</span>
				<span id="linkIcon" className="flex ms-auto md:ms-2">
					<ArrowUpRightIcon />
				</span>
			</div>
		</ExternalLink>
	);
}

export function GradientLinkBadge({
  children,
  icon,
  href,
}: {
  children: ReactNode;
  icon: ReactNode;
  href: string;
}) {
  return (
    <GradientBorder borderWidth={2}>
      <div className="hover:text-breadviolet-shaded dark:hover:text-breadpink-shaded cursor-pointer transition-all flex items-center gap-2 rounded-full py-[6px] px-3 bg-breadgray-ultra-white dark:bg-breadgray-charcoal">
        <ExternalLink href={href}>
          <div className="flex items-center gap-2">
            {icon}
            <span className="dark:text-white text-breadgray-grey100">
              {children}
            </span>
            <LinkIcon />
          </div>
        </ExternalLink>
      </div>
    </GradientBorder>
  );
}
