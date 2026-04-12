import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { colours } from "@/constants/Colors";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface JourneyInformationComponentProps {
  screenWidth: number;
  polylines: { lat: number; lng: number }[][] | null;
  currentPolylineIndex: number;
  polylinePercentages: number[] | undefined;
  userProgressPercentage: number;
  currentActionText: string;
  playStepAudio: () => Promise<void>;
}

export default function JourneyInformationComponent({
  screenWidth,
  polylines,
  currentPolylineIndex,
  polylinePercentages,
  userProgressPercentage,
  currentActionText,
  playStepAudio,
}: JourneyInformationComponentProps) {
  if (!polylines || polylines.length === 0) return null;

  return (
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
        <ThemedText style={{ color: "#723feb", fontWeight: "600" }}>
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
              <FontAwesome5 name="map-marker" size={25} color="#280079ff" />
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
              fontWeight: "600",
              textAlign: "center",
              alignItems: "center",
              lineHeight: 40,
            }}
          >
            !
          </ThemedText>
        </View>
        <View style={[styles.warningContainer, styles.shadow]}>
          <ThemedText style={{ fontWeight: "600", fontSize: 17 }}>
            {currentActionText}
          </ThemedText>
          <TouchableOpacity onPress={playStepAudio}>
            <AntDesign name="sound" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
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
  },
});
