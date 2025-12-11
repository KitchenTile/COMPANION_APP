import { baseURL } from "@/utils/api";

interface userMessage {
  chat_id: string;
  user_id: string;
  message: string;
  task_id: string | null;
  pending_tool_id: string | null;
}

export const getPythonBackend = async () => {
  try {
    const res = await fetch("http://localhost:8000/");

    if (!res.ok) {
      console.log("Error fetching data");
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getChatMessages = async () => {
  try {
    const res = await fetch(
      "http://localhost:8000/chat/5616b7de-165c-44a9-88a7-e2b5d2e4523c/f4f1cb57-c89e-4327-9a80-868c03ec7344"
    );

    if (!res.ok) {
      console.log("Error fetching data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const sendChatMessage = async (userQuery: userMessage) => {
  try {
    const res = await fetch(`${baseURL + "/chat/message"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userQuery),
    });

    console.log("User message:", userQuery);

    if (!res.ok) {
      console.log(
        `failed to handle message submission: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Failed to send new message: " + error);
  }
};
