import { useState } from "react";
import { CopyIcon } from "@/app/core/components/Icons/CopyIcon";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { UserIcon } from "@/app/core/components/Icons/UserIcon";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { truncateAddress } from "@/app/core/util/formatter";
import { WalletIcon } from "@/app/core/components/Icons/WalletIcon";
import { useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { formatBalance } from "@/app/core/util/formatter";
import { HeartIcon } from "@/app/core/components/Icons/HeartIcon";
import { renderFormattedDecimalNumber } from "@/app/core/util/formatter";
import { formatUnits } from "viem";

interface MenuDetailsProps {
  address: string;
}

export function MenuDetails({ address }: MenuDetailsProps) {
  const [accountCopied, setAccountCopied] = useState(false);
  const { BREAD } = useTokenBalances();
  const { data: apyData, error: apyError, status: apyStatus } = useVaultAPY();
  const gnosisLink = "https://gnosisscan.io/address/";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 items-center gap-4 w-full">
        <div className="flex gap-2 text-base text-breadgray-rye dark:text-breadgray-grey">
          <span className="flex text-left text-breadpink-shaded">
            <UserIcon size={6} />
          </span>
          {accountCopied && (
            <span className="text-status-success">Copied!</span>
          )}
          {!accountCopied && truncateAddress(address)}
        </div>
        <div className="flex justify-end text-breadgray-grey items-center gap-4">
          <button
            className="hover:text-breadpink-shaded"
            onClick={() => {
              navigator.clipboard.writeText(address).catch((err): void => {
                console.error(err);
              });
              setAccountCopied(true);
              setTimeout(() => setAccountCopied(false), 2000);
            }}
            title="copy address"
          >
            <CopyIcon size={4} />
          </button>
          <ExternalLink href={gnosisLink + address}>
            <LinkIcon size={4} />
          </ExternalLink>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center gap-4 w-full">
        <div className="flex gap-2 text-base text-breadgray-rye dark:text-breadgray-grey">
          <span className="flex text-left text-breadpink-shaded">
            <WalletIcon size={6} />
          </span>
          BREAD Balance
        </div>
        <div className="flex justify-end gap-2 items-center">
          <BreadIcon />
          <span>
            {BREAD &&
              BREAD.status === "SUCCESS" &&
              BREAD.value &&
              renderFormattedDecimalNumber(
                formatBalance(parseFloat(BREAD.value), 2)
              )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center gap-4 w-full">
        <div className="flex gap-2 text-base text-breadgray-rye dark:text-breadgray-grey">
          <span className="flex text-left text-breadpink-shaded">
            <HeartIcon size={6} />
          </span>
          Donated Yield
        </div>
        <div className="flex justify-end ">
          <span className="flex items-center gap-2">
            <BreadIcon />
            {BREAD && BREAD.status === "SUCCESS" && BREAD.value && (
              <div className="bread-pink-text-gradient">
                <span>
                  {renderFormattedDecimalNumber(
                    formatBalance(
                      parseFloat(BREAD.value) *
                        Number(formatUnits(apyData as bigint, 18)),
                      2
                    )
                  )}
                </span>
              </div>
            )}
          </span>
          <span className="flex mt-[1px] text-breadgray-rye dark:text-breadgray-grey font-semibold items-center text-sm">
            /Yearly
          </span>
        </div>
      </div>
    </div>
  );
}
