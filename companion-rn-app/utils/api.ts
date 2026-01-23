import { Platform } from "react-native";

export const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000/api"
    : // : "http://192.168.1.28:8000";
      `https://isaac-preadditional-tirelessly.ngrok-free.dev`;

export const WS_URL = baseURL
  .replace("https://", "wss://")
  .replace("http://", "ws://");
