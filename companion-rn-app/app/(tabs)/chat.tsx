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
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import TypingIndicator from "@/components/ui/TypingBubbleDots";

const ChatPage = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<messageInterface[]>();
  const [taskId, setTaskId] = useState(null);
  const [pendingToolId, setPendingToolId] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  interface messageInterface {
    content: string;
    role: string;
    timestamp: string;
  }

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
      }

      setLoadingMessage(false);

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
              {individualMessage.content}
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
