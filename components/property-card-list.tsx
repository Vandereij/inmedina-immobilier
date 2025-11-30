"use client";

import { motion } from "framer-motion";
import { Bath, BedDouble, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Properties = {
	title: string;
	slug: string;
	area_sqm: number;
	property_type: string;
	availability_type: string;
	location_id: string;
	cover_image_url: string;
	bathrooms: number;
	bedrooms: number;
	price: number;
	locations: any;
};

type Location = {
	id: string;
	name: string;
	slug: string;
};

type PropertyCardProps = {
	locations?: Location[];
	featured?: boolean;
	status?: "published" | "draft";
	parentData?: any;
};

export default function PropertyCardList({
	locations,
	featured,
	status,
	parentData,
}: PropertyCardProps) {
	const supabase = useMemo(() => createClient(), []);
	const [properties, setProperties] = useState<Properties[]>([]);

	const locationsMap = useMemo(() => {
		return (
			locations &&
			locations.reduce((acc, loc) => {
				acc[loc.id] = loc;
				return acc;
			}, {} as Record<string, Location>)
		);
	}, [locations]);

	useEffect(() => {
		let isMounted = true;

		const fetchProperties = async () => {
			let query = supabase
				.from("properties")
				.select(
					"title, slug, area_sqm, property_type, availability_type, location_id, cover_image_url, bedrooms, bathrooms, price, locations(name)"
				)
				.order("title");

			if (featured !== undefined) {
				query = query.eq("featured", featured);
			}

			if (status !== undefined) {
				query = query.eq("status", status);
			}

			const { data, error } = await query;

			if (!isMounted) return;

			if (error) {
				console.error("Failed to load properties", error);
			} else {
				setProperties(data || []);
			}
		};

		parentData ? setProperties(parentData) : fetchProperties();

		return () => {
			isMounted = false;
		};
	}, [supabase, featured]);

	return (
		<div className="grid gap-8 md:grid-cols-3">
			{properties.map((item, i) => {
				const locationName =
					(locationsMap && locationsMap[item.location_id]?.name) ||
					item.locations.name ||
					"Location unavailable";

				return (
					<Link href={`/properties/${item.slug}`} key={item.slug}>
						<motion.article
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 0.6,
								delay: i * 0.05,
							}}
							whileHover={{ y: -4 }}
							className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-lg"
						>
							<div className="relative">
								<motion.img
									src={item.cover_image_url}
									alt={item.title}
									className="h-56 w-full object-cover"
									initial={{
										opacity: 0.9,
										scale: 1.02,
									}}
									whileHover={{ scale: 1.04 }}
									transition={{ duration: 0.4 }}
								/>
								<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient from-black/40 to-transparent" />
								<div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-[#c98a5a] shadow-md">
									<span className="text-base font-semibold text-[#2b2623]">
										€ {item.price.toLocaleString()}
									</span>
								</div>
							</div>

							<div className="flex flex-1 flex-col gap-3 p-5">
								<div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-500">
									<span className="rounded-full bg-neutral-100 px-2 py-1">
										PROPERTY
									</span>
									<span className="uppercase">
										{item.property_type}
									</span>
								</div>

								<h3 className="line-clamp-2 font-medium text-lg text-[#2b2623]">
									{item.title}
								</h3>

								<div className="flex items-center gap-2 text-sm text-neutral-600">
									<MapPin className="h-4 w-4" />
									<span className="truncate">
										{locationName ?? locationName}
									</span>
								</div>

								<div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-700">
									<div className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1">
										<BedDouble className="h-3 w-3" />
										<span>{item.bedrooms} beds</span>
									</div>
									<div className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1">
										<Bath className="h-3 w-3" />
										<span>{item.bathrooms} baths</span>
									</div>
									{item.area_sqm && (
										<div className="rounded-full bg-neutral-100 px-3 py-1">
											{item.area_sqm} m²
										</div>
									)}
									{item.availability_type && (
										<div className="rounded-full bg-[#f9f6f1] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#c98a5a]">
											{item.availability_type}
										</div>
									)}
								</div>
							</div>
						</motion.article>
					</Link>
				);
			})}
		</div>
	);
}
