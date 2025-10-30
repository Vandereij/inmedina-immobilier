export function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/['"’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}
