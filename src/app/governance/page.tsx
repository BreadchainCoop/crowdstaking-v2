import { generateMetadata } from "@/lib/site-metadata";
import { GovernancePage } from "./GovernancePage";
import { Metadata } from "next";

export const metadata = generateMetadata({title: "Bread Voting"});

export default function Governance() {
  return <GovernancePage />;
}
