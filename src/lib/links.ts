export const LINKS = {
	stacks: "https://stacks.bread.coop",
} as const;

export type LinkKey = keyof typeof LINKS;
