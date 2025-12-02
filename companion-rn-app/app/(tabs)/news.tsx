import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import NewsCard from "@/components/cards/NewsCard";
import CommunicationForm from "@/components/form";
import { getCommunications, getPythonBackend } from "@/api/fetchAPI";
import { ScrollView } from "react-native";
// import image from "../../assets/images/Untitled_design-13.png";

const NewsPage = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const messages = await getPythonBackend();
        const messageList = Object.entries(messages);
        console.log("here messages effect 1");
        console.log(messageList);
        setMessages(messageList);
      } catch (err) {
        console.error("Failed to fetch backend message:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("here messages effect 2");
    console.log(messages);
  }, [messages]);

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      {messages?.map((individualMessage: any) => (
        // <NewsCard
        //   key={individualNew._id}
        //   title={individualNew.title}
        //   image={individualNew.img}
        //   createdAt={individualNew.createdAt}
        //   author={individualNew.author}
        // />
        <Text>{individualMessage}</Text>
      ))}
    </ScrollView>
  );
};

export default NewsPage;

const styles = StyleSheet.create({
  pageContainer: { alignItems: "center" },
});
