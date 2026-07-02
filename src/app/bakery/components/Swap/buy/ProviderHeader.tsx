import { Body } from "@breadcoop/ui";

export function ProviderHeader({ logoSrc, name }: { logoSrc: string; name: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <img src={logoSrc} alt={name} className="h-10 w-10" />
      <Body className="text-base font-bold text-surface-ink">Buy with {name}</Body>
    </div>
  );
}
