import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "@/store/store";
import React, { useState } from "react";

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
    <ThemedView style={styles.formCard}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          {loginState ? "Log In" : "Create Account"}
        </ThemedText>
        <TouchableOpacity onPress={() => setLoginState(!loginState)}>
          <ThemedText style={styles.toggleText}>
            {loginState
              ? "Need an account? Sign up"
              : "Already have one? Log in"}
          </ThemedText>
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
        <View style={styles.line} />
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
  formCard: {
    backgroundColor: "#ffffff",
    padding: 40,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "#b3b3b36e",
    width: "100%",
    gap: 10,
  },
  titleContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
  },
  toggleText: {
    color: "#723feb",
    marginTop: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ffffffff",
    color: "#1E293B",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#733feb6e",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 14,
  },
  loginSignupButton: {
    padding: 16,
    backgroundColor: "#723feb",
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  line: {
    height: 2,
    width: "80%",
    backgroundColor: "#b3b3b36e",
    alignSelf: "center",
    marginVertical: 5,
  },
});
