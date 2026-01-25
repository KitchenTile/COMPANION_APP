import { Image } from "expo-image";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import { ScrollView } from "react-native";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  //TODO:
  // huge file
  // currently not connected to any real data
  // implement device vitals
  //

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
    console.log(`logging in ${email}`);
    //log in
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.pageContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
          headerImage={
            <Image
              source={require("@/assets/images/bertha.jpg")}
              style={styles.reactLogo}
            />
          }
        >
          {user ? (
            <ThemedView>
              <ThemedView style={[styles.titleContainer, { gap: 80 }]}>
                <ThemedText type="title">
                  {user.user_metadata.full_name}'s Dashboard
                </ThemedText>
                <FontAwesome6 name="circle-info" size={32} color="#723feb" />
              </ThemedView>
              <ThemedView style={[styles.infoContainer, styles.shadow]}>
                <ThemedText style={styles.infoTitle}>
                  Your appointments for the week
                </ThemedText>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginLeft: 20,
                    marginTop: 15,
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <ThemedView style={styles.arrowTurn}>
                    <FontAwesome6
                      name="arrow-turn-up"
                      size={24}
                      color="black"
                    />
                  </ThemedView>
                  <View
                    style={{
                      backgroundColor: "#e2e2e2ff",
                      alignItems: "center",
                      borderRadius: 20,
                      padding: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#029802ff",
                        }}
                      />
                      <ThemedText style={{ fontWeight: 600 }}>
                        General appointment with Dr. Martins
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 20,
                        paddingLeft: 30,
                        justifyContent: "space-between",
                      }}
                    >
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Status: Confirmed
                      </ThemedText>
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Tuesday 10:00 AM
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginLeft: 20,
                    marginTop: 5,
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <ThemedView style={styles.arrowTurn}>
                    <FontAwesome6
                      name="arrow-turn-up"
                      size={24}
                      color="black"
                    />
                  </ThemedView>
                  <View
                    style={{
                      backgroundColor: "#e2e2e2ff",
                      alignItems: "center",
                      borderRadius: 20,
                      padding: 5,
                      paddingHorizontal: 10,
                      width: "90%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#029802ff",
                        }}
                      />
                      <ThemedText style={{ fontWeight: 600 }}>
                        Optician appointment
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 30,
                        paddingLeft: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Status: Confirmed
                      </ThemedText>
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Friday 11:00 AM
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginLeft: 20,
                    marginTop: 5,
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <ThemedView style={styles.arrowTurn}>
                    <FontAwesome6
                      name="arrow-turn-up"
                      size={24}
                      color="black"
                    />
                  </ThemedView>
                  <View
                    style={{
                      backgroundColor: "#e2e2e2ff",
                      alignItems: "center",
                      borderRadius: 20,
                      padding: 5,
                      paddingHorizontal: 10,
                      width: "90%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#ee2a2aff",
                        }}
                      />
                      <ThemedText style={{ fontWeight: 600 }}>
                        Dental appointment with Dr. Lee
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 30,
                        paddingLeft: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Status: Cancelled
                      </ThemedText>
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Friday 12:00 PM
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginLeft: 20,
                    marginTop: 5,
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <ThemedView style={styles.arrowTurn}>
                    <FontAwesome6
                      name="arrow-turn-up"
                      size={24}
                      color="black"
                    />
                  </ThemedView>
                  <View
                    style={{
                      backgroundColor: "#e2e2e2ff",
                      alignItems: "center",
                      borderRadius: 20,
                      padding: 5,
                      paddingHorizontal: 10,
                      width: "90%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#fbff00ff",
                        }}
                      />
                      <ThemedText style={{ fontWeight: 600 }}>
                        Councelling with Dr. Stephens
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 30,
                        paddingLeft: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Status: Conflicting
                      </ThemedText>
                      <ThemedText style={{ fontWeight: 600, fontSize: 14 }}>
                        Friday 12:00 PM
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar" size={20} color="white" />
                </View>
              </ThemedView>
              <ThemedView style={[styles.infoContainer, styles.shadow]}>
                <ThemedText style={styles.infoTitle}>Device Vitals</ThemedText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <View style={styles.vitalContainer}>
                    <FontAwesome6 name="battery-half" size={22} color="white" />
                    <ThemedText style={{ fontWeight: 600, color: "white" }}>
                      76%
                    </ThemedText>
                  </View>
                  <View style={styles.vitalContainer}>
                    <FontAwesome6 name="signal" size={16} color="white" />
                    <ThemedText style={{ fontWeight: 600, color: "white" }}>
                      4G
                    </ThemedText>
                  </View>
                  <View style={styles.vitalContainer}>
                    <FontAwesome6 name="wifi" size={16} color="white" />
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#029802ff",
                      }}
                    />
                  </View>
                  <View style={styles.vitalContainer}>
                    <FontAwesome6 name="volume-high" size={16} color="white" />
                  </View>
                </View>
                <View style={styles.infoIcon}>
                  <Ionicons name="pulse-outline" size={20} color="white" />
                </View>
              </ThemedView>
              <ThemedView style={[styles.infoContainer, styles.shadow]}>
                <ThemedText style={styles.infoTitle}>
                  Upcoming reminders
                </ThemedText>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    gap: 10,
                  }}
                >
                  <View style={[styles.warningSign, styles.shadow]}>
                    <ThemedText
                      style={{
                        fontSize: 30,
                        fontWeight: 600,
                        textAlign: "center",
                        alignItems: "center",
                        lineHeight: 45,
                        color: "white",
                      }}
                    >
                      !
                    </ThemedText>
                  </View>
                  <View style={styles.warningContainer}>
                    <ThemedText style={{ fontWeight: 600, fontSize: 17 }}>
                      Remember to get the clothes off thene
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.infoIcon}>
                  <MaterialCommunityIcons
                    name="reminder"
                    size={20}
                    color="white"
                  />
                </View>
              </ThemedView>
              {/* <ThemedView>
                  <TouchableOpacity
                    style={styles.loginSignupButton}
                    onPress={logout}
                  >
                    <ThemedText
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 20,
                      }}
                    >
                      Log Out
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView> */}
            </ThemedView>
          ) : (
            <ThemedView>
              <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">
                  {loginState ? "Log In" : "Sign Up"}
                </ThemedText>
                <TouchableOpacity onPress={() => setLoginState(!loginState)}>
                  <ThemedText>
                    {loginState ? "Or sign up" : "Or log in"}
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
          )}

          {/* <TouchableOpacity style={styles.gmailButton} onPress={openGoogleLink}>
            <ThemedText
              style={{ color: "white", textAlign: "center", fontSize: 20 }}
            >
              Link Gmail
            </ThemedText>
          </TouchableOpacity> */}
        </ParallaxScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "rgba(255, 255, 253, 1)",
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 15,
    width: "100%",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: 400,
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
  infoContainer: {
    height: "auto",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#733feb48",
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontWeight: 600,
    fontSize: 20,
    paddingLeft: 5,
    color: "rgb(62,62,68)",
  },
  infoIcon: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    backgroundColor: "#723feb",
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowTurn: {
    position: "relative",
    top: -10,
    left: 0,
    transform: "rotate(90deg)",
  },

  vitalContainer: {
    marginTop: 20,
    width: "auto",
    paddingHorizontal: 10,
    gap: 10,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#723feb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  warningSign: {
    height: 40,
    width: 30,
    borderRadius: 15,
    backgroundColor: "#723feb",
  },

  warningContainer: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#723feb",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 60,
  },

  shadow: {
    shadowColor: "#000000b4",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    boxShadow: "rgba(0, 0, 0, 0.01) 0px 5px 50px 0px",
  },
});
