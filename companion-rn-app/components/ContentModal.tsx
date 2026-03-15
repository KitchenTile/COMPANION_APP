import React, { Children } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";

interface ArrivalModalProps {
  visible: boolean;
  onClose: () => void;
  buttonText: string;
  onButtonPress: () => void;
  children: any;
  iconName: string;
}

const ContentModal = ({
  visible,
  onClose,
  buttonText,
  onButtonPress,
  children,
  iconName,
}: ArrivalModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modalContainer, styles.shadow]}>
          <TouchableOpacity style={styles.crossIcon} onPress={onClose}>
            <FontAwesome6 name="window-close" size={25} color="black" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <FontAwesome6 name={iconName} size={40} color="white" />
          </View>
          {children}
          <TouchableOpacity style={styles.button} onPress={onButtonPress}>
            <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default ContentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#733feb48",
  },
  iconContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#723feb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#723feb",
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  shadow: {
    shadowColor: "#000000b4",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 5,
  },

  crossIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 10,
  },
});
