/**
 * Get route details (distance and duration) between two points using Mapbox Directions API
 * @param {Object} origin - { lat, lng }
 * @param {Object} destination - { lat, lng }
 * @returns {Promise<Object>} - { distanceKm, durationMinutes, route }
 */
export const getRouteDetails = async (origin, destination) => {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1); // Convert meters to km
      const durationMinutes = Math.round(route.duration / 60); // Convert seconds to minutes

      return {
        distanceKm: parseFloat(distanceKm),
        durationMinutes,
        route: route.geometry, // GeoJSON geometry for optional map display
        success: true,
      };
    }

    throw new Error("No route found");
  } catch (error) {
    console.error("Mapbox Directions API error:", error);
    return {
      distanceKm: null,
      durationMinutes: null,
      route: null,
      success: false,
      error: error.message,
    };
  }
};

/**
 * Calculate straight-line distance between two points (Haversine formula)
 * Used as fallback if Directions API fails
 * @param {Object} coord1 - { lat, lng }
 * @param {Object} coord2 - { lat, lng }
 * @returns {number} - Distance in kilometers
 */
export const getDistanceInKm = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Address string
 */
export const reverseGeocode = async (lat, lng) => {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.features[0]?.place_name || "Unknown location";
  } catch (err) {
    console.warn("Mapbox reverse geocode failed:", err.message);
    return "Unknown location";
  }
};
