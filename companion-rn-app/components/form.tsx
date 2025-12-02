import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { postCommunication } from "@/api/fetchAPI"; // adjust path if needed
import { baseURL } from "@/utils/api";

const CommunicationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [img, setImg] = useState(
    "https://assets.prod.unioncloud-internal.com/image/images/612635/original/Training-4.png"
  );

  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const body = { title, message, author, img };
      const res = await postCommunication(body);

      // if you want to check response json
      const data = await res!.json?.();
      console.log(data);
      //   setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setResponse("Error sending request");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}
      />

      <Text style={styles.label}>Author</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={author}
        onChangeText={setAuthor}
      />

      <Text style={styles.label}>Thumbnail</Text>
      <TextInput
        style={styles.input}
        placeholder="Upload Image"
        value={img}
        onChangeText={setImg}
      />

      <Button title="Submit" onPress={handleSubmit} />

      {response ? <Text style={styles.response}>{response}</Text> : null}
    </View>
  );
};

export default CommunicationForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  response: {
    marginTop: 20,
    fontFamily: "monospace",
    fontSize: 12,
    color: "green",
  },
});
