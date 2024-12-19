import { ReactNode } from "react";

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="hover:text-breadviolet-shaded hover:dark:text-breadpink-shaded"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
