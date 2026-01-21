import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChat,
  getChatMessages,
  sendAudio,
  sendChatMessage,
} from "@/api/fetchAPI";
import { ScrollView } from "react-native";
import TypingIndicator from "@/components/ui/TypingBubbleDots";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  Chat,
  DecodedPoint,
  messageInterface,
  packetInterface,
} from "@/utils/types";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useChatWebsocket } from "@/hooks/useChatWebSocket";
import { useRouteMonitor } from "@/hooks/useRouteMonitor";
import { useAuthStore } from "@/store/store";
import { PostgrestError } from "@supabase/supabase-js";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer,
} from "expo-audio";
import VoiceComponentView from "@/components/VoiceComponent";
import { ThemedView } from "@/components/ThemedView";

const ChatPage = () => {
  // user from store
  const user = useAuthStore((state) => state.user);

  const [chatVisible, setChatVisible] = useState<boolean>(false);

  const [isTalking, setIsTalking] = useState<boolean>(false);

  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const [userInput, setUserInput] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const player = useAudioPlayer(audioUri);

  //location manager hook
  const location = useLocationTracker();

  useEffect(() => {
    if (!user) return;

    //fetch chats
    const fetchUserChats = async (userId: string) => {
      const chats: Chat[] | undefined | PostgrestError = await fetchChat(
        user.id
      );

      if (!Array.isArray(chats) || chats.length === 0) return;

      // if chats is a array set state
      setChats(chats);
      setChatId(chats[0].chat_id);
      console.log(userId, chatId);
      console.log(chatId);
      console.log(userId);
    };

    fetchUserChats(user.id);
  }, [user]);

  useEffect(() => {
    console.log("AUDIO URI CHANGED:");
    console.log(audioUri);
    player.play();
  }, [audioUri]);

  //fetch data when chat id changes
  useEffect(() => {
    async function fetchData() {
      try {
        if (!chatId || !user) return;
        const messages = await getChatMessages(user.id, chatId);

        //set messages to display
        setMessages(messages);
      } catch (err) {
        console.error("Failed to fetch backend message:", err);
      }
    }

    fetchData();
  }, [chatId, user]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => {
    console.log("Recording state changed:", recorderState.isRecording);
    recorderState.isRecording === false && console.log(recorderState);
  }, [recorderState.isRecording]);

  // record audio function
  const record = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (e) {
      console.error("Failed to start recording", e);
    }
    // setIsTalking(true);
  };

  // stop recording audio function
  const stopRecording = async () => {
    await audioRecorder.stop();
    sendMessage("audio");
    // setIsTalking(false);
    // console.log("stop recording");
  };

  // handle info from websocket
  const handleIncomingPacket = async (packet: packetInterface) => {
    if (!user || !chatId) return;
    if (packet.performative === "REQUEST") {
      setPendingToolId(packet.pending_tool_id);
      setTaskId(packet.task_id);
      console.log("WE GOT HERE");
      console.log(packet.content.audio_url);
      setAudioUri(packet.content.audio_url);
    }

    if (packet.performative === "INFORM") {
      setPendingToolId(null);
      setTaskId(null);

      if (packet.polyline) {
        setPolylineFunction(packet.polyline);
      }

      //and add bot message to ui before fetching
      const modelMesage = {
        role: "assistant",
        content: packet.content.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => (prev ? [...prev, modelMesage] : [modelMesage]));
      console.log("WE GOT HERE, to inform");

      setAudioUri(packet.content.audio_url);
    }
    const messages = await getChatMessages(user.id, chatId);
    setMessages(messages);

    setLoadingMessage(false);
  };

  // websocket hook to handle state and
  const sendPacket = useChatWebsocket(chatId, handleIncomingPacket);

  const handleDerail = (polyline: DecodedPoint[]) => {
    const origin = polyline[0];
    const destination = polyline[polyline.length - 1];

    console.log("handle derail");

    if (user) {
      console.log("sending [acket]");

      const newPacket = {
        performative: "INFORM",
        message_id: uuidv4(),
        user_id: user.id,
        task_id: taskId ?? uuidv4(),
        chat_id: chatId ? chatId : uuidv4(),
        pending_tool_id: pendingToolId,
        sender: "USER",
        receiver: "ORCHESTRATOR_AGENT",
        content: {
          message: `I am currently at ${location?.coords.latitude}, ${location?.coords.longitude}. I have deviated from the route. Please calculate a new route to the following destination ${destination.lat}, ${destination.lng} by bus and subway.`,
          lost_coords: `${location?.coords.latitude}, ${location?.coords.longitude}`,
          destination: `$${destination.lat}, ${destination.lng}`,
          origin: `${(origin.lat, origin.lng)}`,
          audio_url: null,
        },
      };

      console.log(newPacket);
      sendPacket(newPacket);
    }
  };

  // hook handles polyline state
  const { isDerailed, setPolylineFunction } = useRouteMonitor(
    location,
    handleDerail
  );

  //send HTTP request to backend with user message
  const sendMessage = async (messageType: string) => {
    try {
      console.log(messageType);
      if (!user || !chatId) return;

      const message = userInput;

      // add placeholder message to the chat
      const placeholderMessage = {
        role: "user",
        content: messageType == "text" ? message : "Audio placeholder",
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
      let res;

      if (messageType === "text") {
        console.log("RES IS TEXT");
        res = await sendChatMessage({
          chat_id: chats ? chats[0].chat_id : uuidv4(),
          user_id: user.id,
          message: message,
          task_id: taskId,
          pending_tool_id: pendingToolId,
        });
      } else if (messageType === "audio") {
        console.log("RES IS AUDIO");
        res = await sendAudio(recorderState);
      }

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

      if (res.response_audio) {
        console.log("-- MESSAGE AUDIO INFO --");
        console.log(res.response_audio);
        setAudioUri(res.response_audio);
      }

      return;
    } catch (error) {
      console.log("error sending message: " + error);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <VoiceComponentView
        isTalking={audioRecorder.isRecording}
        // isTalking={isTalking}
        chatVisible={chatVisible}
        onMicPress={record}
        onPausePress={stopRecording}
        loadingBubble={loadingMessage}
        onToggleChat={() => setChatVisible(!chatVisible)}
      />
      {chatVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[styles.pageContainer]}
        >
          <ScrollView
            style={{
              height: Dimensions.get("window").height * 0.755,
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
                  individualMessage.role === "user" &&
                    styles.userMessageContainer,
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
              placeholder="Record or type.."
            />
            {recorderState.isRecording ? (
              <TouchableOpacity onPress={stopRecording} style={styles.btn}>
                <FontAwesome6 name="pause" size={20} color="#4d4c4cff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  userInput.length !== 0 ? sendMessage("text") : record()
                }
                style={styles.btn}
              >
                {userInput.length !== 0 ? (
                  <Text style={styles.btnTxt}>→</Text>
                ) : (
                  <FontAwesome6 name="microphone" size={20} color="#4d4c4cff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </ThemedView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  pageContainer: {
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 60,
    // backgroundColor: "rgb(242,242,242)",
  },

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
