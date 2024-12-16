import { useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Hex } from "viem";
import { blo } from "blo";

import { truncateAddress } from "@/app/core/util/formatter";
import Button from "../Button";
import { useEnsName } from "@/app/core/hooks/useEnsName";
import { useWatchAsset } from "../../hooks/useWatchAsset";

function MobileWalletDisplay({
  handleNavToggle,
}: {
  handleNavToggle: () => void;
}) {
  const { disconnectAsync } = useDisconnect();
  const { watchAsset } = useWatchAsset();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            className="flex justify-end"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} size="small">
                    Connect
                  </Button>
                );
              }

              return (
                <div className="flex flex-col gap-6">
                  <AccountPanel accountAddress={account.address} />
                  <ChainPanel
                    handleNavToggle={handleNavToggle}
                    openChainModal={openChainModal}
                    chain={chain}
                  />
                  <MobileWalletDisconnectButton
                    handleDisconnect={() => disconnectAsync()}
                  />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

function AccountPanel({ accountAddress }: { accountAddress: string }) {
  const ensNameState = useEnsName(accountAddress);
  return (
    <div className="flex flex-col gap-2">
      <div className="text-right text-xs font-light">Account</div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(accountAddress).catch((err): void => {
            console.error(err);
          });
        }}
        title="copy address"
        className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300 text-base font-bold tracking-wider flex gap-2 items-center justify-end active:underline"
      >
        <div className="rounded-full overflow-clip">
          <Image
            src={blo(accountAddress as Hex)}
            alt="ens avatar"
            width="24"
            height="24"
            className="transform scale-110"
          />
        </div>
        {ensNameState.status === "LOADING" ? null : ensNameState.status ===
          "SUCCESS" ? (
          // either the name or the address
          ensNameState.ensName ? (
            <span>{ensNameState.ensName}</span>
          ) : (
            <span>{truncateAddress(accountAddress)}</span>
          )
        ) : (
          <span>{truncateAddress(accountAddress)}</span>
        )}
        <svg
          className="fill-current text-breadpink-shaded w-4 h-4"
          viewBox="0 0 16 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0H11V2H2V15H0V0ZM4 4H16V20H4V4ZM6 6V18H14V6H6Z"
          />
        </svg>
      </button>
    </div>
  );
}

function ChainPanel({
  handleNavToggle,
  openChainModal,
  chain,
}: {
  handleNavToggle: () => void;
  openChainModal: () => void;
  chain:
    | {
        hasIcon: boolean;
        iconUrl?: string | undefined;
        iconBackground?: string | undefined;
        id: number;
        name?: string | undefined;
        unsupported?: boolean | undefined;
      }
    | undefined;
}) {
  return chain ? (
    <section className="flex flex-col gap-4">
      <div className="text-right text-xs font-light text-green-900 dark:text-status-success">
        Connected
      </div>
      <button
        onClick={() => {
          handleNavToggle();
          openChainModal();
        }}
        className="flex gap-2 items-center justify-end stroke-breadgray-rye hover:stroke-breadgray-grey"
      >
        {chain.hasIcon ? (
          <div
            className="w-6 h-6 relative rounded-full overflow-hidden"
            style={{
              background: chain.iconBackground,
            }}
          >
            <div className="w-6 h-6 relative">
              {chain.iconUrl && (
                <Image
                  alt={chain.name ?? "Chain icon"}
                  src={chain.iconUrl}
                  layout="fill"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-none h-full w-full stroke-inherit"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        )}
        {chain?.name}
        <div className="h-full flex items-center stroke-inherit">
          <svg
            className="stroke-inherit"
            height="7"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              xmlns="http://www.w3.org/2000/svg"
            ></path>
          </svg>
        </div>
      </button>
    </section>
  ) : null;
}

function MobileWalletDisconnectButton({
  handleDisconnect,
}: {
  handleDisconnect: () => void;
}) {
  return (
    <button
      className="py-1.5 px-4 rounded-lg border border-status-danger text-status-danger hover:text-breadgray-charcoal hover:bg-status-danger font-bold tracking-wider flex items-center gap-4"
      onClick={handleDisconnect}
    >
      <svg
        className="w-3.5 h-3.5 -translate-y-[0.05rem]"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-current"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 0H16H18V2V4H16V2H2V16H16V14H18V16V18H16H2H0V16V2V0H2ZM18 8H16V6H14V4H12V6H14V8H4V10L14 10V12H12V14H14V12H16V10L18 10V8Z"
        />
      </svg>
      <span>Disconnect</span>
    </button>
  );
}

export default MobileWalletDisplay;
