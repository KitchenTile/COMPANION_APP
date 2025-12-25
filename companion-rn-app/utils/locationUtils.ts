import * as Location from "expo-location";

interface coordsInterface {
  lat: number;
  lng: number;
}

// turn degrees into radians
const toRadians = (deg: number) => (deg * Math.PI) / 180;

const project = (lat: number, lng: number, refLat: number) => {
  // earth radius in meters
  const R = 6371000;

  return {
    x: toRadians(lng) * Math.cos(toRadians(refLat)) * R,
    y: toRadians(lat) * R,
  };
};

const distancePointToSegment = (
  p: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) => {
  // Project to flat coordinates
  const refLat = (a.lat + b.lat) / 2;

  const P = project(p.lat, p.lng, refLat);
  const A = project(a.lat, a.lng, refLat);
  const B = project(b.lat, b.lng, refLat);

  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const APx = P.x - A.x;
  const APy = P.y - A.y;

  const ab2 = ABx * ABx + ABy * ABy;

  // if 0 length segment use point to point distance
  if (ab2 === 0) {
    const dx = P.x - A.x;
    const dy = P.y - A.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // how far along the segment the projection lands
  let t = (APx * ABx + APy * ABy) / ab2;

  // clamp to the segment
  t = Math.max(0, Math.min(1, t));

  // Closest point on the segment
  const closestX = A.x + t * ABx;
  const closestY = A.y + t * ABy;

  // Distance from P to that point
  const dx = P.x - closestX;
  const dy = P.y - closestY;

  return Math.sqrt(dx * dx + dy * dy);
};

export const isUserOnTrack = (
  userLocation: Location.LocationObject,
  decodedPolyline: coordsInterface[]
) => {
  // Default to true if no route loaded
  if (!decodedPolyline || decodedPolyline.length === 0) return true;

  // like doing float("inf")
  let minDistance = Number.MAX_VALUE;

  const userLat = userLocation.coords.latitude;
  const userLng = userLocation.coords.longitude;

  // iterate tthrough points and get the shortest distance from any given point
  for (let i = 0; i < decodedPolyline.length - 1; i++) {
    const a = decodedPolyline[i];
    const b = decodedPolyline[i + 1];

    const d = distancePointToSegment({ lat: userLat, lng: userLng }, a, b);

    if (d < minDistance) minDistance = d;
  }
  console.log("minDistance");
  console.log(minDistance);

  return minDistance < 200;
};
