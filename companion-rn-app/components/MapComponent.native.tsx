import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { colours } from "@/constants/Colors";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useRouteMonitor } from "@/hooks/useRouteMonitor";
import { useAuthStore } from "@/store/store";
import { supabase } from "@/supabase/supabase";
import { useGlobalWebSocket } from "@/utils/WebSocketManager";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { v4 as uuidv4 } from "uuid";
import BugReportComponent from "./BugReportComponent";
import ContentModal from "./ContentModal";
import UserLostComponent from "./UserLostComponent";

export default function App() {
  //TODO:
  // Need to create components for info pannel

  const user = useAuthStore((state) => state.user);

  const polylines = useAuthStore((state) => state.polylines);
  const polyline = useAuthStore((state) => state.polyline);

  const currentTripId = useAuthStore((state) => state.currentTripId);

  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);

  const [audioPlays, setAudioPlays] = useState<number>(0);

  const { sendPacket } = useGlobalWebSocket();
  const chatId = useAuthStore((state) => state.chatId);

  const screenWidth = Dimensions.get("window").width;

  //location
  const location = useLocationTracker();

  const {
    currentPolylineIndex,
    currentActionText,
    currentActionVoice,
    userArrived,
    isUserDerailed,
    ignoreDerailTemporarily,
  } = useRouteMonitor(location);

  const [showLostModal, setShowLostModal] = useState(isUserDerailed);

  useEffect(() => {
    setShowLostModal(isUserDerailed);
  }, [isUserDerailed]);

  const handleDerail = () => {
    setShowLostModal(false);
    if (!polyline) return;
    const origin = polyline[0];
    const destination = polyline[polyline.length - 1];

    console.log("handle derail");

    if (user) {
      console.log("sending [acket]");

      const newPacket = {
        performative: "INFORM",
        message_id: uuidv4(),
        user_id: user.id,
        task_id: currentTripId ?? uuidv4(),
        chat_id: chatId ?? uuidv4(),
        pending_tool_id: null,
        sender: "USER",
        receiver: "ORCHESTRATOR_AGENT",
        content: {
          message: `I am currently at ${location?.coords.latitude}, ${location?.coords.longitude}. I have deviated from the route. Please calculate a new route to the following destination ${destination.lat}, ${destination.lng} by bus and subway.`,
          lost_coords: `${location?.coords.latitude}, ${location?.coords.longitude}`,
          destination: `$${destination.lat}, ${destination.lng}`,
          origin: `${(origin.lat, origin.lng)}`,
          audio_url: null,
        },
      };

      console.log(newPacket);
      sendPacket(newPacket);
    }
  };

  // User claims they aren't lost, trigger the cooldown
  const handleNotLost = () => {
    setShowLostModal(false);
    ignoreDerailTemporarily();
  };

  useEffect(() => {
    if (userArrived) {
      setShowArrivalModal(true);
    }
  }, [userArrived]);

  const calculateRouteLengths = (
    polylines: { lat: number; lng: number }[][] | null,
  ) => {
    if (!polylines) return;
    let polylineDots = 0;
    const polylinePercentage: number[] = [];
    polylines.forEach((polyline) => {
      polylineDots += polyline.length;
    });

    polylines.forEach((polyline) => {
      polylinePercentage.push((polyline.length * 100) / polylineDots);
    });

    return polylinePercentage;
  };

  const polylinePercentages = calculateRouteLengths(polylines);

  const mapCoordinates: { latitude: number; longitude: number }[][] = (
    polylines || []
  )
    .filter((polyline) => !!polyline)
    .map((polyline) =>
      polyline!.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      })),
    );

  const player = useAudioPlayer(currentActionVoice);

  const playStepAudio = async () => {
    if (!currentActionVoice || !player) return;

    console.log(`Commanding play for: ${currentActionVoice}`);

    if (!player.isLoaded) {
      console.log("Track is still buffering. Queuing play...");
      player.play();
      return;
    }

    console.log(audioPlays);
    const newPlayCount = audioPlays + 1;
    setAudioPlays(newPlayCount);

    console.log(newPlayCount);

    console.log(currentTripId);

    const { error } = await supabase
      .from("trip_history")
      .update({ prevention_audio_plays: newPlayCount })
      .eq("id", currentTripId);

    if (error) console.log(error);

    player.seekTo(0);
    player.play();
  };

  // Calculate the user's position across the entire route
  const userProgressPercentage = useMemo(() => {
    if (!polylines || !location) return 0;

    let totalDots = 0;
    let completedDots = 0;

    for (let i = 0; i < polylines.length; i++) {
      totalDots += polylines[i].length;
      if (i < currentPolylineIndex) {
        completedDots += polylines[i].length;
      }
    }

    const currentLine = polylines[currentPolylineIndex];
    if (currentLine) {
      let minDistance = Infinity;
      let closestPointIndex = 0;

      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;

      currentLine.forEach((point, index) => {
        const dx = point.lat - userLat;
        const dy = point.lng - userLng;
        const dist = dx * dx + dy * dy;
        if (dist < minDistance) {
          minDistance = dist;
          closestPointIndex = index;
        }
      });

      completedDots += closestPointIndex;
    }
    const rawPercentage = (completedDots / totalDots) * 100;
    return Math.max(0, Math.min(100, rawPercentage));
  }, [polylines, currentPolylineIndex, location]);

  if (!location) return;
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          anchor={{ x: 0.5, y: 1 }}
          centerOffset={{ x: 0.5, y: -30 }}
        >
          <View style={{ position: "relative" }}>
            <View style={{ position: "absolute" }}>
              <FontAwesome5 name="map-marker" size={35} color="#280079ff" />
            </View>
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(35%, 35%)",
              }}
            >
              <MaterialCommunityIcons
                name="bus-double-decker"
                size={16}
                color="white"
              />
            </View>
          </View>
        </Marker>
        {mapCoordinates &&
          mapCoordinates.map((polyline, index) => (
            <View key={`polyline-group-${index}`}>
              <Polyline
                coordinates={polyline}
                strokeColor={colours[index].replace(
                  "$",
                  currentPolylineIndex === index ? "1" : "0.5",
                )}
                strokeWidth={currentPolylineIndex == index ? 8 : 5}
                zIndex={0}
              />
              <Marker
                coordinate={{
                  latitude: polyline[0].latitude,
                  longitude: polyline[0].longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View
                  style={[
                    styles.circleMarker,
                    {
                      borderColor: colours[index].replace("$", "1"),
                      backgroundColor: colours[index].replace("$", "1"),
                      opacity: currentPolylineIndex === index ? 1 : 0.8,
                    },
                  ]}
                />
              </Marker>
              <Marker
                coordinate={{
                  latitude: polyline[polyline.length - 1].latitude,
                  longitude: polyline[polyline.length - 1].longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View
                  style={[
                    styles.circleMarker,
                    {
                      borderColor: colours[index].replace("$", "1"),
                      backgroundColor: colours[index].replace("$", "1"),
                      opacity: currentPolylineIndex === index ? 1 : 0.8,
                    },
                  ]}
                />
              </Marker>
            </View>
          ))}
        {polylines && polylines.length > 0 && !userArrived && (
          <ThemedView
            style={[
              styles.infoContainer,
              {
                shadowColor: "#0000007a",
                shadowOffset: { width: 0, height: 5 },
                shadowRadius: 10,
                shadowOpacity: 0.1,
                boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 50px 0px",
                width: screenWidth * 0.95,
              },
            ]}
          >
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ThemedText
                type="title"
                style={{
                  paddingTop: 5,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  fontSize: 28,
                }}
              >
                On your way!
              </ThemedText>
              <ThemedText style={{ color: "#723feb", fontWeight: 600 }}>
                Step {currentPolylineIndex + 1} of {polylines.length}
              </ThemedText>
            </ThemedView>

            <View style={styles.routeTracker}>
              <View style={styles.lineContainer}>
                <FontAwesome name="hospital-o" size={24} color="#723feb" />

                <View style={styles.progressBarWrapper}>
                  {polylinePercentages?.map((line, index) => (
                    <View
                      key={`progress-line-${index}`}
                      style={[
                        styles.line,
                        {
                          width: `${line}%`,
                          backgroundColor: colours[index].replace(
                            "$",
                            currentPolylineIndex === index ? "1" : "0.6",
                          ),
                          borderBottomStartRadius: index === 0 ? 50 : 0,
                          borderTopStartRadius: index === 0 ? 50 : 0,
                          borderBottomEndRadius:
                            index === polylinePercentages.length - 1 ? 50 : 0,
                          borderTopEndRadius:
                            index === polylinePercentages.length - 1 ? 50 : 0,
                        },
                      ]}
                    />
                  ))}

                  <View
                    style={[
                      styles.progressIndicator,
                      { left: `${userProgressPercentage}%` },
                    ]}
                  >
                    <FontAwesome5
                      name="map-marker"
                      size={25}
                      color="#280079ff"
                    />
                    <View style={styles.progressIndicatorIcon}>
                      <MaterialCommunityIcons
                        name="bus-double-decker"
                        size={12}
                        color="white"
                      />
                    </View>
                  </View>
                </View>

                <Feather name="home" size={24} color="#723feb" />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                width: "100%",
                marginTop: 15,
              }}
            >
              <View style={[styles.warningSign, styles.shadow]}>
                <ThemedText
                  style={{
                    fontSize: 30,
                    fontWeight: 600,
                    textAlign: "center",
                    alignItems: "center",
                    lineHeight: 40,
                  }}
                >
                  !
                </ThemedText>
              </View>
              <View style={[styles.warningContainer, styles.shadow]}>
                <ThemedText style={{ fontWeight: 600, fontSize: 17 }}>
                  {currentActionText}
                </ThemedText>
                <TouchableOpacity onPress={playStepAudio}>
                  <AntDesign name="sound" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        )}

        <View
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
          }}
        >
          <TouchableOpacity
            style={styles.bugVisibleButton}
            onPress={() => setShowBugModal(true)}
          >
            <FontAwesome6 name="bug" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </MapView>

      <ContentModal
        visible={showArrivalModal}
        onClose={() => setShowArrivalModal(false)}
        buttonText="Done"
        onButtonPress={() => setShowArrivalModal(false)}
        iconName="map-location-dot"
      >
        <ThemedText type="title" style={styles.title}>
          You've Arrived!
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          You have successfully and safely reached your destination.
        </ThemedText>
      </ContentModal>

      <BugReportComponent
        visible={showBugModal}
        onClose={() => setShowBugModal(false)}
        iconName="bug"
      />
      <UserLostComponent
        visible={showLostModal}
        onClose={handleNotLost}
        iconName="location-arrow"
        handleDerail={handleDerail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  circleMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#c2a8ffff",
    borderWidth: 3,
    borderColor: "#723feb",
  },

  infoContainer: {
    width: "95%",
    position: "absolute",
    bottom: 100,
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#733feb48",
    padding: 10,
    backgroundColor: "white",
    alignSelf: "center",
  },
  warningSign: {
    height: 44,
    width: 32,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(251, 55, 55, 1)",
    backgroundColor: "rgba(254, 193, 193, 1)",
    justifyContent: "center",
    alignItems: "center",
  },

  warningContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(251, 55, 55, 1)",
    backgroundColor: "rgba(254, 193, 193, 1)",
    paddingHorizontal: 15,
    minHeight: 44,
  },

  shadow: {
    shadowColor: "#000000b4",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    boxShadow: "rgba(0, 0, 0, 0.01) 0px 5px 50px 0px",
  },

  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 10,
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
  },

  bugVisibleButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#723feb",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  routeTracker: {
    height: 70,
    width: "100%",
    backgroundColor: "#ffffffff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#733feb48",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  progressBarWrapper: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 15,
    transform: "translateY(5%)",
    position: "relative",
    alignItems: "center",
  },
  line: {
    height: 8,
  },
  progressIndicator: {
    position: "absolute",
    top: -20,
    transform: [{ translateX: -8.5 }],
    justifyContent: "center",
    alignItems: "center",
  },
  progressIndicatorIcon: {
    position: "absolute",
    top: 5,
  },
});
