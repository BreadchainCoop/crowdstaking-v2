import { GovernancePage } from "./GovernancePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bread Voting",
  description: "Bake and burn BREAD. Fund post-capitalist web3.",
};

export default function Governance() {
  return <GovernancePage />;
}
