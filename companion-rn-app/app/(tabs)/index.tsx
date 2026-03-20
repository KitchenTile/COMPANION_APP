// import { Image } from "expo-image";
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import * as Linking from "expo-linking";

// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { useEffect, useState } from "react";
// import React from "react";
// import * as WebBrowser from "expo-web-browser";
// import { useAuthStore } from "@/store/store";
// import {
//   FontAwesome6,
//   Ionicons,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import { supabase } from "@/supabase/supabase";
// import AuthForm from "@/components/AuthForm";
// import ProfileDashboard from "@/components/ProfileDashboard";

// WebBrowser.maybeCompleteAuthSession();

// interface Identity {
//   age: number;
//   living_status: string;
//   name: string;
// }

// interface BehavioralHistory {
//   anxiety_triggers: string;
//   navigation_errors: any;
// }

// interface ClinicalContext {
//   cognitive_load: string;
//   condition: string;
//   symptoms: any;
// }

// interface UserProfile {
//   identity: Identity;
//   behavioral_history: BehavioralHistory;
//   clinical_context: ClinicalContext;
// }

// export default function HomeScreen() {
//   const user = useAuthStore((state) => state.user);
//   const [userProfile, setUserPorfile] = useState<UserProfile | null>(null);

//   const getUserProfile = async () => {
//     if (!user) return;
//     const { data, error } = await supabase
//       .from("users")
//       .select("identity, clinical_context, behavioral_history")
//       .eq("id", user.id);
//     if (error) console.log(error);

//     if (data) setUserPorfile(data[0]);
//   };

//   useEffect(() => {
//     const sub = Linking.addEventListener("url", ({ url }) => {
//       const { queryParams } = Linking.parse(url);
//       console.log("here");

//       if (queryParams?.session) {
//         console.log("Session:", queryParams.session);
//       }
//     });

//     return () => sub.remove();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       console.log("User logged in:", user.id);
//       getUserProfile();
//     }
//   }, [user]);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={styles.pageContainer}
//     >
//       <TouchableWithoutFeedback
//         onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
//       >
//         <View style={styles.webConstraint}>
//           <ParallaxScrollView
//             headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//             headerImage={
//               <Image
//                 source={require("@/assets/images/bertha.jpg")}
//                 style={styles.reactLogo}
//               />
//             }
//           >
//             {userProfile ? (
//               <ProfileDashboard userProfile={userProfile} />
//             ) : (
//               <AuthForm />
//             )}
//           </ParallaxScrollView>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   pageContainer: {
//     backgroundColor: "rgba(255, 255, 253, 1)",
//     flex: 1,
//   },
//   webConstraint: {
//     flex: 1,
//     width: "100%",
//     maxWidth: 600,
//     alignSelf: "center",
//     backgroundColor: "rgba(255, 255, 253, 1)",
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 250,
//     width: "100%",
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
//   gmailButton: {
//     padding: 10,
//     backgroundColor: "#DE5246",
//     borderRadius: 20,
//     borderColor: "rgba(193, 49, 36, 1)",
//     borderStyle: "solid",
//     borderWidth: 1,
//   },

//   infoContainer: {
//     height: "auto",
//     width: "100%",
//     borderRadius: 20,
//     backgroundColor: "white",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#733feb48",
//     padding: 15,
//     marginBottom: 10,
//   },
//   infoTitle: {
//     fontWeight: 600,
//     fontSize: 20,
//     paddingLeft: 5,
//     color: "rgb(62,62,68)",
//   },
//   infoIcon: {
//     height: 35,
//     width: 35,
//     borderRadius: 17.5,
//     backgroundColor: "#723feb",
//     position: "absolute",
//     top: 10,
//     right: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   arrowTurn: {
//     position: "relative",
//     top: -10,
//     left: 0,
//     transform: "rotate(90deg)",
//   },

//   vitalContainer: {
//     marginTop: 20,
//     width: "auto",
//     paddingHorizontal: 10,
//     gap: 10,
//     height: 30,
//     borderRadius: 20,
//     backgroundColor: "#723feb",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//   },

//   warningSign: {
//     height: 40,
//     width: 30,
//     borderRadius: 15,
//     backgroundColor: "#723feb",
//   },

//   warningContainer: {
//     alignItems: "center",
//     flexDirection: "row",
//     borderRadius: 15,
//     borderStyle: "solid",
//     borderWidth: 2,
//     borderColor: "#723feb",
//     flex: 1,
//     paddingLeft: 10,
//     paddingRight: 10,
//     gap: 60,
//   },

//   shadow: {
//     shadowColor: "#000000b4",
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 10,
//     shadowOpacity: 0.1,
//     boxShadow: "rgba(0, 0, 0, 0.01) 0px 5px 50px 0px",
//   },

//   label: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#723feb",
//     textTransform: "uppercase",
//     marginBottom: 10,
//   },
//   subText: {
//     fontSize: 15,
//     color: "#262c35ff",
//   },
// });

import HomeView from "@/components/HomeView";
import React from "react";

export default function HomeScreen() {
  return <HomeView />;
}
