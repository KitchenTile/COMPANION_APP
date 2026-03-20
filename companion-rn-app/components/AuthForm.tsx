import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import React from "react";
import { useAuthStore } from "@/store/store";

export default function AuthForm() {
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

  const singUpFunction = async () => {
    // if the input fields are empty, return
    if (email === "" || password === "" || name === "") return;
    // sign up and log in
    await signUp(name, email, password);
    await login(email, password);
  };

  const logInFunction = async () => {
    // if the input fields are empty, return
    if (email === "" || password === "") return;
    console.log(`logging in ${email}`);
    //log in
    await login(email, password);
  };

  return (
    <ThemedView>
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
        <ThemedView>
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
        </ThemedView>
        <TouchableOpacity
          style={styles.loginSignupButton}
          onPress={loginState ? logInFunction : singUpFunction}
        >
          <ThemedText
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 20,
            }}
          >
            {loginState ? "Log In" : "Sign Up"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 15,
    width: "100%",
  },
  //   stepContainer: {
  //     gap: 8,
  //     marginBottom: 8,
  //   },

  //   gmailButton: {
  //     padding: 10,
  //     backgroundColor: "#DE5246",
  //     borderRadius: 20,
  //     borderColor: "rgba(193, 49, 36, 1)",
  //     borderStyle: "solid",
  //     borderWidth: 1,
  //   },

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
