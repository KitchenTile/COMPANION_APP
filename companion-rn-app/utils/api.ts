import { Platform } from "react-native";

export const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000/api"
    : "http://http://34.227.7.88:8000";
// `https://isaac-preadditional-tirelessly.ngrok-free.dev`;

export const WS_URL = baseURL
  .replace("https://", "wss://")
  .replace("http://", "ws://");
