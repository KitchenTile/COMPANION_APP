import React from "react";
import { View, StyleSheet } from "react-native";

// We will create these two components next!
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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

export default function ProfileDashboard({ userProfile }: any) {
  return (
    <ThemedView style={{ marginTop: 10, gap: 12 }}>
      <ThemedText type="title">
        {userProfile.identity.name}'s Profile
      </ThemedText>
      <ThemedView style={[styles.infoContainer, styles.shadow]}>
        <View style={styles.infoIcon}>
          <MaterialCommunityIcons
            name="account-details"
            size={20}
            color="white"
          />
        </View>
        <ThemedView>
          <ThemedText style={styles.label} type="title">
            General Info
          </ThemedText>
          <ThemedText style={styles.subText}>
            Name: {userProfile.identity.name}
          </ThemedText>
          <ThemedText style={styles.subText}>
            Status: {userProfile.identity.living_status}
          </ThemedText>
          <ThemedText style={styles.subText}>
            Age: {userProfile.identity.age} years old
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.infoContainer, styles.shadow]}>
        <View style={styles.infoIcon}>
          <Ionicons name="medical" size={20} color="white" />
        </View>
        <ThemedView>
          <ThemedText style={styles.label} type="title">
            Clinical Context
          </ThemedText>
          <ThemedText style={styles.subText}>
            Condition: {userProfile.clinical_context.condition}
          </ThemedText>
          <ThemedText style={styles.subText}>
            Congnitive Load: {userProfile.clinical_context.cognitive_load}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.infoContainer, styles.shadow]}>
        <View style={styles.infoIcon}>
          <MaterialCommunityIcons name="brain" size={20} color="white" />
        </View>
        <ThemedView>
          <ThemedText style={styles.label} type="title">
            Behavioral History
          </ThemedText>
          <ThemedText style={styles.subText}>
            Anxiety Triggers: {userProfile.behavioral_history.anxiety_triggers}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    height: "auto",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#733feb48",
    padding: 15,
    marginBottom: 10,
  },
  infoTitle: {
    fontWeight: 600,
    fontSize: 20,
    paddingLeft: 5,
    color: "rgb(62,62,68)",
  },
  infoIcon: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    backgroundColor: "#723feb",
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  shadow: {
    shadowColor: "#000000b4",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    boxShadow: "rgba(0, 0, 0, 0.01) 0px 5px 50px 0px",
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#723feb",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  subText: {
    fontSize: 15,
    color: "#262c35ff",
  },
});
