import { Body, Logo } from "@breadcoop/ui";
import { Chip } from "./Chip";

export const BreadCirculation = () => {
	return (
		<Chip className="max-w-max mb-4">
			<Logo />
			<Body bold className="flex items-center justify-center gap-1">
				440,000 BREAD{" "}
				<span className="font-normal">in circulation</span>
			</Body>
		</Chip>
	);
};
