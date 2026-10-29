import { Body, Caption } from "@breadcoop/ui";
// dist/ssr: context-free icons usable in server components
import {
	ArrowUpRightIcon,
	MegaphoneSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

export const MARKEE_ADDRESS = "0xa52eb22029677029d4e609ad5e54ca6552c0b31f";
const MARKEE_URL = `https://www.markee.xyz/markee/${MARKEE_ADDRESS}`;
const FALLBACK_MESSAGE = "Be the first to set a message on the Solidarity Fund.";

type MarkeeData = { message?: string; name?: string };

async function getMarkee(): Promise<MarkeeData | null> {
	try {
		const res = await fetch(
			`https://www.markee.xyz/api/embed/${MARKEE_ADDRESS}`,
			{ next: { revalidate: 60 } }
		);
		if (!res.ok) return null;
		return (await res.json()) as MarkeeData;
	} catch {
		return null;
	}
}

export const Markee = async () => {
	const data = await getMarkee();

	return (
		<div className="flex items-center gap-4 border-l-4 border-primary-orange bg-orange-0 px-5 py-4 shadow-[0px_4px_8px_0px_#1B201A0F]">
			<span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-primary-orange">
				<MegaphoneSimpleIcon size={24} weight="fill" />
			</span>
			<span className="flex min-w-0 grow flex-col gap-0.5">
				<Caption className="font-bold uppercase tracking-wider text-primary-orange">
					Message from the community
				</Caption>
				<Body bold className="text-surface-ink">
					{data?.message || FALLBACK_MESSAGE}
				</Body>
				{data?.name && (
					<Caption className="text-surface-grey-2">
						by {data.name}
					</Caption>
				)}
			</span>
			<a
				href={MARKEE_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="group flex shrink-0 items-center gap-1 text-primary-orange hover:underline"
			>
				<Caption className="font-bold">Change message</Caption>
				<ArrowUpRightIcon
					size={16}
					className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</a>
		</div>
	);
};
