import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { DecodedPoint, decodedPolyline } from "@/utils/types";
import { isUserOnTrack } from "@/utils/locationUtils";

export const useRouteMonitor = (
  location: Location.LocationObject | null,
  onDerail: (polyline: DecodedPoint[]) => void
) => {
  const [polyline, setPolyline] = useState<DecodedPoint[] | null>(null);
  const [isDerailed, setIsDerailed] = useState<boolean>(false);

  const derailTriggeredRef = useRef(false);

  //decode and set polyline, reset state and ref
  const setPolylineFunction = (polyline: string) => {
    const decodePolyline = require("decode-google-map-polyline");
    const decodedPolyline = decodePolyline(polyline);
    setPolyline(decodedPolyline);
    setIsDerailed(false);

    derailTriggeredRef.current = false;
  };

  useEffect(() => {
    if (!location || !polyline || derailTriggeredRef.current) return;

    const onTrack = isUserOnTrack(location, polyline);

    console.log("--- is user on track? ---");
    console.log(onTrack);
    console.log("------");

    if (!onTrack) {
      setIsDerailed(true);
      console.log("USER DERAILED, ASKING FOR NEW DIRECTIONS");
      derailTriggeredRef.current = true;
      onDerail(polyline);
    }
  }, [location, polyline, onDerail]);

  const resetDerail = () => {
    setIsDerailed(false);
  };

  return {
    polyline,
    resetDerail,
    setPolylineFunction,
    isDerailed,
  };
};
