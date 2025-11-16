import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MapPin, Loader2, Search } from "lucide-react";

// Save this as: components/address-map-lookup.tsx

export function AddressMapLookup({
	onCoordinatesFound,
}: {
	onCoordinatesFound: (data: {
		lat: number;
		lng: number;
		formattedAddress: string;
		addressLine1: string;
		addressLine2: string;
	}) => void;
}) {
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [previewCoords, setPreviewCoords] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [formattedAddress, setFormattedAddress] = useState("");

	async function searchAddress() {
		if (!address.trim()) {
			setError("Please enter an address");
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Using Nominatim (OpenStreetMap) - free, no API key needed
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					address
				)}&limit=1&addressdetails=1`
			);

			const data = await response.json();

			if (data.length === 0) {
				setError("Address not found. Please try a different search.");
				setPreviewCoords(null);
				return;
			}

			const result = data[0];
			const lat = parseFloat(result.lat);
			const lng = parseFloat(result.lon);
			const formatted = result.display_name;

			// Parse address components for address line 1 and 2
			const addr = result.address || {};console.log(addr)

			// Build address line 1 (street info)
			const addressLine1Parts = [
				addr.house_number,
				addr.road || addr.street || addr.pedestrian,
			].filter(Boolean);
			const addressLine1 = addressLine1Parts.join(" ");

			// Build address line 2 (city, state, postal)
			const addressLine2Parts = [
				addr.neighbourhood,
				addr.city || addr.town || addr.village,
				addr.state || addr.province,
				addr.postcode,
			].filter(Boolean);
			const addressLine2 = addressLine2Parts.join(", ");

			setPreviewCoords({ lat, lng });
			setFormattedAddress(formatted);

			onCoordinatesFound({
				lat,
				lng,
				formattedAddress: formatted,
				addressLine1: addressLine1,
				addressLine2: addressLine2,
			});
		} catch (err) {
			setError("Failed to search address. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Address Lookup</CardTitle>
				<CardDescription>
					Search for an address to automatically set coordinates and
					preview the map
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="address-search">Search Address</Label>
					<div className="flex gap-2">
						<Input
							id="address-search"
							placeholder="Enter full address (e.g., 123 Main St, Marrakech, Morocco)"
							value={address}
							onChange={(e) => {
								setAddress(e.target.value);
								setError("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									searchAddress();
								}
							}}
						/>
						<Button
							type="button"
							onClick={searchAddress}
							disabled={loading}
							size="icon"
						>
							{loading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Search className="h-4 w-4" />
							)}
						</Button>
					</div>
					{error && <p className="text-sm text-red-500">{error}</p>}
					{formattedAddress && (
						<p className="text-sm text-green-600 flex items-start gap-1">
							<MapPin className="h-4 w-4 mt-0.5 shrink-0" />
							<span>{formattedAddress}</span>
						</p>
					)}
				</div>

				{previewCoords && (
					<div className="space-y-2">
						<Label>Map Preview</Label>
						<div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200">
							<iframe
								src={`https://maps.google.com/maps?q=${previewCoords.lat},${previewCoords.lng}&hl=en&z=15&output=embed`}
								className="w-full h-full border-0"
								loading="lazy"
								title="Map preview"
							></iframe>
						</div>
						<div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
							<div>
								<span className="font-medium">Latitude:</span>{" "}
								{previewCoords.lat.toFixed(6)}
							</div>
							<div>
								<span className="font-medium">Longitude:</span>{" "}
								{previewCoords.lng.toFixed(6)}
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
