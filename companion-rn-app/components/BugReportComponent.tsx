import React, { useEffect, useMemo, useState } from "react";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
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
import { useAudioPlayer } from "expo-audio";
import { Dimensions } from "react-native";
import ContentModal from "./ContentModal";

interface ArrivalModalProps {
  visible: boolean;
  onClose: () => void;
  iconName: string;
}

export default function BugReportComponent({
  visible,
  onClose,
  iconName,
}: ArrivalModalProps) {
  const [value, onChangeText] = useState("Please be descriptive about the bug");
  const user = useAuthStore((state) => state.user);

  const submitBug = () => {
    return;
  };
  return (
    <ContentModal
      visible={visible}
      onClose={onClose}
      buttonText="Submit"
      onButtonPress={() => {}}
      iconName={iconName}
    >
      <ThemedText type="title" style={styles.title}>
        Any issues?
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Please let me know if there were any troubles with the app during your
        trip!
      </ThemedText>
      <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={(text) => onChangeText(text)}
        value={value}
        style={styles.textInput}
      />
    </ContentModal>
  );
}

const styles = StyleSheet.create({
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
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#723feb",
    minWidth: "100%",
    minHeight: "20%",
    marginBottom: 12,
    borderRadius: 15,
  },
});
