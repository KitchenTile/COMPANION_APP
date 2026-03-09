import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { DecodedPoint, decodedPolyline } from "@/utils/types";
import { isUserOnTrack } from "@/utils/locationUtils";
import { useAuthStore } from "@/store/store";

export const useRouteMonitor = (
  location: Location.LocationObject | null,
  onDerail: (polyline: DecodedPoint[]) => void
) => {
  // const [polyline, setPolyline] = useState<DecodedPoint[] | null>(null);
  const polylines = useAuthStore((state) => state.polylines);
  const [currentPolylineIndex, setCurrentPolylineIndex] = useState(0);
  const setPolyline = useAuthStore((state) => state.setPolyline);
  const setPolylines = useAuthStore((state) => state.setPolylines);
  const polyline = useAuthStore((state) => state.polyline);
  const [isDerailed, setIsDerailed] = useState<boolean>(false);

  const derailTriggeredRef = useRef(false);

  useEffect(() => {
    if (!location || !polylines || polylines.length === 0) return;
    const activeIndex = polylines.findIndex((stepPolyline) =>
      isUserOnTrack(location, stepPolyline)
    );

    if (activeIndex !== -1 && activeIndex !== currentPolylineIndex) {
      setCurrentPolylineIndex(activeIndex);
    }
  }, [location, polylines]);

  //decode and set polyline, reset state and ref
  const setPolylineFunction = (polyline: string) => {
    const decodePolyline = require("decode-google-map-polyline");
    const decodedPolyline = decodePolyline(polyline);
    setPolyline(decodedPolyline);
    setIsDerailed(false);
    // console.log(decodedPolyline);

    derailTriggeredRef.current = false;
  };

  const setIndividualPolylinesFunction = (polylines: string[]) => {
    const decodedPolylines: DecodedPoint[][] = [];
    const decodePolyline = require("decode-google-map-polyline");

    polylines.forEach((polyline) => {
      decodedPolylines.push(decodePolyline(polyline));
    });

    setPolylines(decodedPolylines);
    setIsDerailed(false);
    console.log(decodedPolylines);

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
    setIndividualPolylinesFunction,
    currentPolylineIndex,
    isDerailed,
  };
};
