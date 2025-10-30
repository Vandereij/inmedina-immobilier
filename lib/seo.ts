export function buildCanonical(path: string) {
	const base = process.env.SITE_URL?.replace(/\/$/, "") || "";
	return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
