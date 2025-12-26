import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import decodePolyline from "decode-google-map-polyline";
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
    const decodedPolyline = decodePolyline(polyline);
    setPolyline(decodedPolyline);
    setIsDerailed(false);

    derailTriggeredRef.current = false;
  };

  useEffect(() => {
    if (!location || !polyline || !derailTriggeredRef.current) return;

    const onTrack = isUserOnTrack(location, polyline);

    if (!onTrack) {
      setIsDerailed(true);
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
