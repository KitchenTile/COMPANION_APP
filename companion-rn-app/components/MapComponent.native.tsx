import React, { useEffect, useMemo, useState } from "react";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/store/store";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { ThemedText } from "@/components/ThemedText";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouteMonitor } from "@/hooks/useRouteMonitor";
import { ThemedView } from "@/components/ThemedView";
import { colours } from "@/constants/Colors";
import { useAudioPlayer } from "expo-audio";
import { Dimensions } from "react-native";
import ContentModal from "./ContentModal";
import BugReportComponent from "./BugReportComponent";

export default function App() {
  //TODO:
  // Need to create components for info pannel
  // General fixes and improvements in style

  const user = useAuthStore((state) => state.user);

  const polylines = useAuthStore((state) => state.polylines);
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  //location
  const location = useLocationTracker();

  const {
    currentPolylineIndex,
    currentActionText,
    currentActionVoice,
    userArrived,
  } = useRouteMonitor(location);

  // useEffect(() => {
  //   console.log(" -- NEW POLYLINES: --");
  //   console.log(polylines);
  // }, [polylines]);

  useEffect(() => {
    if (userArrived) {
      setShowArrivalModal(true);
    }
  }, [userArrived]);

  useEffect(() => {
    console.log(" -- NEW AUDIO FILE: --");
    console.log(currentActionVoice);
  }, [currentActionVoice]);

  const calculateRouteLengths = (
    polylines: { lat: number; lng: number }[][] | null
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
      }))
    );

  const player = useAudioPlayer(currentActionVoice);

  const playStepAudio = () => {
    if (!currentActionVoice || !player) return;

    console.log(`Commanding play for: ${currentActionVoice}`);

    if (!player.isLoaded) {
      console.log("Track is still buffering. Queuing play...");
      player.play();
      return;
    }

    player.seekTo(0);
    player.play();
  };

  // Calculate the user's position (0% to 100%) across the entire route
  const userProgressPercentage = useMemo(() => {
    if (!polylines || !location) return 0;

    let totalDots = 0;
    let completedDots = 0;

    // 1. Count dots from fully completed previous steps
    for (let i = 0; i < polylines.length; i++) {
      totalDots += polylines[i].length;
      if (i < currentPolylineIndex) {
        completedDots += polylines[i].length;
      }
    }

    // 2. Estimate progress on the CURRENT step by finding the closest coordinate
    const currentLine = polylines[currentPolylineIndex];
    if (currentLine) {
      let minDistance = Infinity;
      let closestPointIndex = 0;

      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;

      // Simple distance check to find the closest dot on the current line
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
    // 3. Calculate final percentage, capped between 0 and 100
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
        {/* Default Polyline */}
        {mapCoordinates &&
          mapCoordinates.map((polyline, index) => (
            <View>
              <Polyline
                coordinates={polyline}
                strokeColor={colours[index].replace(
                  "$",
                  currentPolylineIndex === index ? "1" : "0.5"
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
        {polylines && (
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
              style={{ flexDirection: "row", gap: 60, alignItems: "center" }}
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
                On your way Home
              </ThemedText>
              <ThemedText style={{ color: "#723feb", fontWeight: 600 }}>
                Step {currentPolylineIndex + 1} of {polylines.length}
              </ThemedText>
            </ThemedView>
            <View style={styles.routeTracker}>
              <View style={styles.lineContainer}>
                <View style={{ position: "absolute", top: -13, left: -30 }}>
                  <FontAwesome name="hospital-o" size={24} color="#723feb" />
                </View>
                {polylinePercentages?.map((line, index) => (
                  <View
                    style={[
                      styles.line,
                      {
                        width: `${line}%`,
                        backgroundColor: colours[index].replace(
                          "$",
                          currentPolylineIndex === index ? "1" : "0.6"
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
                <View style={{ position: "absolute", top: -13.5, left: 272 }}>
                  <Feather name="home" size={24} color="#723feb" />
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: "-350%",
                    left: `${userProgressPercentage}%`,
                    marginLeft: -10,
                  }}
                >
                  <View style={{ position: "absolute" }}>
                    <FontAwesome5
                      name="map-marker"
                      size={25}
                      color="#280079ff"
                    />
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(30%, 30%)",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="bus-double-decker"
                      size={12}
                      color="white"
                    />
                  </View>
                </View>
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
    height: 200,
    width: 380,
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

  routeTracker: {
    height: 70,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#ffffffff",

    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#733feb48",
    justifyContent: "center",

    shadowColor: "#000000b4",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    boxShadow: "rgba(0, 0, 0, 0.01) 0px 5px 50px 0px",
  },

  lineContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "75%",
    transform: "translateY(8%)",
    display: "flex",
    flexDirection: "row",
  },

  line: {
    height: 8,
  },

  warningSign: {
    height: 40,
    width: 30,
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "rgba(251, 55, 55, 1)",
    backgroundColor: "rgba(254, 193, 193, 1)",
  },

  warningContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "rgba(251, 55, 55, 1)",
    backgroundColor: "rgba(254, 193, 193, 1)",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
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
});
