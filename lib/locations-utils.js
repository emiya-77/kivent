import { districts_en, divisions_en } from "bangladesh-location-data";

export function createLocationSlug(city, state) {
    if (!city || !state) return "";

    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const stateSlug = state.toLowerCase().replace(/\s+/g, '-');

    return `${citySlug}-${stateSlug}`;
}

export function parseLocationSlug(slug) {
    if (!slug || typeof slug !== "string") {
        return { city: null, state: null, isValid: false }
    }

    const parts = slug.split("-");
    if (parts.length < 2) {
        return { city: null, state: null, isValid: false }
    }

    const cityName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);

    const stateName = parts
        .slice(1)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

    // Get all Bangladesh Divisions and Districts
    const bdDivisions = divisions_en;
    const bdDistricts = Object.values(districts_en).flatMap(districtsArray => districtsArray.map(d => d.title));

    // Validate if division exists
    const divisionObj = bdDivisions.find(
        (d) => d.title.toLowerCase() == stateName.toLowerCase()
    )

    if (!divisionObj) {
        return { city: null, state: null, isValid: false }
    }

    const districtObj = bdDistricts.find(
        (d) => d.toLowerCase() == cityName.toLowerCase()
    )

    if (!districtObj) {
        return { city: null, state: null, isValid: false }
    }

    return { city: cityName, state: stateName, isValid: true }
}