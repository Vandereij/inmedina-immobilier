import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
	await requireAdmin();
	return (
		<div className="grid gap-3">
			<h1 className="text-2xl font-semibold">CMS Dashboard</h1>
			<p>Manage properties, posts, and media.</p>
		</div>
	);
}
