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
  Coins,
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
  currency: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  location_id: string | null;
  property_type: "sale" | "rent";
}

// Utility to format money without hard-coding currency symbol spacing
const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    value
  );

export default function SearchBar() {
  // Filters
  const [propertyType, setPropertyType] = useState<"rent" | "sale" | "">("");
  const [locationId, setLocationId] = useState<string | "">("");
  const [currency, setCurrency] = useState<string>("GBP");
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [bathrooms, setBathrooms] = useState<string>("any");
  const [query, setQuery] = useState<string>("");

  // Facets from DB (dynamic)
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [currencies, setCurrencies] = useState<string[]>(["GBP"]);
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

  // Results count (with current committed filters including price)
  const [resultsCount, setResultsCount] = useState<number>(0);

  // Loading states
  const [loadingFacets, setLoadingFacets] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);

  // sequence guard to avoid race conditions in async count
  const countSeq = useRef(0);

  // NEW: track previous bounds to detect changes from dropdown updates
  const prevBoundsRef = useRef<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });

  // Fetch locations & currencies once on mount
  useEffect(() => {
    const bootstrap = async () => {
      const [{ data: locs }, { data: currRows }] = await Promise.all([
        supabase.from("locations").select("id,name").order("name", { ascending: true }),
        supabase.from("properties").select("currency").not("currency", "is", null),
      ]);

      if (locs) setLocations(locs as LocationRow[]);
      if (currRows) {
        const unique = Array.from(
          new Set((currRows as { currency: string }[]).map((r) => r.currency))
        );
        if (unique.length) setCurrencies(unique);
        if (unique.includes("GBP")) setCurrency("GBP");
        else if (unique[0]) setCurrency(unique[0]);
      }
    };
    bootstrap();
  }, []);

  /**
   * Build a Supabase query with all facet filters EXCEPT price
   * (We exclude price so we can recalc min/max from the full set that matches the other filters.)
   */
  const baseFacetQuery = () => {
    let q = supabase
      .from("properties")
      .select("id,price,currency,bedrooms,bathrooms,location_id,property_type", {
        count: "exact",
        head: false,
      });

    if (propertyType) q = q.eq("property_type", propertyType);
    if (locationId) q = q.eq("location_id", locationId);
    if (currency) q = q.eq("currency", currency);
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
          // Expand to full range whenever bounds change due to dropdowns
          setPriceRangeDraft([newMin, newMax]);
          setPriceRangeCommitted([newMin, newMax]);
        } else {
          // Keep user’s selection, clamped to current bounds
          const clamp = (v: [number, number]) =>
            [
              Math.max(newMin, Math.min(v[0], newMax)),
              Math.max(newMin, Math.min(v[1], newMax)),
            ] as [number, number];

          setPriceRangeDraft((prev) => clamp(prev));
          setPriceRangeCommitted((prev) => clamp(prev));
        }

        // Remember latest bounds
        prevBoundsRef.current = { min: newMin, max: newMax };

        const beds = Array.from(
          new Set(rows.map((r) => r.bedrooms).filter((v): v is number => v !== null))
        ).sort((a, b) => a - b);
        const baths = Array.from(
          new Set(rows.map((r) => r.bathrooms).filter((v): v is number => v !== null))
        ).sort((a, b) => a - b);
        setBedroomOptions(beds);
        setBathroomOptions(baths);
      } else {
        // No rows: reset to sensible defaults
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
  }, [propertyType, locationId, currency, bedrooms, bathrooms, query]);

  // Count results including current committed price range (debounced + race-guarded)
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

    // ignore stale responses
    if (seq !== countSeq.current) return;

    setLoadingCount(false);
    setResultsCount(!error && typeof count === "number" ? count : 0);
  }, [
    propertyType,
    locationId,
    currency,
    bedrooms,
    bathrooms,
    query,
    priceRangeCommitted,
  ]);

  // Recompute facets when any dropdown/search changes
  useEffect(() => {
    refreshFacets();
  }, [refreshFacets]);

  // Debounce counts to avoid flicker and request spam
  useEffect(() => {
    const t = setTimeout(() => {
      refreshCount();
    }, 200); // 200–300ms feels good
    return () => clearTimeout(t);
  }, [refreshCount]);

  const spanFrom = useMemo(() => priceRangeDraft[0], [priceRangeDraft]);
  const spanTo = useMemo(() => priceRangeDraft[1], [priceRangeDraft]);

  // Compute handle positions for floating labels
  const positionPercent = (value: number) => {
    if (maxPrice === minPrice) return 0;
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const onSearch = () => {
    // Bubble up filters to a parent or perform navigation
    const params = new URLSearchParams({
      property_type: propertyType || "",
      locationId: locationId || "",
      currency: currency || "",
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      minPrice: String(priceRangeCommitted[0]),
      maxPrice: String(priceRangeCommitted[1]),
      q: query,
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="mx-auto mt-16 max-w-5xl rounded-2xl border bg-white p-6 shadow-sm">
      {/* Top Row */}
      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-6">
        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-sm">Listing type</Label>
          <Select
            value={propertyType || "__all__"}
            onValueChange={(v) => setPropertyType(v === "__all__" ? "" : (v as any))}
          >
            <SelectTrigger className="justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" /> <SelectValue placeholder="Rent or Sale" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="__all__">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm">Location</Label>
          <Select value={locationId || "__all__"} onValueChange={(v) => setLocationId(v === "__all__" ? "" : v)}>
            <SelectTrigger className="mt-2 justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> <SelectValue placeholder="Select a location" />
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
        <div className="space-y-2">
          <Label className="text-sm">Bedrooms</Label>
          <Select value={bedrooms} onValueChange={(v) => setBedrooms(v)}>
            <SelectTrigger className="justify-between">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4" /> <SelectValue placeholder="Any" />
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
        <div className="space-y-2">
          <Label className="text-sm">Bathrooms</Label>
          <Select value={bathrooms} onValueChange={(v) => setBathrooms(v)}>
            <SelectTrigger className="justify-between">
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4" /> <SelectValue placeholder="Any" />
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

        {/* Currency */}
        <div className="space-y-2">
          <Label className="text-sm">Currency</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v)}>
            <SelectTrigger className="justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" /> <SelectValue placeholder="Select" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count (top-right on md+) */}
        <div className="hidden items-center justify-end md:flex">
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
            <div className="text-xs text-muted-foreground">Results</div>
          </div>
        </div>
      </div>

      {/* Price Range Slider + Search button in same row */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-6 md:items-center">
        {/* Slider (takes 5 columns on md+) */}
        <div className="md:col-span-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="h-4 w-4" /> Price range
            </div>
            <div className="text-xs text-muted-foreground">
              {minPrice === maxPrice
                ? "No range"
                : `${formatMoney(minPrice, currency)} – ${formatMoney(
                    maxPrice,
                    currency
                  )}`}
            </div>
          </div>

          <div className="relative px-2 pt-6">
            {/* Floating labels tied to slider thumbs */}
            <div className="pointer-events-none absolute top-0 left-0 right-0" aria-hidden>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
                style={{ left: `${positionPercent(spanFrom)}%` }}
              >
                {formatMoney(spanFrom, currency)}
              </div>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
                style={{ left: `${positionPercent(spanTo)}%` }}
              >
                {formatMoney(spanTo, currency)}
              </div>
            </div>

            <Slider
              value={priceRangeDraft}
              min={minPrice}
              max={maxPrice}
              step={Math.max(1, Math.round((maxPrice - minPrice) / 200))}
              onValueChange={(v) => setPriceRangeDraft([v[0], v[1]] as [number, number])}
              onValueCommit={(v) => setPriceRangeCommitted([v[0], v[1]] as [number, number])}
              className="mx-1"
            />

            {/* Min/Max legends under the track */}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatMoney(minPrice, currency)}</span>
              <span>{formatMoney(maxPrice, currency)}</span>
            </div>
          </div>
        </div>

        {/* Search button (side of slider on md+, below on mobile) */}
        <div className="md:col-span-1">
          <Button onClick={onSearch} className="h-11 w-full">
            <SearchIcon className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {/* Mobile results count (visible below on small screens) */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {loadingCount ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div>
                <div className="text-xl font-semibold leading-none">
                  {resultsCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Results</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
