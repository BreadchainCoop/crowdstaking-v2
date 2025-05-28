import { useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { AddTokenButton } from "@/app/core/components/Header/AddTokenButton";
import Button from "../Button";
import { MenuDetails } from "@/app/core/components/Header/MenuDetails";
import { WalletDisconnectButton } from "@/app/core/components/Header/WalletMenu/WalletDisconnectButton";

function MobileWalletDisplay({
  handleNavToggle,
}: {
  handleNavToggle: () => void;
}) {
  const { disconnectAsync } = useDisconnect();

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
                <div className="flex flex-col gap-6 p-2">
                  <div className="rounded-[15px] border border-breadgray-grey p-6">
                    <AccountPanel accountAddress={account.address} />
                    <ChainPanel
                      handleNavToggle={handleNavToggle}
                      openChainModal={openChainModal}
                      chain={chain}
                    />
                  </div>
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
  return (
    <div className="flex flex-col gap-2">
      <div className="text-base dark:text-breadgray-grey font-semibold">
        Account
      </div>
      <MenuDetails address={accountAddress} />
      <div className="text-base dark:text-breadgray-grey font-semibold py-2">
        Network
      </div>
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
      <div className="flex items-center">
        <button
          onClick={() => {
            handleNavToggle();
            openChainModal();
          }}
          className="flex gap-2 items-center stroke-breadgray-rye hover:stroke-breadgray-grey"
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
        <div className="text-sm font-semibold text-status-success ms-2">
          Connected
        </div>
      </div>
      <AddTokenButton />
    </section>
  ) : null;
}

function MobileWalletDisconnectButton({
  handleDisconnect,
}: {
  handleDisconnect: () => void;
}) {
  return <WalletDisconnectButton handleDisconnect={handleDisconnect} />;
}

export default MobileWalletDisplay;
