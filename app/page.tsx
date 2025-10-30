import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { useMemo } from "react";

export default async function HomePage() {
	const supabase = useMemo(() => createClient(), []);
	const { data: locations } = await supabase
		.from("locations")
		.select("*")
		.order("name");
	return (
		<section className="grid gap-6">
			<h1 className="text-3xl font-bold">Find your next home</h1>
			<form action="/properties" className="grid md:grid-cols-5 gap-3">
				<select name="availability" className="border rounded-xl p-2">
					<option value="for_sale">For sale</option>
					<option value="for_rent">For rent</option>
				</select>
				<select name="location" className="border rounded-xl p-2">
					<option value="">Any location</option>
					{locations?.map((l) => (
						<option key={l.id} value={l.id}>
							{l.name}
						</option>
					))}
				</select>
				<input
					name="q"
					placeholder="Keywords (e.g. garden, balcony)"
					className="border rounded-xl p-2 md:col-span-2"
				/>
				<button className="border rounded-xl p-2">Search</button>
			</form>
			<div className="text-sm text-gray-600">
				Or browse all{" "}
				<Link className="underline" href="/properties">
					properties
				</Link>
				.
			</div>
		</section>
	);
}
