import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
	return (
		<div className="grid gap-3">
			<div className="flex justify-center">
				<div className="w-10/12">
					<h1 className="text-2xl font-semibold">CMS Dashboard</h1>
					<p>Manage properties, posts, and media.</p>
				</div>
			</div>
		</div>
	);
}
