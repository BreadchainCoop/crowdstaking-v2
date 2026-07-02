import clsx from "clsx";
import { Body } from "@breadcoop/ui";
import { TBuyProvider } from "./interfaces";

export function ProviderPicker({
  provider,
  setProvider,
}: {
  provider: TBuyProvider;
  setProvider: (provider: TBuyProvider) => void;
}) {
  return (
    <fieldset className="grid gap-4 grid-cols-2 mb-4">
      <legend className="sr-only">Choose a payment provider</legend>
      <ProviderOption
        name="Peer"
        logoSrc="https://www.peer.xyz/logo192.png"
        isSelected={provider === "PEER"}
        onSelect={() => setProvider("PEER")}
      />
      <ProviderOption
        name="Mt Pelerin"
        logoSrc="https://www.mtpelerin.com/icons/android-chrome-192x192.png"
        isSelected={provider === "MT_PELERIN"}
        onSelect={() => setProvider("MT_PELERIN")}
      />
    </fieldset>
  );
}

function ProviderOption({
  name,
  logoSrc,
  isSelected,
  onSelect,
}: {
  name: string;
  logoSrc: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="grid">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={clsx(
          "font-bold py-3 px-6 flex items-center justify-center cursor-pointer transition-colors border",
          isSelected
            ? "border-primary-orange text-primary-orange bg-primary-orange/10"
            : "border-transparent text-surface-grey bg-paper-main bg-opacity-30"
        )}
      >
        <Body className="flex gap-2.5 items-center justify-center">
          <img src={logoSrc} alt="" className="size-6" />
          {name}
        </Body>
      </button>
    </div>
  );
}
