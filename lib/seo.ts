import type { Metadata } from "next";

type SeoSource = {
	seo_title?: string | null;
	seo_description?: string | null;
	seo_canonical?: string | null;
	seo_robots?: string | null;
};

export function buildMetadata(source: SeoSource, defaults: Metadata): Metadata {
	return {
		title: source.seo_title ?? defaults.title,
		description: source.seo_description ?? defaults.description,
		alternates: {
			canonical: source.seo_canonical ?? defaults.alternates?.canonical,
		},
		robots: source.seo_robots ?? defaults.robots,
	};
}

export function buildDefaultMetadata(defaults: Metadata) {
	return {
		...(defaults.title && { title: defaults.title }),
		...(defaults.description && { description: defaults.description }),
		...(defaults.robots && { robots: defaults.robots }),
		...(defaults.alternates?.canonical && {
			alternates: {
				canonical: defaults.alternates.canonical,
			},
		}),
	};
}

export function buildCanonical(path: string) {
	const base = process.env.SITE_URL?.replace(/\/$/, "") || "";
	return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
