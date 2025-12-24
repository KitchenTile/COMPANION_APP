import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { getChatMessages, sendChatMessage } from "@/api/fetchAPI";
import { ScrollView } from "react-native";
import TypingIndicator from "@/components/ui/TypingBubbleDots";
import * as Location from "expo-location";
import { isUserOnTrack } from "@/utils/locationUtils";
import { v4 as uuidv4 } from "uuid";

const ChatPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<messageInterface[]>();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentPolyline, setCurrentPolyline] = useState<string | null>(null);

  interface messageInterface {
    content: object | string;
    role: string;
    timestamp: string;
  }

  interface packetInterface {
    performative: string;
    message_id: string;
    user_id: string;
    task_id: string | null;
    chat_id: string;
    pending_tool_id: string | null;
    content: object | string;
    sender: string;
    receiver: string;
    polyline?: string;
  }

  // location effect
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function getBackgroundLocationPermisions() {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      setLocation(location);
    }

    getBackgroundLocationPermisions();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      // Initial position
      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);

      console.log(
        "initial location:",
        initialLocation.coords.latitude,
        initialLocation.coords.longitude
      );

      // Start watching
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          console.log("update:", loc.coords.latitude, loc.coords.longitude);
          setLocation(loc);
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  // check for location changes
  useEffect(() => {
    console.log("location updated");
    console.log(location?.coords.latitude, location?.coords.longitude);

    const polyline =
      "yb{yHdjj@Di@T}@FgABa@A?KAIlAKp@GRm@jJIzDLdI?jCLxBPx@P^l@b@`@NJ?hBv@pBpAj@d@`BzBl@l@lAp@h@VJC^XZBl@T^GzDgEdDiEvAaBGS@BbC{Cs@kCBFdCiDtDeGvB}DlDmHxCmHrAoDhCeIjIkXxPsf@h@cBb@sBb@_DTuCDuCEcDOsC_A{IMgCCsCDsCNuB\\sC`@uBlCsJh@oCZ{BhBgRj@oFbAeI`@mBTw@l@_BbAiBzAkBp@o@fBkArAi@dBc@xCSvBEvIAvCInD[zA]`Bg@bBaA~CqBbCgBpD_DjHaHhGaH`FeHzDgHzCeH`CeHnBaH|A{GhD_PrAaGzAsFhBeFpB{EzBoEbCkEvKwQdCkE`CuExB_FpBgFhBsFbBuFnGqUrA{EbB_FtCoHhAa@hAk@jD}B|I}HpGcGfKoLxQ}Rz@_A^Or@Ev@P\\X^l@x@bChDbLn@rBp@~B^v@\\`@dAl@|@Rz@BdAQdBw@`CwAdBoAlFyEvJcJjMwM`FyEv@m@d@S`Dk@|DeAbEoA|FeCfBy@t@KzC?pAAfASx@c@PQj@iAnF{MjFsLX{@ZeBfFm]b@eB\\}@`@o@fAeAhGuEr@c@CUj@aUECKNOc@NSHCl@s@AGHVhCyCNKvGqITW@GhIiKd@mAHLNi@B_@AgBf@gAAKDKACv@}@pJuMvAsBn@g@\\KPXXJd@KRQ\\s@PKvBMvAIb@KXeBJaAFGNy@`@gAZg@dPmJxDsBzFkCtDwA~EoDfBeA~Aa@?QA@\\C?ILA@Fl@Dl@RtDjBE`@^PJvCLtAJd@b@vA";
    const decodePolyline = require("decode-google-map-polyline");

    const decodedPolyline = decodePolyline(polyline);

    //save the current polyline
    setCurrentPolyline(decodedPolyline);

    //if we have location
    if (location?.coords.latitude !== undefined) {
      // check if user's on track
      const userOnTrack = isUserOnTrack(location, decodedPolyline);

      console.log("--- is user on track? ---");
      console.log(userOnTrack);
      console.log("------");

      if (!currentPolyline) return;

      const packet = {
        performative: "INFORM",
        message_id: uuidv4(),
        user_id: "5616b7de-165c-44a9-88a7-e2b5d2e4523c",
        task_id: taskId,
        chat_id: "f4f1cb57-c89e-4327-9a80-868c03ec7344",
        pending_tool_id: pendingToolId,
        content: {
          message: `I am currently at ${location.coords.latitude}, ${
            location.coords.longitude
          }. I have deviated from the route. Please calculate a new route to the following destination ${
            currentPolyline[currentPolyline.length - 1]
          }.`,
        },
        sender: "USER",
        receiver: "ORCHESTRATOR_AGENT",
      };

      sendPacket(packet);
    }
  }, [location]);

  //fetch data from app start
  useEffect(() => {
    async function fetchData() {
      try {
        const messages = await getChatMessages();
        setMessages(messages);
      } catch (err) {
        console.error("Failed to fetch backend message:", err);
      }
    }

    fetchData();
  }, []);

  // connect to chatId's websocket
  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8000/ws/f4f1cb57-c89e-4327-9a80-868c03ec7344`
    );

    ws.onopen = () => {
      console.log("Connected!");
      setWs(ws);
    };
    ws.onerror = (e) => {
      console.log("WebSocket Error:", e);
    };

    ws.onclose = (e) => {
      console.log("WebSocket Closed:", e.code, e.reason);
    };

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data);
      handleIncomingPacket(packet);
      console.log("packet");
      console.log(packet);
    };

    return () => ws.close();
  }, []);

  // handle info from websocket
  const handleIncomingPacket = async (packet: packetInterface) => {
    if (packet.performative === "REQUEST") {
      setPendingToolId(packet.pending_tool_id);
      setTaskId(packet.task_id);
    }

    if (packet.performative === "INFORM") {
      setPendingToolId(null);
      setTaskId(null);

      if (packet.polyline) {
        setCurrentPolyline(packet.polyline);
      }

      //and add bot message to ui before fetching
      const modelMesage = {
        role: "assistant",
        content: packet.content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => (prev ? [...prev, modelMesage] : [modelMesage]));
    }
    const messages = await getChatMessages();
    setMessages(messages);

    setLoadingMessage(false);
  };

  const sendPacket = (packet: packetInterface) => {
    if (ws) ws.send(JSON.stringify(packet));
  };

  //send HTTP request to backend with user message
  const sendMessage = async () => {
    try {
      if (userInput === "") return;
      const message = userInput;

      // add placeholder message to the chat
      const placeholderMessage = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) =>
        prev ? [...prev, placeholderMessage] : [placeholderMessage]
      );

      //set inut back to an empty string
      setUserInput("");

      //loading bubble
      setLoadingMessage(true);

      //send message to backend
      const res = await sendChatMessage({
        chat_id: "f4f1cb57-c89e-4327-9a80-868c03ec7344",
        user_id: "5616b7de-165c-44a9-88a7-e2b5d2e4523c",
        message: message,
        task_id: taskId,
        pending_tool_id: pendingToolId,
      });

      console.log(res);

      //set task id for the current "issue"
      setTaskId(res.task_id);
      if (res.pending_tool_id) {
        setPendingToolId(res.pending_tool_id);
      }

      // if we finished with the current task use, then clean state
      if (res.status === "Completed") {
        setPendingToolId(null);
        setTaskId(null);

        //and add bot message to ui before fetching
        const modelMesage = {
          role: "assistant",
          content: res.response_text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => (prev ? [...prev, modelMesage] : [modelMesage]));
        //hide bubble
        setLoadingMessage(false);
      }

      //refetch the chat data
      const messages = await getChatMessages();
      setMessages(messages);
      return;
    } catch (error) {
      console.log("error sending message: " + error);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <ScrollView
        style={{
          height: Dimensions.get("window").height * 0.7,
          width: Dimensions.get("window").width * 1,
        }}
        contentContainerStyle={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages?.map((individualMessage: messageInterface, index) => (
          <View
            style={[
              styles.messageContainer,
              individualMessage.role === "user" && styles.userMessageContainer,
            ]}
            key={index}
          >
            <Text
              style={[
                styles.message,
                individualMessage.role === "user" && styles.userMessage,
              ]}
            >
              {typeof individualMessage.content !== "object" &&
                individualMessage.content}
            </Text>
          </View>
        ))}
        {loadingMessage && (
          <View style={[styles.loadingBubble]}>
            <TypingIndicator />
          </View>
        )}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          onChangeText={setUserInput}
          value={userInput}
          placeholder="Talk to me"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.btn}>
          <Text style={styles.btnTxt}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  pageContainer: { alignItems: "center", width: "100%" },

  chatContainer: {
    display: "flex",
    padding: 0,
    marginTop: 10,
    flexDirection: "column",
    paddingInline: 10,
  },

  messageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  message: {
    marginBlock: 3,
    display: "flex",
    borderColor: "#4b5563",
    padding: 10,
    borderRadius: 10,
    width: "auto",
    maxWidth: 320,
    borderWidth: 1,
    borderStyle: "solid",
    borderTopLeftRadius: 0,
    backgroundColor: "#723feb",
    color: "white",
    fontSize: 18,
  },

  userMessageContainer: {
    justifyContent: "flex-end",
  },

  userMessage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    color: "white",
    backgroundColor: "#9777e2ff",
  },

  inputRow: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#723feb",
    borderStyle: "solid",
  },

  input: {
    height: 40,
    padding: 10,
    width: 300,
  },

  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
  },

  btnTxt: {
    fontSize: 20,
  },

  //animation
  loadingBubble: {
    marginBottom: 3,
    marginTop: 8,
    display: "flex",
    borderColor: "#4b5563",
    borderRadius: 10,
    width: 70,
    height: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderBottomLeftRadius: 0,
    backgroundColor: "#723feb",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingDot: {
    height: 10,
    width: 10,
    backgroundColor: "white",
    borderRadius: "100%",
  },
});
