import { Hex } from "viem";
import { projectsMeta } from "@/app/projectsMeta";

/**
 * Value-based test: instead of comparing projects directly, the user compares
 * short "I care about…" value statements. Each statement maps to 1-2 projects,
 * and picks are tallied back into project points.
 *
 * Exposure is balanced: every active project appears in exactly 3 cards
 * (1 solo + 2 clusters), and no project pair repeats across the two cluster
 * lists. `projectNames` must match the `name` fields in projectsMeta.
 */
export type ValueCard = {
  id: string;
  statement: string; // completes "I care about…"
  projectNames: string[];
};

export const VALUE_CARDS: ValueCard[] = [
  // Solo cards — each project's distinct angle
  { id: "regen-funding", statement: "funding regeneration around the world", projectNames: ["Regen Coordination"] },
  { id: "tdf-village", statement: "building a village where land is shared", projectNames: ["Traditional Dream Factory"] },
  { id: "dandelion-gift", statement: "events without extraction — a gift economy", projectNames: ["Symbiota"] },
  { id: "cca-commons", statement: "the digital commons & post-capitalist ideas", projectNames: ["Crypto Commons Association"] },
  { id: "treasury-mutual-aid", statement: "mutual aid, funded together", projectNames: ["Solidarity Fund Treasury"] },
  { id: "gardens-governance", statement: "bottom-up governance without gatekeepers", projectNames: ["Gardens"] },
  { id: "citizenwallet-payments", statement: "payment systems communities control", projectNames: ["Citizen Wallet"] },
  { id: "core-infra", statement: "public infrastructure, no investors", projectNames: ["Bread Coop Core"] },

  // Cluster list 1
  { id: "cl1-regen-land", statement: "regenerating land & ecosystems", projectNames: ["Regen Coordination", "Traditional Dream Factory"] },
  { id: "cl1-gatherings", statement: "gatherings that bring people together", projectNames: ["Symbiota", "Crypto Commons Association"] },
  { id: "cl1-deciding", statement: "deciding together how shared money is used", projectNames: ["Solidarity Fund Treasury", "Gardens"] },
  { id: "cl1-opensource", statement: "open-source tools, owned by their communities", projectNames: ["Citizen Wallet", "Bread Coop Core"] },

  // Cluster list 2 — different pairings
  { id: "cl2-coordination", statement: "grassroots coordination", projectNames: ["Regen Coordination", "Gardens"] },
  { id: "cl2-inperson", statement: "in-person community & gatherings", projectNames: ["Traditional Dream Factory", "Symbiota"] },
  { id: "cl2-resources", statement: "keeping resources in community hands", projectNames: ["Citizen Wallet", "Solidarity Fund Treasury"] },
  { id: "cl2-postcapitalist", statement: "building a post-capitalist economy", projectNames: ["Crypto Commons Association", "Bread Coop Core"] },
];

/** project name -> address, derived from projectsMeta (kept in sync automatically). */
const addressByName: { [name: string]: Hex } = Object.entries(projectsMeta).reduce(
  (acc, [addr, meta]) => {
    acc[meta.name] = addr as Hex;
    return acc;
  },
  {} as { [name: string]: Hex },
);

/** Resolve a card's project names to active on-chain addresses. */
export function cardProjectAddresses(card: ValueCard): Hex[] {
  return card.projectNames
    .map((n) => addressByName[n])
    .filter((a): a is Hex => Boolean(a) && projectsMeta[a]?.active === true);
}
