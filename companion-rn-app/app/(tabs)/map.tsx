import React, { useEffect, useState } from "react";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import { StyleSheet, View } from "react-native";
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

export default function App() {
  //TODO:
  // this file is a placeholder for what it will look like/what functionality it will have in the future.
  // Need to fix global state polyline,
  // Need to get the step polylines together into an array of arrays of decodedPoints to replace the placeholder
  // Need to get rid of user marker in the middle of the polyline for the actual user's location (uncomment the user's location)
  // Need to create components for info pannel
  // Need to place the actual user's location in relation to the route line
  // Need to add more colours for potential extra polylines
  // General fixes and improvements in style

  const user = useAuthStore((state) => state.user);
  // const polyline = useAuthStore((state) => state.polyline);
  //location
  const location = useLocationTracker();
  const [currentPolylineIndex, setCurrentPolylineIndex] = useState<number>(1);

  // useEffect(() => {
  //   console.log("new polyline:");
  //   console.log(polyline);
  // }, [polyline]);
  const polylines = [
    [
      { lat: 51.56601, lng: -0.22548 },
      { lat: 51.56608, lng: -0.22553 },
      { lat: 51.56598, lng: -0.22574 },
      { lat: 51.56613, lng: -0.22592 },
      { lat: 51.56667, lng: -0.22671 },
      { lat: 51.56668, lng: -0.22669 },
      { lat: 51.56672, lng: -0.22662 },
      { lat: 51.56695, lng: -0.22698 },
      { lat: 51.56701, lng: -0.22715 },
      { lat: 51.56749, lng: -0.228 },
      { lat: 51.56801, lng: -0.2287 },
    ],
    [
      { lat: 51.5682, lng: -0.22893 },
      { lat: 51.56824, lng: -0.22912 },
      { lat: 51.57, lng: -0.23128 },
      { lat: 51.57015, lng: -0.23138 },
      { lat: 51.57041, lng: -0.23143 },
      { lat: 51.57062, lng: -0.23147 },
      { lat: 51.57075, lng: -0.23159 },
      { lat: 51.57087, lng: -0.23183 },
      { lat: 51.57092, lng: -0.23202 },
      { lat: 51.571, lng: -0.23216 },
      { lat: 51.57114, lng: -0.23223 },
      { lat: 51.57125, lng: -0.23222 },
      { lat: 51.57135, lng: -0.23214 },
      { lat: 51.57142, lng: -0.232 },
      { lat: 51.57148, lng: -0.23176 },
      { lat: 51.57148, lng: -0.2317 },
      { lat: 51.57152, lng: -0.23155 },
      // { lat: 51.57158, lng: -0.23117 },
      // { lat: 51.57195, lng: -0.2304 },
      // { lat: 51.57215, lng: -0.23026 },
      // { lat: 51.57234, lng: -0.2304 },
      // { lat: 51.57256, lng: -0.23046 },
      // { lat: 51.57274, lng: -0.2304 },
      // { lat: 51.5729, lng: -0.23027 },
      // { lat: 51.57304, lng: -0.23 },
      // { lat: 51.57309, lng: -0.22983 },
      // { lat: 51.57313, lng: -0.22953 },
      // { lat: 51.57298, lng: -0.22794 },
      // { lat: 51.57297, lng: -0.22744 },
      { lat: 51.57294, lng: -0.22699 },
      { lat: 51.57296, lng: -0.22667 },
      { lat: 51.57308, lng: -0.22581 },
      { lat: 51.57317, lng: -0.22574 },
      { lat: 51.57322, lng: -0.22552 },
      { lat: 51.5733, lng: -0.22499 },
      { lat: 51.5734, lng: -0.22464 },
      { lat: 51.57348, lng: -0.2247 },
      { lat: 51.5734, lng: -0.22464 },
      { lat: 51.57349, lng: -0.22443 },
      { lat: 51.57366, lng: -0.22427 },
      { lat: 51.57389, lng: -0.22417 },
      { lat: 51.574, lng: -0.22414 },
      { lat: 51.57491, lng: -0.22466 },
      { lat: 51.57523, lng: -0.22351 },
      { lat: 51.5753, lng: -0.22326 },
      { lat: 51.57545, lng: -0.22332 },
      { lat: 51.57549, lng: -0.22336 },
      // { lat: 51.57563, lng: -0.22339 },
      // { lat: 51.5757, lng: -0.22332 },
      // { lat: 51.57575, lng: -0.22318 },
      // { lat: 51.57583, lng: -0.22288 },
      // { lat: 51.57582, lng: -0.22279 },
      // { lat: 51.5757, lng: -0.22266 },
      // { lat: 51.57553, lng: -0.2225 },
      // { lat: 51.57573, lng: -0.22175 },
      // { lat: 51.57577, lng: -0.2217 },
      // { lat: 51.57595, lng: -0.22112 },
      { lat: 51.57619, lng: -0.22058 },
      { lat: 51.57624, lng: -0.22049 },
      { lat: 51.57626, lng: -0.2204 },
      { lat: 51.57636, lng: -0.22026 },
      { lat: 51.57637, lng: -0.2202 },
      { lat: 51.57658, lng: -0.22007 },
      { lat: 51.57701, lng: -0.21994 },
      { lat: 51.57734, lng: -0.21974 },
      { lat: 51.57774, lng: -0.21944 },
      { lat: 51.57781, lng: -0.21933 },
      { lat: 51.57784, lng: -0.21915 },
      { lat: 51.57783, lng: -0.21904 },
      { lat: 51.57787, lng: -0.21887 },
      { lat: 51.57793, lng: -0.21879 },
      { lat: 51.57802, lng: -0.21871 },
      { lat: 51.57807, lng: -0.2186 },
      { lat: 51.57807, lng: -0.21841 },
      { lat: 51.57798, lng: -0.21814 },
      { lat: 51.57791, lng: -0.21807 },
      { lat: 51.5778, lng: -0.21811 },
      { lat: 51.57775, lng: -0.21817 },
      { lat: 51.57759, lng: -0.21808 },
      { lat: 51.57738, lng: -0.21772 },
      { lat: 51.57735, lng: -0.21761 },
      { lat: 51.57769, lng: -0.21677 },
      { lat: 51.5777, lng: -0.21647 },
      { lat: 51.57807, lng: -0.21562 },
    ],
    [
      { lat: 51.57854, lng: -0.21478 },
      { lat: 51.57917, lng: -0.21398 },
      { lat: 51.57971, lng: -0.21341 },
      { lat: 51.58047, lng: -0.21268 },
      { lat: 51.58113, lng: -0.212 },
      { lat: 51.5816, lng: -0.21164 },
      { lat: 51.582, lng: -0.21144 },
      { lat: 51.58342, lng: -0.21113 },
      { lat: 51.5839, lng: -0.21091 },
      { lat: 51.58634, lng: -0.20964 },
      { lat: 51.58703, lng: -0.20914 },
      { lat: 51.58611, lng: -0.20792 },
      { lat: 51.58606, lng: -0.20726 },
      { lat: 51.58605, lng: -0.2071 },
    ],
  ];

  const calculateRouteLengths = (
    polylines: { lat: number; lng: number }[][]
  ) => {
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

  const colours = [
    "rgba(245, 238, 5, $)",
    "rgba(236, 61, 122, $)",
    "rgba(114, 63, 235, $)",
  ];

  const mapCoordinates = polylines?.map((polyline) => {
    return polyline.map((point) => ({
      latitude: point.lat,
      longitude: point.lng,
    }));
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.coords.latitude : 51.589406650777185,
          longitude: location ? location.coords.longitude : -0.2282378655814923,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          coordinate={{
            // latitude: location ? location.coords.latitude : 51.589406650777185,
            // longitude: location
            //   ? location.coords.longitude
            //   : -0.2282378655814923,
            latitude: 51.57583,
            longitude: -0.22288,
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
        {mapCoordinates.map((polyline, index) => (
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
              Step 2 of 3
            </ThemedText>
          </ThemedView>
          <View style={styles.routeTracker}>
            <View style={styles.lineCotainer}>
              <View style={{ position: "absolute", top: -13, left: -30 }}>
                <FontAwesome name="hospital-o" size={24} color="#723feb" />
              </View>
              {polylinePercentages.map((line, index) => (
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
              <View style={{ position: "absolute", top: "-350%", left: "55%" }}>
                <View style={{ position: "absolute" }}>
                  <FontAwesome5 name="map-marker" size={25} color="#280079ff" />
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
                Get ready, getting off in 5 stops
              </ThemedText>
              <AntDesign name="sound" size={20} color="black" />
            </View>
          </View>
        </ThemedView>
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
