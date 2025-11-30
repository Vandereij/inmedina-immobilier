'use client'

import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";

const supabase = createClient();

interface LocationRow {
	id: string;
	name: string;
}

export default function Footer() {
	const [locations, setLocations] = useState<LocationRow[]>([]);
	
	useEffect(() => {
		const fetchLocations = async () => {
			const { data: locs } = await supabase
				.from("locations")
				.select("id,name")
				.order("name", { ascending: true });

			if (locs) setLocations(locs as LocationRow[]);
		};

		fetchLocations();
	}, []);

	return (
		<footer className="bg-background py-10 text-sm text-neutral-600">
			<div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 md:flex-row md:px-8">
				<div>
					<div className="font-serif text-lg">InMedina</div>
					<p className="mt-1 text-neutral-500">
						Curated Moroccan properties for discerning global
						clients.
					</p>
				</div>
				<div className="flex flex-wrap gap-6 text-xs text-neutral-500">
					<div>
						<div className="font-medium text-neutral-700">
							Explore Area
						</div>
						<ul className="mt-1 space-y-1">
						{locations && locations.map((item) => (
							<li key={item.id}>
								<a href={`/properties?locationId=${item.id}`} className="hover:text-[#c98a5a]">
									{item.name}
								</a>
							</li>
						))}
						</ul>
					</div>
					<div>
						<div className="font-medium text-neutral-700">
							Connect
						</div>
						<p className="mt-1">realestate@inmedina.com</p>
						<p>+212 (0) 600 000 000</p>
					</div>
				</div>
			</div>
			<div className="mt-6 text-center text-xs text-neutral-400">
				© {new Date().getFullYear()} InMedina - All rights reserved
			</div>
		</footer>
	);
}
