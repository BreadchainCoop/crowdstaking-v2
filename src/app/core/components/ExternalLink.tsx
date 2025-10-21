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
      className="text-primary-orange"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
