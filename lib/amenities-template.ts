// lib/amenities-template.ts

export const amenitiesTemplate = {
  architectural_and_traditional: {
    riad: false,
    central_courtyard: false,
    courtyard_fountain: false,
    bhou_lounge: false,
    zellige_tiling: false,
    tadelakt_walls: false,
    carved_cedarwood: false,
    stucco_plasterwork: false,
    arched_doorways: false,
    restored_historic_features: false,
  },
  outdoor_and_leisure: {
    rooftop_terrace: false,
    pergola: false,
    landscaped_gardens: false,
    plunge_pool: false,
    swimming_pool: false,
    infinity_pool: false,
    pool_heated: false,
    medina_view: false,
    atlas_mountain_view: false,
    ocean_view: false,
    garden_view: false,
  },
  modern_comforts: {
    air_conditioning: false,
    reversible_ac: false,
    fireplace: false,
    open_plan_living: false,
    ensuite_bathrooms: 0, // number
    dressing_room: false,
    fiber_optic_internet: false,
    adsl_internet: false,
    satellite_tv: false,
    fully_furnished: false,
    partially_furnished: false,
    unfurnished: false,
    modern_kitchen: false,
    equipped_kitchen: false,
  },
  luxury_and_wellness: {
    private_hammam: false,
    spa_room: false,
    sauna: false,
    gym: false,
    home_cinema: false,
    elevator: false,
  },
  practical_and_security: {
    staff_quarters: false,
    laundry_room: false,
    storage_room: false,
    private_parking: false,
    parking_spaces: 0, // number
    gated_community: false,
    security_24_7: false,
    golf_course_access: false,
    easy_vehicle_access: false,
    titled_property: false,
  },
};

// A helper function to create human-readable labels from camelCase keys
export function formatLabel(key: string): string {
	return key
		.replace(/_/g, " ") // Replace underscores with spaces
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
		.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}