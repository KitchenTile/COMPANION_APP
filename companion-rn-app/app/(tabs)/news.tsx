import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import CommunicationForm from "@/components/form";
import { getChatMessages, sendChatMessage } from "@/api/fetchAPI";
import { ScrollView } from "react-native";
// import image from "../../assets/images/Untitled_design-13.png";

const NewsPage = () => {
  useEffect(() => {
    async function fetchData() {
      try {
      } catch (err) {}
    }

    fetchData();
  }, []);

  return <ScrollView contentContainerStyle={styles.pageContainer}></ScrollView>;
};

export default NewsPage;

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
