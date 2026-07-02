"use client";

import { useState } from "react";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { isAddress } from "viem";
import { ProviderPicker } from "./ProviderPicker";
import { PeerBuy } from "./PeerBuy";
import { MtPelerinBuy } from "./MtPelerinBuy";
import { TBuyProvider } from "./interfaces";

export function Buy() {
  const [provider, setProvider] = useState<TBuyProvider>("MT_PELERIN");
  const [amount, setAmount] = useState("");
  const { user } = useConnectedUser();

  const recipientAddress =
    user.status === "CONNECTED" && isAddress(user.address) ? user.address : undefined;

  return (
    <div>
      <ProviderPicker provider={provider} setProvider={setProvider} />
      {provider === "PEER" ? (
        <PeerBuy amount={amount} onAmountChange={setAmount} recipientAddress={recipientAddress} />
      ) : (
        <MtPelerinBuy amount={amount} onAmountChange={setAmount} recipientAddress={recipientAddress} />
      )}
    </div>
  );
}
