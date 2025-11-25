import { ArrowUpRightIcon } from "@phosphor-icons/react";

export function ExplorerLink({ to }: { to: string }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferer"
      href={to}
      className="flex items-center justify-center gap-1 text-breadpink-shaded"
    >
      <span className="font-medium">View on Explorer</span>
      <ArrowUpRightIcon color="var(--color-primary-orange)" />
    </a>
  );
}
