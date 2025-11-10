import Image from "next/image";

import type { ReactNode } from "react";
import { LogoSVG } from "../Icons/Logo";
import clsx from "clsx";
import { MirrorIcon } from "../Icons/social";
import DiscordIcon from "../Icons/social/DiscordIcon";
import GithubIcon from "../Icons/social/GithubIcon";
import { LinkIcon } from "../Icons/LinkIcon";
import { Body, Heading3, Logo } from "@breadcoop/ui";
import {
	Arrow,
	Discord,
	Farcaster,
	Github,
	LinkedIn,
	Mail,
	Paragraph,
	Twitter,
	Youtube,
} from "./icons";
import { WRAPPER_CLASSES } from "../../util/classes";
import { ExternalLink } from "../ExternalLink";

const socialLinks: [string, () => ReactNode][] = [
	["https://www.youtube.com/@BreadchainCooperative", Youtube],
	["https://www.linkedin.com/company/bread-cooperative/", LinkedIn],
	["https://github.com/BreadchainCoop", Github],
	["https://cryptoleftists.xyz/", Discord],
	["https://x.com/breadcoop", Twitter],
	["https://paragraph.com/@breadcoop", Paragraph],
	["https://farcaster.xyz/breadcoop", Farcaster],
];

export function Footer() {
	return (
		<footer className="bg-[#EA5817] py-[3.75rem]">
			<div className={`${WRAPPER_CLASSES}`}>
				<div className="lg:flex lg:items-start lg:justify-between">
					<section className="mb-8 lg:mb-0">
						<div className="mb-4 flex items-center justify-center">
							<Logo text="BREAD COOPERATIVE" color="white" />
						</div>
						<Body className="mb-4 text-center text-paper-main lg:text-left">
							Solidarity forever.
						</Body>
						<ul className="flex items-center justify-between">
							{[...socialLinks].map(([href, Icon]) => (
								<li key={href}>
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
									>
										{<Icon />}
									</a>
								</li>
							))}
						</ul>
					</section>
					<Section
						title="Cooperative"
						pages={[
							{
								href: "https://docs.bread.coop/",
								label: "Documentation",
							},
							{
								href: "https://breadchain.mirror.xyz/",
								label: "Blog",
							},
							{
								href: "https://github.com/BreadchainCoop",
								label: "Contribute",
							},
						]}
					/>
					<Section
						title="Solidarity tools"
						pages={[
							{ href: "", label: "Solidarity Funds" },
							{ href: "", label: "Stacks", disabled: true },
							{ href: "", label: "Safety Net", disabled: true },
							{
								href: "https://dune.com/bread_cooperative/solidarity",
								label: "Analytics",
								icon: "link",
							},
						]}
					/>
					<Section
						title="Reach out"
						pages={[
							{
								href: "mailto:contact@bread.coop",
								label: "info@bread.coop",
								icon: "email",
							},
						]}
					/>
					<Section
						title="Support us"
						pages={[
							{
								href: "https://giveth.io/project/breadchain-cooperative",
								label: "Donate in crypto",
								icon: "link",
							},
							{
								href: "https://opencollective.com/bread-cooperative",
								label: "Donate in fiat",
								icon: "link",
							},
						]}
					/>
				</div>
				<div className="border-t border-orange-0 mt-8 pt-8 text-center lg:flex lg:items-start lg:justify-between">
					<Body className="mb-6">
						Creative Commons ©BREAD Cooperative
					</Body>
					<div>
						<Body>
							All Rights Reserved |{" "}
							<ExternalLink
								href="http://"
								className="!text-orange-0"
							>
								Terms and Conditions
							</ExternalLink>{" "}
							|{" "}
							<ExternalLink
								href="http://"
								className="!text-orange-0"
							>
								Privacy Policy
							</ExternalLink>
						</Body>
					</div>
				</div>
			</div>
		</footer>
	);
}

interface ISection {
	title: string;
	pages: {
		label: string;
		href: string;
		disabled?: boolean;
		icon?: "email" | "link";
	}[];
}

const Section = ({ title, pages }: ISection) => {
	return (
		<section className="mb-8 lg:mb-0">
			<Heading3 className="text-paper-main mb-6 text-2xl lg:mb-4 xl:leading-[1.5]">
				{title}
			</Heading3>
			<ul>
				{pages.map((page) => (
					<li
						key={page.label}
						className="mb-2 last:mb-0 flex items-center justify-start"
					>
						{page.icon === "email" && (
							<span className="mr-2">
								<Mail />
							</span>
						)}
						{page.disabled ? (
							<span className="text-surface-ink opacity-50">
								{page.label}
							</span>
						) : (
							<a
								href={page.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-surface-ink disabled:opacity-50"
							>
								{page.label}
							</a>
						)}
						{page.icon === "link" && (
							<span className="ml-2">
								<Arrow />
							</span>
						)}
					</li>
				))}
			</ul>
		</section>
	);
};
