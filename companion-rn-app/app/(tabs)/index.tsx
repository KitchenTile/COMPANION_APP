import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Linking from "expo-linking";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuthStore } from "@/store/store";
import { fetchChat } from "@/api/fetchAPI";
import { PostgrestError } from "@supabase/supabase-js";
import { Chat } from "@/utils/types";

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  // imports from store
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((store) => store.logout);
  const signUp = useAuthStore((state) => state.signUp);
  const user = useAuthStore((state) => state.user);

  // auth state
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const openGoogleLink = async () => {
    // if there's no user id, retrurn
    if (!user?.id) return;
    await WebBrowser.openAuthSessionAsync(
      `http://localhost:8000/gmailLogin?user_id=${user.id}`,
      "aicompanion://auth"
    );
  };

  useEffect(() => {
    if (!user) return;
    console.log("user id");
    console.log(user.id);
  }, [user]);

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      const { queryParams } = Linking.parse(url);
      console.log("here");

      if (queryParams?.session) {
        console.log("Session:", queryParams.session);
        // exchange with backend here
      }
    });

    return () => sub.remove();
  }, []);

  const singUpFunction = async () => {
    // if the input fields are empty, return
    if (email === "" || password === "" || name === "") return;
    // sign up and log in
    await signUp(email, password, name);
    await login(email, password);
  };

  const logInFunction = async () => {
    // if the input fields are empty, return
    if (email === "" || password === "") return;
    //log in
    await login(email, password);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      {user ? (
        <ThemedView>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">
              Welcome, {user.user_metadata.full_name}
            </ThemedText>
            <HelloWave />
          </ThemedView>
          <ThemedView>
            <TouchableOpacity style={styles.loginSignupButton} onPress={logout}>
              <ThemedText
                style={{ color: "white", textAlign: "center", fontSize: 20 }}
              >
                Log Out
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ) : (
        <View>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">
              {loginState ? "Log In" : "Sign Up"}
            </ThemedText>
            <TouchableOpacity onPress={() => setLoginState(!loginState)}>
              <ThemedText>{loginState ? "Or sign up" : "Or log in"}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView>
            {!loginState && (
              <TextInput
                value={name}
                placeholder="Full Name"
                placeholderTextColor="#000000ff"
                autoCapitalize="none"
                onChangeText={setName}
                style={styles.input}
              />
            )}
            <View>
              <TextInput
                value={email}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#000000ff"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                value={password}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#000000ff"
                autoCapitalize="none"
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              style={styles.loginSignupButton}
              onPress={loginState ? logInFunction : singUpFunction}
            >
              <ThemedText
                style={{ color: "white", textAlign: "center", fontSize: 20 }}
              >
                {loginState ? "Log In" : "Sign Up"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      )}

      <TouchableOpacity style={styles.gmailButton} onPress={openGoogleLink}>
        <ThemedText
          style={{ color: "white", textAlign: "center", fontSize: 20 }}
        >
          Link Gmail
        </ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  gmailButton: {
    padding: 10,
    backgroundColor: "#DE5246",
    borderRadius: 20,
    borderColor: "rgba(193, 49, 36, 1)",
    borderStyle: "solid",
    borderWidth: 1,
  },

  loginSignupButton: {
    padding: 10,
    backgroundColor: "#DE5246",
    borderRadius: 20,
    borderColor: "rgba(193, 49, 36, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    margin: 3,
  },

  input: {
    backgroundColor: "#ffffffff",
    color: "#1E293B",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#1E293B",
    borderStyle: "solid",
    borderWidth: 2,
  },
});
