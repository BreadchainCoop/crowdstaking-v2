import { Body, Caption } from "@breadcoop/ui";
import { ExternalLink } from "@/app/core/components/ExternalLink";

const MARKEE_ADDRESS = "0xa52eb22029677029d4e609ad5e54ca6552c0b31f";
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

// Rendered on the server so `data-markee-address` is present in the HTML,
// which is what markee.xyz checks when verifying this site.
export const Markee = async () => {
	const data = await getMarkee();

	return (
		<div
			data-markee-address={MARKEE_ADDRESS}
			className="border border-[#EA5817] py-3 px-6 mb-4 md:mb-6 md:max-w-[32rem]"
		>
			<Body bold>{data?.message || FALLBACK_MESSAGE}</Body>
			<Caption className="mt-1 text-surface-grey-2">
				{data?.name ? `by ${data.name} · ` : ""}
				<ExternalLink href={MARKEE_URL}>Change this message</ExternalLink>
			</Caption>
		</div>
	);
};
