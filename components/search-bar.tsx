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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  status: string;
  title: string;
}

interface SearchBarProps {
  isAdmin?: boolean;
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

  // Facets
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [allProperties, setAllProperties] = useState<PropertyRow[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([]);
  const [bathroomOptions, setBathroomOptions] = useState<number[]>([]);

  // Price bounds
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [priceRangeDraft, setPriceRangeDraft] = useState<[number, number]>([
    0, 10000,
  ]);
  const [priceRangeCommitted, setPriceRangeCommitted] = useState<
    [number, number]
  >([0, 10000]);

  const [resultsCount, setResultsCount] = useState<number>(0);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  const prevBoundsRef = useRef<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });

  // Locations
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

  // Properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingInitial(true);

      let q = supabase
        .from("properties")
        .select(
          "id, price, bedrooms, bathrooms, location_id, availability_type, property_type, status, title"
        );

      if (!isAdmin) {
        q = q.eq("status", "published");
      }

      const { data, error } = await q;
      if (!error && data) {
        setAllProperties(data as PropertyRow[]);
      }

      setLoadingInitial(false);
    };

    fetchProperties();
  }, [isAdmin]);

  // Base filtered (no price, no keyword)
  const baseFiltered = useMemo(() => {
    return allProperties.filter((p) => {
      if (availabilityType && p.availability_type !== availabilityType)
        return false;
      if (propertyType && p.property_type !== propertyType) return false;
      if (locationId && p.location_id !== locationId) return false;

      if (bedrooms !== "any") {
        if (p.bedrooms === null || p.bedrooms !== Number(bedrooms)) return false;
      }

      if (bathrooms !== "any") {
        if (p.bathrooms === null || p.bathrooms !== Number(bathrooms))
          return false;
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
  ]);

  // Derive facets + price
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

  // Apply price
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

  const spanFrom = priceRangeDraft[0];
  const spanTo = priceRangeDraft[1];

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
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  const formatMoney = (v: number) => v.toLocaleString();

  return (
    <section className="bg-[#fdf4ea]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="rounded-3xl border border-[#f1d9c3] bg-white/80 p-5 shadow-sm backdrop-blur md:p-6">
          {/* Header row (more compact) */}
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 uppercase">
                Search
              </div>
              <h2 className="mt-1 font-serif text-xl text-[#1e1e1e] md:text-2xl">
                Find a home in Morocco
              </h2>
            </div>
            <div className="flex items-center gap-2 text-right">
              {loadingInitial ? (
                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
              ) : (
                <>
                  <div className="text-lg font-semibold tracking-tight text-[#1e1e1e]">
                    {resultsCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-500">results</div>
                </>
              )}
            </div>
          </div>

          {/* Availability tabs */}
          <Tabs
            value={availabilityType || "all"}
            onValueChange={(v) =>
              setAvailabilityType(v === "all" ? "" : (v as "rent" | "sale"))
            }
          >
            <TabsList className="mb-4 grid grid-cols-3 rounded-full bg-[#f8f3ee] p-1">
              {[
                { value: "all", label: "All" },
                { value: "rent", label: "Rent" },
                { value: "sale", label: "Sale" },
              ].map((opt) => (
                <TabsTrigger
                  key={opt.value}
                  value={opt.value}
                  className="rounded-full px-2 py-1.5 text-xs font-medium text-neutral-700 data-[state=active]:bg-white data-[state=active]:text-[#1e1e1e] data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Home className="h-4 w-4" />
                    <span>{opt.label}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filters */}
          <div className="space-y-4">
            {/* Top row: type / location / bedrooms / bathrooms */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
              {/* Property Type */}
              <div className="space-y-1 md:justify-self-start place-items-center">
                <Label className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                  Property type
                </Label>
                <Select
                  value={propertyType || "__all__"}
                  onValueChange={(v) =>
                    setPropertyType(v === "__all__" ? "" : (v as "riad" | "terrain"))
                  }
                >
                  <SelectTrigger className="h-10 justify-between rounded-full border-neutral-200 bg-white/80 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-neutral-500" />
                      <SelectValue placeholder="Any" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Any</SelectItem>
                    <SelectItem value="riad">Riads</SelectItem>
                    <SelectItem value="terrain">Terrains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-1 md:justify-self-start place-items-center">
                <Label className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                  Location
                </Label>
                <Select
                  value={locationId || "__all__"}
                  onValueChange={(v) => setLocationId(v === "__all__" ? "" : v)}
                >
                  <SelectTrigger className="h-10 justify-between rounded-full border-neutral-200 bg-white/80 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-500" />
                      <SelectValue placeholder="Any" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Any</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-1 md:justify-self-start place-items-center">
                <Label className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                  Bedrooms
                </Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="h-10 justify-between rounded-full border-neutral-200 bg:white/80 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-neutral-500" />
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
              <div className="space-y-1 md:justify-self-start place-items-center">
                <Label className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                  Bathrooms
                </Label>
                <Select value={bathrooms} onValueChange={setBathrooms}>
                  <SelectTrigger className="h-10 justify-between rounded-full border-neutral-200 bg:white/80 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-neutral-500" />
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
            </div>

            {/* Price + button */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,2.5fr)_auto] md:items-end">
              {/* Price slider */}
              <div className="space-y-1 md:px-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-neutral-700">
                    <SlidersHorizontal className="h-4 w-4" />
                    Price range
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {minPrice === maxPrice
                      ? "No range"
                      : `${formatMoney(minPrice)} – ${formatMoney(maxPrice)}`}
                  </div>
                </div>

                <div className="relative pt-4">
                  {/* Floating labels */}
                  <div className="pointer-events-none absolute left-0 right-0 top-0">
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#c98a5a] px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
                      style={{ left: `${positionPercent(spanFrom)}%` }}
                    >
                      {formatMoney(spanFrom)}
                    </div>
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#c98a5a] px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
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
                      setPriceRangeDraft([v[0], v[1]] as [number, number])
                    }
                    onValueCommit={(v) =>
                      setPriceRangeCommitted([v[0], v[1]] as [number, number])
                    }
                    className="mx-1"
                  />

                  <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
                    <span>{formatMoney(minPrice)}</span>
                    <span>{formatMoney(maxPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Search CTA */}
              <div className="md:pb-1">
                <Button
                  onClick={onSearch}
                  className="h-10 w-full rounded-full bg-[#c98a5a] text-white hover:bg-[#b37750]"
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
