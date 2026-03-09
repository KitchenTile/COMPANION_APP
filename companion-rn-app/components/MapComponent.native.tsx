import React, { useEffect, useState } from "react";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import { Platform, StyleSheet, View } from "react-native";
import { useAuthStore } from "@/store/store";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { ThemedText } from "@/components/ThemedText";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouteMonitor } from "@/hooks/useRouteMonitor";
import { ThemedView } from "@/components/ThemedView";
import { colours } from "@/constants/Colors";

export default function App() {
  //TODO:
  // this file is a placeholder for what it will look like/what functionality it will have in the future.
  // Need to create components for info pannel
  // Need to place the actual user's location in relation to the route line
  // General fixes and improvements in style

  const user = useAuthStore((state) => state.user);

  const polylines = useAuthStore((state) => state.polylines);
  const handleDerail = () => {
    return;
  };
  //location
  const location = useLocationTracker();

  const { currentPolylineIndex, isDerailed } = useRouteMonitor(
    location,
    handleDerail
  );

  useEffect(() => {
    console.log(" -- NEW POLYLINES: --");
    console.log(polylines);
  }, [polylines]);

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
              <View style={styles.lineCotainer}>
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
                  style={{ position: "absolute", top: "-350%", left: "55%" }}
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
                  {/* Get ready, getting off in 5 stops */}
                  Is user on track? {isDerailed}
                </ThemedText>
                <AntDesign name="sound" size={20} color="black" />
              </View>
            </View>
          </ThemedView>
        )}
      </MapView>
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
    transform: "translateX(5%)",
    padding: 10,
    backgroundColor: "white",
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

  lineCotainer: {
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
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "rgba(251, 55, 55, 1)",
    backgroundColor: "rgba(254, 193, 193, 1)",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 60,
  },

  shadow: {
    shadowColor: "#000000b4",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    boxShadow: "rgba(0, 0, 0, 0.01) 0px 5px 50px 0px",
  },
});
