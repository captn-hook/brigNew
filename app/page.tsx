import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { PoppyIconSmall, PoppyIconLarge } from "@/components/images";
import NextLink from "next/link";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<PoppyIconLarge size={500} />
				<h1 className={title()}>The best&nbsp;</h1>
				<h1 className={title({ color: "yellow" })}>air quality&nbsp;</h1>
				<br />
				<h1 className={title()}>
					insights for your space
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					High quality monitoring, placed right onto your site
				</h2>
			</div>

			<div className="flex gap-3">
				<NextLink
					href='/viewer/'
					className={buttonStyles({ color: "primary", radius: "full" })}
				>
					View the Example Site
				</NextLink>
				<NextLink
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.home}
				>
					<PoppyIconSmall size={24} /> Poppy Home Page
				</NextLink>
			</div>

			<div className="mt-8">
				<Snippet hideSymbol hideCopyButton variant="flat">
					<span>
						Get started by creating a site <NextLink href="/creator" className="text-primary-500"> in the creator</NextLink>
					</span>
				</Snippet>
			</div>
		</section>
	);
}
