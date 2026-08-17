"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Hex } from "viem";
import { Heading3, Heading4, Body, Caption, LiftedButton } from "@breadcoop/ui";
import clsx from "clsx";

export type PairwiseProject = {
  address: Hex;
  name: string;
  description: string;
  logoSrc: string;
  /** Current share of the aggregate vote (0-100), for context while comparing. */
  currentShare?: number;
};

/**
 * A quick pairwise-comparison flow: the user picks a preferred project from a
 * series of head-to-heads, and we tally wins into a suggested point
 * distribution (win-count / margin-aware). This only *suggests* an allocation —
 * the user reviews and edits it in the normal vote form before casting.
 */
export function PairwiseVoteHelper({
  projects,
  onComplete,
  onClose,
}: {
  projects: PairwiseProject[];
  onComplete: (points: { [key: Hex]: number }) => void;
  onClose: () => void;
}) {
  // Build the matchup schedule ONCE on mount. (Using useState's lazy initializer
  // rather than useMemo, because the `projects` prop is a fresh array on every
  // parent re-render — a memo keyed on it would regenerate the schedule mid-test
  // and make the visible pair jump.)
  const [matchups] = useState<[Hex, Hex][]>(() =>
    buildMatchups(projects.map((p) => p.address)),
  );

  const [index, setIndex] = useState(0);
  const [wins, setWins] = useState<{ [key: Hex]: number }>({});

  const byAddress = useMemo(() => {
    const map: { [key: Hex]: PairwiseProject } = {};
    projects.forEach((p) => (map[p.address] = p));
    return map;
  }, [projects]);

  if (matchups.length === 0) {
    // Not enough projects to compare — nothing to do.
    onClose();
    return null;
  }

  const current = matchups[index];
  const [aAddr, bAddr] = current;
  const a = byAddress[aAddr];
  const b = byAddress[bAddr];

  const pick = (winner: Hex) => {
    const nextWins: { [key: Hex]: number } = {
      ...wins,
      [winner]: (wins[winner] ?? 0) + 1,
    };
    if (index + 1 >= matchups.length) {
      // Finished — seed every project's points from its win count (0 if never picked).
      const points = projects.reduce<{ [key: Hex]: number }>((acc, p) => {
        acc[p.address] = nextWins[p.address] ?? 0;
        return acc;
      }, {});
      onComplete(points);
      return;
    }
    setWins(nextWins);
    setIndex(index + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quick preference test"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFAF3] w-full max-w-lg p-6 shadow-[0px_4px_12px_0px_#1B201A26]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <Heading3 className="text-xl">Which would you rather fund?</Heading3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-surface-grey hover:text-surface-ink text-xl leading-none px-2"
          >
            ×
          </button>
        </div>
        <Caption className="text-surface-grey-2">
          Matchup {index + 1} of {matchups.length} — we&apos;ll suggest a point split from your picks.
        </Caption>

        <div key={index} className="grid grid-cols-2 gap-3 mt-4">
          <ProjectChoice project={a} onClick={() => pick(aAddr)} />
          <ProjectChoice project={b} onClick={() => pick(bAddr)} />
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-surface-grey hover:underline"
          >
            Skip the test
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectChoice({ project, onClick }: { project: PairwiseProject; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center text-center gap-3 p-4 border bg-white transition-colors",
        "border-surface-grey hover:border-primary-orange hover:bg-primary-orange/5",
      )}
    >
      <div className="flex items-center justify-center h-12 w-12 bg-white">
        <Image className="w-10 h-10 object-contain" src={project.logoSrc} alt={`${project.name} logo`} width="40" height="40" />
      </div>
      <Heading4 className="text-base">{project.name}</Heading4>
      {typeof project.currentShare === "number" && (
        <span className="text-xs font-bold text-primary-orange">
          {project.currentShare.toFixed(0)}% of the vote so far
        </span>
      )}
      <Body className="text-xs text-surface-grey-2">{project.description}</Body>
    </button>
  );
}

const APPEARANCES_PER_PROJECT = 3;

/**
 * Produce a short, *fair* list of matchups: every project appears the same
 * number of times (APPEARANCES_PER_PROJECT), so no project gets more exposure
 * than another. Built by filling a bag with each address repeated N times,
 * shuffling, and pairing consecutive entries (swapping to avoid a project
 * facing itself). For n projects this yields ~n*N/2 matchups (e.g. 8 → 12).
 */
function buildMatchups(addresses: Hex[]): [Hex, Hex][] {
  const n = addresses.length;
  if (n < 2) return [];

  const bag: Hex[] = [];
  for (let k = 0; k < APPEARANCES_PER_PROJECT; k++) bag.push(...addresses);

  // Need an even number of slots to pair up; drop one if odd.
  if (bag.length % 2 === 1) bag.pop();

  // Fisher-Yates shuffle.
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  const pairs: [Hex, Hex][] = [];
  for (let i = 0; i < bag.length; i += 2) {
    // Avoid a project being matched against itself: swap the second slot with
    // a later slot holding a different project.
    if (bag[i] === bag[i + 1]) {
      for (let j = i + 2; j < bag.length; j++) {
        if (bag[j] !== bag[i]) {
          [bag[i + 1], bag[j]] = [bag[j], bag[i + 1]];
          break;
        }
      }
    }
    if (bag[i] !== bag[i + 1]) pairs.push([bag[i], bag[i + 1]]);
  }

  return pairs;
}
