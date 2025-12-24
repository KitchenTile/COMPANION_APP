import * as Location from "expo-location";

interface coordsInterface {
  lat: number;
  lng: number;
}

const formatPolyline = (polyline: coordsInterface[]) => {
  const formattedPolyline = polyline.map((coords: coordsInterface) => {
    return [coords.lat, coords.lng];
  });

  return formattedPolyline;
};

console.log("here");

// calculate distance (in meters) between two pais of coords
//code from https://www.movable-type.co.uk/scripts/latlong.html
const equirectangularProjection = (
  userLat: number,
  userLng: number,
  polylinePoint: number[]
) => {
  // Earth radius in meters
  const R = 6371000;

  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const x =
    (toRadians(polylinePoint[1]) - toRadians(userLng)) *
    Math.cos((toRadians(userLat) + toRadians(polylinePoint[0])) / 2);
  const y = toRadians(polylinePoint[0]) - toRadians(userLat);

  const d = Math.sqrt(x * x + y * y) * R;
  return d;
};

console.log("distance");

console.log(
  equirectangularProjection(51.58982, -0.22275, [51.58328, -0.22628])
);

export const isUserOnTrack = (
  userLocation: Location.LocationObject,
  decodedPolyline: coordsInterface[]
) => {
  const formattedPolyline: number[][] = formatPolyline(decodedPolyline);

  // Default to true if no route loaded
  if (!formattedPolyline || formattedPolyline.length === 0) return true;

  // like doing float("inf")
  let minDistance = Number.MAX_VALUE;

  const userLat = userLocation.coords.latitude;
  const userLng = userLocation.coords.longitude;

  for (let point of formattedPolyline) {
    const dist = equirectangularProjection(userLat, userLng, point);
    if (dist < minDistance) minDistance = dist;
  }

  return minDistance < 800;
};
