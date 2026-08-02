/**
 * Location and Google Maps URL utility for Pune Rana Garage WhatsApp dispatching
 */

export interface LatLngCoords {
  lat: number;
  lon?: number;
  lng?: number;
}

/**
 * Helper to extract latitude and longitude from location text or coordinates object.
 */
export function extractCoords(
  locationStr: string,
  coords?: LatLngCoords | null
): { lat: number; lng: number } | null {
  if (coords && typeof coords.lat === "number") {
    const lngVal = coords.lon ?? coords.lng;
    if (typeof lngVal === "number" && !isNaN(coords.lat) && !isNaN(lngVal)) {
      return { lat: coords.lat, lng: lngVal };
    }
  }

  if (!locationStr) return null;

  // Match pattern like: 18.5204, 73.8567 OR Lat: 18.5204, Lon: 73.8567 OR 18.5204° N, 73.8567° E
  const re1 = new RegExp("Lat:\\s*(-?\\d+\\.\\d+).*?Lon[g]?:\\s*(-?\\d+\\.\\d+)", "i");
  const re2 = new RegExp("(-?\\d+\\.\\d+)\\s*[,°\\s]\\s*(-?\\d+\\.\\d+)");
  const re3 = new RegExp("(-?\\d+\\.\\d+)\\s*,\\s*(-?\\d+\\.\\d+)");

  const latLngMatch =
    locationStr.match(re1) ||
    locationStr.match(re2) ||
    locationStr.match(re3);

  if (latLngMatch) {
    const lat = parseFloat(latLngMatch[1]);
    const lng = parseFloat(latLngMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Generates a standard, clickable Google Maps URL that opens directly in Google Maps.
 */
export function generateGoogleMapsUrl(
  locationStr: string,
  coords?: LatLngCoords | null
): string {
  const extracted = extractCoords(locationStr, coords);
  if (extracted) {
    return `https://maps.google.com/?q=${extracted.lat},${extracted.lng}`;
  }

  // Fallback to address query mapping
  const cleanAddress = locationStr
    ? locationStr.replace(/\(.*?\)/g, "").replace(/Lat:.*?, Lon:.*?/gi, "").trim()
    : "Dapodi, Pimpri Chinchwad, Pune";

  const addressQuery = cleanAddress.length > 2 ? cleanAddress : "Dapodi, Pimpri Chinchwad, Pune";
  return `https://maps.google.com/?q=${encodeURIComponent(addressQuery)}`;
}

/**
 * Formats a clean WhatsApp-compatible location text block with a direct Google Maps link.
 */
export function formatWhatsAppLocationBlock(
  locationStr: string,
  coords?: LatLngCoords | null
): string {
  const mapsUrl = generateGoogleMapsUrl(locationStr, coords);
  const locDisplay = locationStr || "Dapodi, Pimpri Chinchwad, Pune";
  return `• Location: ${locDisplay}\n📍 *Google Maps Location:* ${mapsUrl}`;
}
