// components/amenities-form.tsx

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { amenitiesTemplate, formatLabel } from "@/lib/amenities-template";

type AmenitiesState = typeof amenitiesTemplate;

interface AmenitiesFormProps {
	amenities: AmenitiesState;
	onAmenitiesChange: (
		category: keyof AmenitiesState,
		key: string,
		value: boolean | number
	) => void;
}

export function AmenitiesForm({
	amenities,
	onAmenitiesChange,
}: AmenitiesFormProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Amenities</CardTitle>
				<CardDescription>
					Select all the amenities that apply to this property.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{Object.entries(amenitiesTemplate).map(([category, items]) => (
					<Collapsible key={category} className="border rounded-md">
						<CollapsibleTrigger className="flex w-full items-center justify-between p-4">
							<span className="font-medium text-lg">
								{formatLabel(category)}
							</span>
							<ChevronsUpDown className="h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent className="p-4 pt-0">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
								{Object.entries(items).map(
									([key, defaultValue]) => {
										const amenityKey =
											key as keyof typeof items;
										const categoryData =
											amenities[
												category as keyof AmenitiesState
											];
										const currentValue =
											categoryData &&
											amenityKey in categoryData
												? categoryData[
														amenityKey as keyof typeof categoryData
												  ]
												: defaultValue;

										return (
											<div key={key}>
												{typeof defaultValue ===
												"boolean" ? (
													<div className="flex items-center space-x-2">
														<Checkbox
															id={`${category}-${key}`}
															checked={Boolean(
																currentValue
															)}
															onCheckedChange={(
																checked
															) =>
																onAmenitiesChange(
																	category as keyof AmenitiesState,
																	key,
																	!!checked
																)
															}
														/>
														<Label
															htmlFor={`${category}-${key}`}
															className="font-normal cursor-pointer"
														>
															{formatLabel(key)}
														</Label>
													</div>
												) : (
													<div className="space-y-1">
														<Label
															htmlFor={`${category}-${key}`}
														>
															{formatLabel(key)}
														</Label>
														<Input
															id={`${category}-${key}`}
															type="number"
															value={String(
																currentValue
															)}
															onChange={(e) =>
																onAmenitiesChange(
																	category as keyof AmenitiesState,
																	key,
																	parseInt(
																		e.target
																			.value,
																		10
																	) || 0
																)
															}
															min="0"
														/>
													</div>
												)}
											</div>
										);
									}
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>
				))}
			</CardContent>
		</Card>
	);
}
