import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getChatMessages, sendChatMessage } from "@/api/fetchAPI";
import { ScrollView } from "react-native";

const ChatPage = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<messageInterface[]>();

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
    if (userInput !== "") {
      const res = await sendChatMessage({
        chat_id: "5616b7de-165c-44a9-88a7-e2b5d2e4523d",
        user_id: "5616b7de-165c-44a9-88a7-e2b5d2e4523c",
        message: userInput,
      });
      console.log(res);
      setUserInput("");
      const messages = await getChatMessages();
      setMessages(messages);
    }
    return;
  };

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      {messages?.map((individualMessage: messageInterface, index) => (
        <Text key={index}>{individualMessage.content}</Text>
      ))}
      <TextInput
        style={styles.input}
        onChangeText={setUserInput}
        value={userInput}
        placeholder="placeholder text"
      />
      <Button
        onPress={sendMessage}
        title="Send"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </ScrollView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  pageContainer: { alignItems: "center" },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 300,
  },
});
