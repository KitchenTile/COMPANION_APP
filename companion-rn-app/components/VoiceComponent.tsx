import React, { useEffect } from "react";
import { ThemedView } from "./ThemedView";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import TypingIndicator from "./ui/TypingBubbleDots";

const VoiceComponentView = ({
  isTalking,
  onMicPress,
  onPausePress,
  onToggleChat,
  chatVisible,
  loadingBubble,
}: {
  isTalking: boolean;
  onMicPress: () => void;
  onPausePress: () => void;
  onToggleChat: () => void;
  chatVisible: boolean;
  loadingBubble: boolean;
}) => {
  useEffect(() => {
    console.log(isTalking);
  }, [isTalking]);
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={() => (isTalking ? onPausePress() : onMicPress())}
        style={[
          styles.micButton,
          {
            backgroundColor: isTalking ? "#ff4444" : "#723feb",
            opacity: chatVisible ? 0 : 1,
          },
        ]}
      >
        {loadingBubble ? (
          <TypingIndicator />
        ) : (
          <FontAwesome6
            name={isTalking ? "pause" : "microphone"}
            size={40}
            color="white"
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggleChat} style={styles.chatVisibleButton}>
        {chatVisible ? (
          <FontAwesome6 name="microphone" size={24} color="white" />
        ) : (
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={30}
            color="white"
          />
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};

export default VoiceComponentView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  micButton: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  chatVisibleButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#723feb",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 120,
    zIndex: 10,
  },
});
