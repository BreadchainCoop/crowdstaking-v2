"use client";

import { useState } from "react";
import { Hex } from "viem";
import { Heading3, Body, Caption } from "@breadcoop/ui";
import clsx from "clsx";
import { VALUE_CARDS, cardProjectAddresses } from "../valueCards";

type ResolvedCard = {
  statement: string;
  addresses: Hex[];
};

/**
 * Value-based preference test. The user weighs short "I care about…" value
 * statements two at a time (or marks both equal); each pick credits the
 * project(s) behind the winning statement(s). The result seeds a suggested
 * point distribution the user then reviews and edits in the vote form.
 *
 * Every active project appears in exactly 3 cards, so exposure is balanced.
 */
export function ValueTestHelper({
  activeAddresses,
  onComplete,
  onClose,
}: {
  activeAddresses: Hex[];
  onComplete: (points: { [key: Hex]: number }) => void;
  onClose: () => void;
}) {
  // Resolve cards + build the matchup schedule ONCE on mount, so parent
  // re-renders can't regenerate it and make the visible pair jump.
  const [{ cards, matchups }] = useState<{
    cards: ResolvedCard[];
    matchups: [number, number][];
  }>(() => {
    const activeSet = new Set(activeAddresses);
    const resolved = VALUE_CARDS.map((c) => ({
      statement: c.statement,
      addresses: cardProjectAddresses(c).filter((a) => activeSet.has(a)),
    })).filter((c) => c.addresses.length > 0);
    return { cards: resolved, matchups: buildCardMatchups(resolved) };
  });

  const [index, setIndex] = useState(0);
  const [wins, setWins] = useState<{ [key: Hex]: number }>({});

  if (matchups.length === 0) {
    onClose();
    return null;
  }

  const [aIdx, bIdx] = matchups[index];
  const a = cards[aIdx];
  const b = cards[bIdx];

  const advance = (nextWins: { [key: Hex]: number }) => {
    if (index + 1 >= matchups.length) {
      const points = activeAddresses.reduce<{ [key: Hex]: number }>((acc, addr) => {
        acc[addr] = nextWins[addr] ?? 0;
        return acc;
      }, {});
      onComplete(points);
      return;
    }
    setWins(nextWins);
    setIndex(index + 1);
  };

  const award = (addresses: Hex[]) => {
    const nextWins: { [key: Hex]: number } = { ...wins };
    addresses.forEach((addr) => {
      nextWins[addr] = (nextWins[addr] ?? 0) + 1;
    });
    advance(nextWins);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Help Me Choose"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFAF3] w-full max-w-lg p-6 shadow-[0px_4px_12px_0px_#1B201A26]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <Heading3 className="text-xl">Help Me Choose</Heading3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-surface-grey hover:text-surface-ink text-xl leading-none px-2"
          >
            &times;
          </button>
        </div>
        <Caption className="text-surface-grey-2">
          Distribute points based on your values.
        </Caption>
        <Caption className="block text-surface-grey-2 mt-1">
          Question {index + 1} of {matchups.length}
        </Caption>

        <Body className="text-center font-bold text-surface-ink mt-5 mb-2">
          I care about&hellip;
        </Body>
        <div key={index} className="grid grid-cols-2 gap-3">
          <ValueChoice statement={a.statement} onClick={() => award(a.addresses)} />
          <ValueChoice statement={b.statement} onClick={() => award(b.addresses)} />
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => award(unique([...a.addresses, ...b.addresses]))}
            className="text-sm font-bold text-primary-orange border border-primary-orange px-4 py-1.5 hover:bg-primary-orange/10 transition-colors"
          >
            I value both equally
          </button>
        </div>
      </div>
    </div>
  );
}

function ValueChoice({ statement, onClick }: { statement: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center text-center min-h-[6rem] p-4 border bg-white transition-colors",
        "border-surface-grey hover:border-primary-orange hover:bg-primary-orange/5",
      )}
    >
      <Body className="text-base font-bold text-surface-ink">{statement}</Body>
    </button>
  );
}

function unique(addresses: Hex[]): Hex[] {
  return Array.from(new Set(addresses));
}

// Each card appears once → 16 cards / 2 = 8 questions (≤10), and because every
// project sits in exactly 3 cards, each project still gets equal exposure (3).
const APPEARANCES_PER_CARD = 1;

/**
 * Balanced schedule over the value cards: each card appears the same number of
 * times (so every project, which sits in the same number of cards, gets equal
 * exposure). Pairs consecutive shuffled entries, swapping to avoid a card
 * facing itself or a card that shares a project with its opponent.
 */
function buildCardMatchups(cards: ResolvedCard[]): [number, number][] {
  const n = cards.length;
  if (n < 2) return [];

  const bag: number[] = [];
  for (let k = 0; k < APPEARANCES_PER_CARD; k++) {
    for (let i = 0; i < n; i++) bag.push(i);
  }
  if (bag.length % 2 === 1) bag.pop();

  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  const sharesProject = (x: number, y: number) =>
    cards[x].addresses.some((addr) => cards[y].addresses.includes(addr));

  const pairs: [number, number][] = [];
  for (let i = 0; i < bag.length; i += 2) {
    if (bag[i] === bag[i + 1] || sharesProject(bag[i], bag[i + 1])) {
      for (let j = i + 2; j < bag.length; j++) {
        if (bag[j] !== bag[i] && !sharesProject(bag[i], bag[j])) {
          [bag[i + 1], bag[j]] = [bag[j], bag[i + 1]];
          break;
        }
      }
    }
    if (bag[i] !== bag[i + 1]) pairs.push([bag[i], bag[i + 1]]);
  }

  return pairs;
}
