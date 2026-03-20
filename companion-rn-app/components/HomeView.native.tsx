import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useAuthStore } from "@/store/store";
import { supabase } from "@/supabase/supabase";

// We will create these two components next!
import AuthForm from "./AuthForm";
import ProfileDashboard from "./ProfileDashboard";
import ParallaxScrollView from "./ParallaxScrollView";

export interface UserProfile {
  identity: {
    age: number;
    living_status: string;
    name: string;
  };
  behavioral_history: {
    anxiety_triggers: string;
    navigation_errors: any;
  };
  clinical_context: {
    cognitive_load: string;
    condition: string;
    symptoms: any;
  };
}

export default function HomeView() {
  const user = useAuthStore((state) => state.user);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      const { queryParams } = Linking.parse(url);
      if (queryParams?.session) {
        console.log("Session:", queryParams.session);
      }
    });
    return () => sub.remove();
  }, []);

  const getUserProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("users")
      .select("identity, clinical_context, behavioral_history")
      .eq("id", user.id);

    if (error) console.log(error);
    if (data) setUserProfile(data[0]);
  };

  useEffect(() => {
    if (user) {
      getUserProfile();
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.pageContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
          headerImage={
            <Image
              source={require("@/assets/images/bertha.jpg")}
              style={styles.reactLogo}
            />
          }
        >
          {userProfile ? (
            <ProfileDashboard userProfile={userProfile} />
          ) : (
            <AuthForm />
          )}
        </ParallaxScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 253, 1)",
  },

  reactLogo: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
