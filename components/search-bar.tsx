"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
	Bath,
	BedDouble,
	Home,
	MapPin,
	Search as SearchIcon,
	SlidersHorizontal,
	Loader2,
} from "lucide-react";

/**
 * ENV REQUIREMENTS
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types matching your DB
interface LocationRow {
	id: string;
	name: string;
}

interface PropertyRow {
	id: string;
	price: number;
	bedrooms: number | null;
	bathrooms: number | null;
	location_id: string | null;
	availability_type: "sale" | "rent";
	property_type: "riad" | "terrain";
}

export default function SearchBar() {
	// Filters
	const [availabilityType, setAvailabilityType] = useState<"rent" | "sale" | "">("");
	const [propertyType, setPropertyType] = useState<"riad" | "terrain" | "">("");
	const [locationId, setLocationId] = useState<string | "">("");
	const [bedrooms, setBedrooms] = useState<string>("any");
	const [bathrooms, setBathrooms] = useState<string>("any");
	const [query, setQuery] = useState<string>("");

	// Facets from DB (dynamic)
	const [locations, setLocations] = useState<LocationRow[]>([]);
	const [bedroomOptions, setBedroomOptions] = useState<number[]>([]);
	const [bathroomOptions, setBathroomOptions] = useState<number[]>([]);

	// Price slider bounds
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>(10000);

	// Draft (UI) vs committed (query) price ranges
	const [priceRangeDraft, setPriceRangeDraft] = useState<[number, number]>([
		0, 10000,
	]);
	const [priceRangeCommitted, setPriceRangeCommitted] = useState<
		[number, number]
	>([0, 10000]);

	// Results count
	const [resultsCount, setResultsCount] = useState<number>(0);

	// Loading states
	const [loadingFacets, setLoadingFacets] = useState<boolean>(false);
	const [loadingCount, setLoadingCount] = useState<boolean>(false);

	// sequence guard to avoid race conditions in async count
	const countSeq = useRef(0);

	// track previous bounds
	const prevBoundsRef = useRef<{ min: number | null; max: number | null }>({
		min: null,
		max: null,
	});

	// Fetch locations once on mount
	useEffect(() => {
		const bootstrap = async () => {
			const { data: locs } = await supabase
				.from("locations")
				.select("id,name")
				.order("name", { ascending: true });

			if (locs) setLocations(locs as LocationRow[]);
		};
		bootstrap();
	}, []);

	/**
	 * Build a Supabase query with all facet filters EXCEPT price
	 */
	const baseFacetQuery = () => {
		let q = supabase
			.from("properties")
			.select(
				"id,price,bedrooms,bathrooms,location_id,availability_type",
				{
					count: "exact",
					head: false,
				}
			);

		if (availabilityType) q = q.eq("availability_type", availabilityType);
		if (propertyType) q = q.eq("property_type", propertyType);
		if (locationId) q = q.eq("location_id", locationId);
		if (bedrooms !== "any") q = q.eq("bedrooms", Number(bedrooms));
		if (bathrooms !== "any") q = q.eq("bathrooms", Number(bathrooms));
		if (query.trim()) q = q.ilike("title", `%${query.trim()}%`);

		return q;
	};

	// Refresh dynamic facets (min/max price, bedroom list, bathroom list)
	const refreshFacets = useCallback(async () => {
		setLoadingFacets(true);
		const { data, error } = await baseFacetQuery();
		if (!error && data) {
			const rows = data as PropertyRow[];
			if (rows.length) {
				const prices = rows
					.map((r) => Number(r.price))
					.filter((v) => !Number.isNaN(v));
				const newMin = Math.min(...prices);
				const newMax = Math.max(...prices);
				setMinPrice(newMin);
				setMaxPrice(newMax);

				const boundsChanged =
					prevBoundsRef.current.min !== newMin ||
					prevBoundsRef.current.max !== newMax;

				if (boundsChanged) {
					setPriceRangeDraft([newMin, newMax]);
					setPriceRangeCommitted([newMin, newMax]);
				} else {
					const clamp = (v: [number, number]) =>
						[
							Math.max(newMin, Math.min(v[0], newMax)),
							Math.max(newMin, Math.min(v[1], newMax)),
						] as [number, number];

					setPriceRangeDraft((prev) => clamp(prev));
					setPriceRangeCommitted((prev) => clamp(prev));
				}

				prevBoundsRef.current = { min: newMin, max: newMax };

				const beds = Array.from(
					new Set(
						rows
							.map((r) => r.bedrooms)
							.filter((v): v is number => v !== null)
					)
				).sort((a, b) => a - b);
				const baths = Array.from(
					new Set(
						rows
							.map((r) => r.bathrooms)
							.filter((v): v is number => v !== null)
					)
				).sort((a, b) => a - b);
				setBedroomOptions(beds);
				setBathroomOptions(baths);
			} else {
				setMinPrice(0);
				setMaxPrice(0);
				setPriceRangeDraft([0, 0]);
				setPriceRangeCommitted([0, 0]);
				setBedroomOptions([]);
				setBathroomOptions([]);
				prevBoundsRef.current = { min: 0, max: 0 };
			}
		}
		setLoadingFacets(false);
	}, [availabilityType, propertyType, locationId, bedrooms, bathrooms, query]);

	// Count results including current committed price range
	const refreshCount = useCallback(async () => {
		const seq = ++countSeq.current;
		setLoadingCount(true);

		let q = baseFacetQuery()
			.gte("price", priceRangeCommitted[0])
			.lte("price", priceRangeCommitted[1]);

		const { count, error } = await (q as any).select("id", {
			count: "exact",
			head: true,
		});

		if (seq !== countSeq.current) return;

		setLoadingCount(false);
		setResultsCount(!error && typeof count === "number" ? count : 0);
	}, [
		availabilityType,
		propertyType,
		locationId,
		bedrooms,
		bathrooms,
		query,
		priceRangeCommitted,
	]);

	useEffect(() => {
		refreshFacets();
	}, [refreshFacets]);

	useEffect(() => {
		const t = setTimeout(() => {
			refreshCount();
		}, 200);
		return () => clearTimeout(t);
	}, [refreshCount]);

	const spanFrom = useMemo(() => priceRangeDraft[0], [priceRangeDraft]);
	const spanTo = useMemo(() => priceRangeDraft[1], [priceRangeDraft]);

	const positionPercent = (value: number) => {
		if (maxPrice === minPrice) return 0;
		return ((value - minPrice) / (maxPrice - minPrice)) * 100;
	};

	const onSearch = () => {
		const params = new URLSearchParams({
			availability_type: availabilityType || "",
			property_type: propertyType || "",
			locationId: locationId || "",
			bedrooms: bedrooms,
			bathrooms: bathrooms,
			minPrice: String(priceRangeCommitted[0]),
			maxPrice: String(priceRangeCommitted[1]),
			q: query,
		});
		window.location.href = `/properties?${params.toString()}`;
	};

	const formatMoney = (v: number) => v.toLocaleString();

	return (
		<div className="mx-auto my-16 max-w-5xl rounded-2xl border bg-white p-6 shadow-sm">
			{/* Top Row */}
			<div className="grid grid-cols-1 items-end gap-4 md:grid-cols-6">
				{/* Availability Type */}
				<div className="space-y-2 justify-items-center">
					<Label className="text-sm">Availability type</Label>
					<Select
						value={availabilityType || "__all__"}
						onValueChange={(v) =>
							setAvailabilityType(v === "__all__" ? "" : (v as any))
						}
					>
						<SelectTrigger className="justify-between rounded-2xl">
							<div className="flex items-center gap-2">
								<Home className="h-4 w-4" />{" "}
								<SelectValue placeholder="Rent or Sale" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="rent">Rent</SelectItem>
							<SelectItem value="sale">Sale</SelectItem>
							<SelectItem value="__all__">All</SelectItem>
						</SelectContent>
					</Select>
				</div>
				
				{/* Property Type */}
				<div className="space-y-2 justify-items-center">
					<Label className="text-sm">Property type</Label>
					<Select
						value={propertyType || "__all__"}
						onValueChange={(v) =>
							setPropertyType(v === "__all__" ? "" : (v as any))
						}
					>
						<SelectTrigger className="justify-between rounded-2xl">
							<div className="flex items-center gap-2">
								<Home className="h-4 w-4" />{" "}
								<SelectValue placeholder="Rent or Sale" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="riad">Riads</SelectItem>
							<SelectItem value="terrain">Terrains</SelectItem>
							<SelectItem value="__all__">All</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Location */}
				<div className="space-y-2 justify-items-center">
					<Label className="text-sm">Location</Label>
					<Select
						value={locationId || "__all__"}
						onValueChange={(v) =>
							setLocationId(v === "__all__" ? "" : v)
						}
					>
						<SelectTrigger className="mt-2 justify-between rounded-2xl">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />{" "}
								<SelectValue placeholder="Select a location" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__all__">All</SelectItem>
							{locations.map((loc) => (
								<SelectItem key={loc.id} value={loc.id}>
									{loc.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Bedrooms */}
				<div className="space-y-2 justify-items-center">
					<Label className="text-sm">Bedrooms</Label>
					<Select
						value={bedrooms}
						onValueChange={(v) => setBedrooms(v)}
					>
						<SelectTrigger className="justify-between rounded-2xl">
							<div className="flex items-center gap-2">
								<BedDouble className="h-4 w-4" />{" "}
								<SelectValue placeholder="Any" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any</SelectItem>
							{bedroomOptions.map((n) => (
								<SelectItem key={n} value={String(n)}>
									{n}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Bathrooms */}
				<div className="space-y-2 justify-items-center">
					<Label className="text-sm">Bathrooms</Label>
					<Select
						value={bathrooms}
						onValueChange={(v) => setBathrooms(v)}
					>
						<SelectTrigger className="justify-between rounded-2xl">
							<div className="flex items-center gap-2">
								<Bath className="h-4 w-4" />{" "}
								<SelectValue placeholder="Any" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">Any</SelectItem>
							{bathroomOptions.map((n) => (
								<SelectItem key={n} value={String(n)}>
									{n}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Results count */}
				<div className="hidden items-center justify-end md:flex border-l-2">
					<div className="text-right">
						{loadingCount ? (
							<div className="flex items-center justify-end">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
							</div>
						) : (
							<div className="text-2xl font-semibold tracking-tight">
								{resultsCount.toLocaleString()}
							</div>
						)}
						<div className="text-xs text-muted-foreground">
							Results
						</div>
					</div>
				</div>
			</div>

			{/* Price Range Slider + Search button */}
			<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5 md:items-center">
				<div className="md:col-span-4">
					<div className="mb-2 flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm font-medium">
							<SlidersHorizontal className="h-4 w-4" /> Price
							range
						</div>
						<div className="text-xs text-muted-foreground">
							{minPrice === maxPrice
								? "No range"
								: `${formatMoney(minPrice)} – ${formatMoney(
										maxPrice
								  )}`}
						</div>
					</div>

					<div className="relative px-2 pt-6">
						<div
							className="pointer-events-none absolute top-0 left-0 right-0"
							aria-hidden
						>
							<div
								className="absolute -translate-x-1/2 -translate-y-1/3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
								style={{
									left: `${positionPercent(spanFrom)}%`,
								}}
							>
								{formatMoney(spanFrom)}
							</div>
							<div
								className="absolute -translate-x-1/2 -translate-y-1/3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
								style={{ left: `${positionPercent(spanTo)}%` }}
							>
								{formatMoney(spanTo)}
							</div>
						</div>

						<Slider
							value={priceRangeDraft}
							min={minPrice}
							max={maxPrice}
							step={Math.max(
								1,
								Math.round((maxPrice - minPrice) / 200)
							)}
							onValueChange={(v) =>
								setPriceRangeDraft([v[0], v[1]] as [
									number,
									number
								])
							}
							onValueCommit={(v) =>
								setPriceRangeCommitted([v[0], v[1]] as [
									number,
									number
								])
							}
							className="mx-1"
						/>

						<div className="mt-2 flex justify-between text-xs text-muted-foreground">
							<span>{formatMoney(minPrice)}</span>
							<span>{formatMoney(maxPrice)}</span>
						</div>
					</div>
				</div>

				<div className="md:col-span-1 md:pt-7">
					<Button onClick={onSearch} className="h-11 w-full">
						<SearchIcon className="mr-2 h-4 w-4" /> Search
					</Button>
				</div>

				{/* Mobile results count */}
				<div className="md:hidden">
					<div className="flex items-center gap-2">
						{loadingCount ? (
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						) : (
							<div>
								<div className="text-xl font-semibold leading-none">
									{resultsCount.toLocaleString()}
								</div>
								<div className="text-xs text-muted-foreground">
									Results
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
