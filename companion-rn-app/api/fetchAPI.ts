import { supabase } from "@/supabase/supabase";
import { baseURL } from "@/utils/api";

interface userMessage {
  chat_id: string;
  user_id: string;
  message: string;
  task_id: string | null;
  pending_tool_id: string | null;
}

export const getGmailLogin = async () => {
  try {
    const res = await fetch("http://localhost:8000/gmailLogin");

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

export const getChatMessages = async (chatId: string, userId: string) => {
  try {
    const res = await fetch(`http://localhost:8000/chat/${chatId}/${userId}`);

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

export const fetchChat = async (userId: string) => {
  if (!userId) return;
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId);

  if (error) return error;

  return data;
};
