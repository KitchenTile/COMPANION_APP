import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet } from "react-native";
import ContentModal from "./ContentModal";

interface UserLostProps {
  visible: boolean;
  onClose: () => void;
  iconName: string;
  handleDerail: () => void;
}

export default function UserLostComponent({
  visible,
  onClose,
  iconName,
  handleDerail,
}: UserLostProps) {
  return (
    <ContentModal
      visible={visible}
      onClose={onClose}
      buttonText="Yes, recalculate route"
      onButtonPress={handleDerail}
      iconName={iconName}
    >
      <ThemedText type="title" style={styles.title}>
        Are you lost?
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Your location shows you are going in the wrong direction. Would you like
        your route to be recalculated?
      </ThemedText>
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
