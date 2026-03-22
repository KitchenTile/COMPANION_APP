import { useAuthStore } from "@/store/store";
import { supabase } from "@/supabase/supabase";
import { isUserOnDestination, isUserOnTrack } from "@/utils/locationUtils";
import { DecodedPoint } from "@/utils/types";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export const useRouteMonitor = (
  location: Location.LocationObject | null,
  onDerail?: (polyline: DecodedPoint[]) => void,
  onIntervention?: (audioUrl: string) => void,
) => {
  const polylines = useAuthStore((state) => state.polylines);
  const [currentPolylineIndex, setCurrentPolylineIndex] = useState<number>(0);
  const setPolyline = useAuthStore((state) => state.setPolyline);
  const currentTripId = useAuthStore((state) => state.currentTripId);
  const setCurrentTripId = useAuthStore((state) => state.setCurrentTripId);

  const setPolylines = useAuthStore((state) => state.setPolylines);
  const polyline = useAuthStore((state) => state.polyline);
  const [userArrived, setUserArrived] = useState<boolean>(false);
  const [currentActionText, setCurrentActionText] = useState<string>("");
  const [currentActionVoice, setCurrentActionVoice] = useState<string>("");

  const derailTriggeredRef = useRef(false);

  const routeGraph = useAuthStore((state) => state.graph);
  const previouslyTriggeredSteps = useRef<Set<number>>(new Set());

  useEffect(() => {
    console.log("--- GRAPH ---");
    console.log(routeGraph);
  }, [routeGraph]);

  //effect to keep track of step dissalignment and active action voice and text
  useEffect(() => {
    if (!routeGraph || !routeGraph.steps || routeGraph.steps.length === 0)
      return;
    const activePhysicalStep = currentPolylineIndex + 1;

    const currentShortenedStepIndex = routeGraph.steps.findIndex((step: any) =>
      step.mapped_raw_steps.includes(activePhysicalStep),
    );

    if (currentShortenedStepIndex === -1) return;

    const currentShortenedStep = routeGraph.steps[currentShortenedStepIndex];
    const prevention = currentShortenedStep.best_prevention;

    if (
      prevention
      // !previouslyTriggeredSteps.current.has(currentShortenedStepIndex)
    ) {
      setCurrentActionText(prevention.label.action_text);
      setCurrentActionVoice(prevention.audio_url.signedURL);
      console.log("FIRING PREVENTION FOR NODE:", currentShortenedStep.node_to);
      console.log("ACTION VOICE:", prevention.label.action_voice);
      console.log("ACTION TEXT:", prevention.label.action_text);

      if (prevention.audio_url.signedURL && onIntervention) {
        onIntervention(prevention.audio_url.signedURL);
      }

      previouslyTriggeredSteps.current.add(currentShortenedStepIndex);
    }
  }, [currentPolylineIndex, routeGraph]);

  //effect to calculate the current individual polyline the user is on
  useEffect(() => {
    if (!location || !polylines || polylines.length === 0) return;
    const activeIndex = polylines.findIndex((stepPolyline) =>
      isUserOnTrack(location, stepPolyline),
    );

    if (activeIndex !== -1 && activeIndex !== currentPolylineIndex) {
      setCurrentPolylineIndex(activeIndex);
    }
  }, [location, polylines]);

  //effect to keep an eye on user location and notify if they derail
  useEffect(() => {
    if (!location || !polyline || derailTriggeredRef.current) return;

    const onTrack = isUserOnTrack(location, polyline);

    console.log("--- is user on track? ---");
    console.log(onTrack);
    console.log("------");

    if (!onTrack) {
      console.log("USER DERAILED, ASKING FOR NEW DIRECTIONS");
      derailTriggeredRef.current = true;
      onDerail && onDerail(polyline);
    }
  }, [location, polyline, onDerail]);

  //effect to reset states when the user reaches their destination
  useEffect(() => {
    if (!location || !polyline) return;

    const handleArrival = async () => {
      if (isUserOnDestination(location, polyline[polyline.length - 1])) {
        setUserArrived(true);
        setPolyline(null);
        setPolylines(null);
        setCurrentActionText("");
        setCurrentActionVoice("");
        setCurrentPolylineIndex(0);

        console.log("taskId");
        console.log(currentTripId);
        const { data, error } = await supabase
          .from("trip_history")
          .update({ successfully_finished: true })
          .eq("id", currentTripId)
          .select();

        if (data) console.log(data);
        if (error) console.log(error);

        setCurrentTripId(null);
      }
    };

    handleArrival();
  }, [location, polyline]);

  //decode and set polyline, reset state and ref
  const setPolylineFunction = (polyline: string) => {
    const decodePolyline = require("decode-google-map-polyline");
    const decodedPolyline = decodePolyline(polyline);
    setPolyline(decodedPolyline);
    // console.log(decodedPolyline);

    derailTriggeredRef.current = false;
  };

  //decode and set individual polylines as an array of arrays of coords
  const setIndividualPolylinesFunction = (polylines: string[]) => {
    const decodedPolylines: DecodedPoint[][] = [];
    const decodePolyline = require("decode-google-map-polyline");

    polylines.forEach((polyline) => {
      decodedPolylines.push(decodePolyline(polyline));
    });

    setPolylines(decodedPolylines);
    console.log(decodedPolylines);

    derailTriggeredRef.current = false;
  };

  return {
    polyline,
    setPolylineFunction,
    setIndividualPolylinesFunction,
    currentPolylineIndex,
    currentActionText,
    currentActionVoice,
    userArrived,
  };
};
