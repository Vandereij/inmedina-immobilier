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

export function getInitialsFromEmail(email: string | null | undefined): string {
  if (!email || !email.includes("@")) return "";

  const localPart = email.split("@")[0];

  // Replace separators with spaces for splitting
  const normalized = localPart.replace(/[-_.]+/g, " ");

  const parts = normalized.split(" ").filter(Boolean);

  // If the user has multiple parts (john doe → JD)
  if (parts.length >= 2) {
    return (
      parts[0][0].toUpperCase() +
      parts[1][0].toUpperCase()
    );
  }

  // Single word username: take first letter only
  return localPart[0].toUpperCase();
}