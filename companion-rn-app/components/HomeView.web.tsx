import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useAuthStore } from "@/store/store";
import { supabase } from "@/supabase/supabase";

// We will create these two components next!
import AuthForm from "./AuthForm";
import ProfileDashboard from "./ProfileDashboard";
import { ThemedText } from "./ThemedText";

WebBrowser.maybeCompleteAuthSession();

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

  WebBrowser.maybeCompleteAuthSession();

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
    <View style={styles.pageContainer}>
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollPadding}
      >
        <View style={styles.webConstraint}>
          {userProfile ? (
            <>
              <View style={styles.header}>
                <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
                <ThemedText type="title" style={styles.pageTitle}>
                  {userProfile.identity.name}
                </ThemedText>
              </View>
              <ProfileDashboard userProfile={userProfile} />
            </>
          ) : (
            <AuthForm />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 253, 1)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  webConstraint: {
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
  },

  mainContent: {
    flex: 1,
  },
  scrollPadding: {
    padding: 40,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 18,
    color: "#64748B",
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 36,
    color: "#1E293B",
    fontWeight: "bold",
  },
});
