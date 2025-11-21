"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
	status: string; // e.g. "published", "draft", etc.
	title: string; // assuming you have this since you ilike on it
}

interface SearchBarProps {
	isAdmin?: boolean; // admins see all, users see only published
}

export default function SearchBar({ isAdmin = false }: SearchBarProps) {
	// Filters
	const [availabilityType, setAvailabilityType] = useState<
		"rent" | "sale" | ""
	>("");
	const [propertyType, setPropertyType] = useState<"riad" | "terrain" | "">(
		""
	);
	const [locationId, setLocationId] = useState<string | "">("");
	const [bedrooms, setBedrooms] = useState<string>("any");
	const [bathrooms, setBathrooms] = useState<string>("any");
	const [query, setQuery] = useState<string>("");

	// Facets from DB (dynamic)
	const [locations, setLocations] = useState<LocationRow[]>([]);
	const [allProperties, setAllProperties] = useState<PropertyRow[]>([]);

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
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

	// track previous bounds to preserve slider position
	const prevBoundsRef = useRef<{ min: number | null; max: number | null }>({
		min: null,
		max: null,
	});

	// Fetch locations once on mount
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

	// Fetch all relevant properties once (admins: all, users: only published)
	useEffect(() => {
		const fetchProperties = async () => {
			setLoadingInitial(true);

			let query = supabase
				.from("properties")
				.select(
					"id, price, bedrooms, bathrooms, location_id, availability_type, property_type, status, title"
				);

			if (!isAdmin) {
				query = query.eq("status", "published");
			}

			const { data, error } = await query;
			if (!error && data) {
				setAllProperties(data as PropertyRow[]);
			}

			setLoadingInitial(false);
		};

		fetchProperties();
	}, [isAdmin]);

	// Base filtered properties – all filters EXCEPT price
	const baseFiltered = useMemo(() => {
		const q = query.trim().toLowerCase();

		return allProperties.filter((p) => {
			if (availabilityType && p.availability_type !== availabilityType)
				return false;
			if (propertyType && p.property_type !== propertyType) return false;
			if (locationId && p.location_id !== locationId) return false;

			if (bedrooms !== "any") {
				if (p.bedrooms === null || p.bedrooms !== Number(bedrooms))
					return false;
			}

			if (bathrooms !== "any") {
				if (p.bathrooms === null || p.bathrooms !== Number(bathrooms))
					return false;
			}

			if (q) {
				const title = p.title?.toLowerCase() ?? "";
				if (!title.includes(q)) return false;
			}

			return true;
		});
	}, [
		allProperties,
		availabilityType,
		propertyType,
		locationId,
		bedrooms,
		bathrooms,
		query,
	]);

	// Derive facets + min/max price from baseFiltered
	useEffect(() => {
		if (!baseFiltered.length) {
			setMinPrice(0);
			setMaxPrice(0);
			setBedroomOptions([]);
			setBathroomOptions([]);
			setPriceRangeDraft([0, 0]);
			setPriceRangeCommitted([0, 0]);
			prevBoundsRef.current = { min: 0, max: 0 };
			setResultsCount(0);
			return;
		}

		const prices = baseFiltered
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
			// reset range to full bounds if the universe changed
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
				baseFiltered
					.map((r) => r.bedrooms)
					.filter((v): v is number => v !== null)
			)
		).sort((a, b) => a - b);

		const baths = Array.from(
			new Set(
				baseFiltered
					.map((r) => r.bathrooms)
					.filter((v): v is number => v !== null)
			)
		).sort((a, b) => a - b);

		setBedroomOptions(beds);
		setBathroomOptions(baths);
	}, [baseFiltered]);

	// Apply price to get final count (all in memory)
	useEffect(() => {
		if (!baseFiltered.length) {
			setResultsCount(0);
			return;
		}

		const [minP, maxP] = priceRangeCommitted;
		const filteredWithPrice = baseFiltered.filter(
			(p) => p.price >= minP && p.price <= maxP
		);

		setResultsCount(filteredWithPrice.length);
	}, [baseFiltered, priceRangeCommitted]);

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
			bedrooms,
			bathrooms,
			minPrice: String(priceRangeCommitted[0]),
			maxPrice: String(priceRangeCommitted[1]),
			q: query,
		});
		window.location.href = `/properties?${params.toString()}`;
	};

	const formatMoney = (v: number) => v.toLocaleString();

	return (
		<div className="max-w-5xl">
			<Tabs
				value={availabilityType || "all"}
				onValueChange={(v) =>
					setAvailabilityType(
						v === "all" ? "" : (v as "rent" | "sale")
					)
				}
				className="max-w-5xl mt-16"
			>
				<TabsList className="grid grid-cols-3 rounded-t-2xl rounded-b-none p-0">
					<TabsTrigger
						value="all"
						className="flex items-center gap-2 rounded-t-2xl"
					>
						<Home className="h-4 w-4" />
						<span>All</span>
					</TabsTrigger>
					<TabsTrigger
						value="rent"
						className="flex items-center gap-2 rounded-t-2xl"
					>
						<Home className="h-4 w-4" />
						<span>Rent</span>
					</TabsTrigger>
					<TabsTrigger
						value="sale"
						className="flex items-center gap-2 rounded-t-2xl"
					>
						<Home className="h-4 w-4" />
						<span>Sale</span>
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className="mx-auto mb-16 rounded-2xl rounded-tl-none border bg-white p-6 shadow-sm">
				{/* Top Row */}
				<div className="grid grid-cols-1 items-end gap-4 md:grid-cols-5">
					{/* Property Type */}
					<div className="space-y-2 justify-items-center">
						<Label className="text-sm">Property type</Label>
						<Select
							value={propertyType || "__all__"}
							onValueChange={(v) =>
								setPropertyType(
									v === "__all__"
										? ""
										: (v as "riad" | "terrain")
								)
							}
						>
							<SelectTrigger className="justify-between rounded-2xl max-md:w-xs">
								<div className="flex items-center gap-2">
									<Home className="h-4 w-4" />{" "}
									<SelectValue placeholder="Type" />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="riad">Riads</SelectItem>
								<SelectItem value="terrain">
									Terrains
								</SelectItem>
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
							<SelectTrigger className="mt-2 justify-between rounded-2xl max-md:w-xs">
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
							<SelectTrigger className="justify-between rounded-2xl max-md:w-xs">
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
							<SelectTrigger className="justify-between rounded-2xl max-md:w-xs">
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

					{/* Results count (desktop) */}
					<div className="hidden items-center justify-end md:flex border-l-2">
						<div className="text-right">
							{loadingInitial ? (
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
									className="absolute -translate-x-1/2 -translate-y-1/3 rounded-2xl bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
									style={{
										left: `${positionPercent(spanFrom)}%`,
									}}
								>
									{formatMoney(spanFrom)}
								</div>
								<div
									className="absolute -translate-x-1/2 -translate-y-1/3 rounded-2xl bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
									style={{
										left: `${positionPercent(spanTo)}%`,
									}}
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
						<Button onClick={onSearch} className="h-11 w-full rounded-full">
							<SearchIcon className="mr-2 h-4 w-4" /> Search
						</Button>
					</div>

					{/* Mobile results count */}
					<div className="md:hidden">
						<div className="flex items-center gap-2">
							{loadingInitial ? (
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
		</div>
	);
}
