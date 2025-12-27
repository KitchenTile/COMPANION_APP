import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocationTracker = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  // location effect
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    //request background location permision
    async function getBackgroundLocationPermisions() {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    }

    getBackgroundLocationPermisions();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      // Initial position
      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);

      console.log(
        "initial location:",
        initialLocation.coords.latitude,
        initialLocation.coords.longitude
      );

      // Start watching
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          console.log("update:", loc.coords.latitude, loc.coords.longitude);
          setLocation(loc);
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    console.log("location updated");
    console.log(location?.coords.latitude, location?.coords.longitude);
  });

  return location;
};
