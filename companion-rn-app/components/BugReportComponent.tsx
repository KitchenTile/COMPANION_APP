import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { useAuthStore } from "@/store/store";
import { ThemedText } from "@/components/ThemedText";
import ContentModal from "./ContentModal";
import { supabase } from "@/supabase/supabase";

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
  const [bugText, setBugText] = useState("");
  const user = useAuthStore((state) => state.user);

  const submitBug = async () => {
    if (!user) return;
    const { error } = await supabase.from("bug_report").insert({
      bug: bugText,
      user_id: user.id,
    });

    if (error) {
      console.log(error);
    } else {
      setBugText("");
      onClose();
    }
  };
  return (
    <ContentModal
      visible={visible}
      onClose={onClose}
      buttonText="Submit"
      onButtonPress={submitBug}
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
        onChangeText={(text) => setBugText(text)}
        value={bugText}
        placeholder="Please be descriptive about the bug"
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
