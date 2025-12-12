// app/(cms)/admin/layout.tsx
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { buildDefaultMetadata } from "@/lib/seo";

export async function generateMetadata({}: {}): Promise<Metadata> {
	const defaults: Metadata = {
		robots: "none",
	};
	return buildDefaultMetadata(defaults);
}

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	await requireAdmin();
	return <>{children}</>;
}
