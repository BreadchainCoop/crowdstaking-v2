import { Body } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";

interface HowDoesThisWorkButtonProps {
  href: string;
}

export function HowDoesThisWorkButton({ href }: HowDoesThisWorkButtonProps) {
  return (
    <a
      className="flex items-center gap-2 bg-paper-main pt-1 px-4 border border-primary-orange"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Body bold>
        How does this work?{" "}
        <ArrowUpRightIcon
          size={20}
          className="inline mb-1 text-primary-orange"
        />
      </Body>
    </a>
  );
}
