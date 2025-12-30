import { Image } from "expo-image";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Linking from "expo-linking";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { getGmailLogin } from "@/api/fetchAPI";

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // const fetchStuff = async () => {
    //   try {
    //     const response = await fetch("http://localhost:8000/api/posts/", {
    //       method: "GET",
    //       headers: {
    //         // Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch channels :(");
    //     }
    //     const data = await response.json();
    //     console.log(data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchStuff();
  });

  const openGoogleLink = async () => {
    // Linking.openURL("http://localhost:8000/gmailLogin");
    await WebBrowser.openAuthSessionAsync(
      "http://localhost:8000/gmailLogin",
      "aicompanion://auth"
    );
    setReady(true);
  };

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      const { queryParams } = Linking.parse(url);
      console.log("here");

      if (queryParams?.session) {
        console.log("Session:", queryParams.session);
        // exchange with backend here
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView>
        <TouchableOpacity style={styles.gmailButton} onPress={openGoogleLink}>
          <ThemedText
            style={{ color: "white", textAlign: "center", fontSize: 20 }}
          >
            Link Gmail
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  gmailButton: {
    padding: 10,
    backgroundColor: "#DE5246",
    borderRadius: 20,
    borderColor: "rgba(193, 49, 36, 1)",
    borderStyle: "solid",
    borderWidth: 1,
  },
});
