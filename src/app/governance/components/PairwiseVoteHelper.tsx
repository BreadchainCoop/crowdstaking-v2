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
  // Build a short, evenly-covering set of matchups (~each project 2-3 times).
  const matchups = useMemo(() => buildMatchups(projects.map((p) => p.address)), [projects]);

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

        <div className="grid grid-cols-2 gap-3 mt-4">
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
      <Body className="text-xs text-surface-grey-2">{project.description}</Body>
    </button>
  );
}

/**
 * Produce a short list of matchups covering the field evenly — aiming for each
 * project to appear ~3 times, capped so the test stays quick (~n*3/2 pairs).
 */
function buildMatchups(addresses: Hex[]): [Hex, Hex][] {
  const n = addresses.length;
  if (n < 2) return [];

  const allPairs: [Hex, Hex][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      allPairs.push([addresses[i], addresses[j]]);
    }
  }

  // Shuffle so coverage isn't biased by list order.
  for (let i = allPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPairs[i], allPairs[j]] = [allPairs[j], allPairs[i]];
  }

  const targetAppearances = 3;
  const maxPairs = Math.min(allPairs.length, Math.ceil((n * targetAppearances) / 2));
  const counts: { [key: Hex]: number } = {};
  addresses.forEach((a) => (counts[a] = 0));

  const chosen: [Hex, Hex][] = [];
  // Greedily pick pairs that keep appearance counts under the target.
  for (const [a, b] of allPairs) {
    if (chosen.length >= maxPairs) break;
    if (counts[a] < targetAppearances && counts[b] < targetAppearances) {
      chosen.push([a, b]);
      counts[a]++;
      counts[b]++;
    }
  }
  // Backfill any project that never got included (small/odd fields).
  for (const [a, b] of allPairs) {
    if (chosen.length >= maxPairs) break;
    if (counts[a] === 0 || counts[b] === 0) {
      chosen.push([a, b]);
      counts[a]++;
      counts[b]++;
    }
  }

  return chosen;
}
