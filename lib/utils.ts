import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { amenitiesTemplate } from "./amenities-template"
export type Amenities = typeof amenitiesTemplate;

export function deepMergeAmenities(savedData: Partial<Amenities>): Amenities {
  // Start with a deep copy of the template to avoid mutations
  const merged = JSON.parse(JSON.stringify(amenitiesTemplate));

  // Iterate over each category in the saved data (e.g., "outdoor_and_leisure")
  for (const category in savedData) {
    const key = category as keyof Amenities;
    if (merged[key] && savedData[key]) {
      // Merge the template's category with the saved category's values
      merged[key] = { ...merged[key], ...savedData[key] };
    }
  }

  return merged;
}