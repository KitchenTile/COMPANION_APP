import { supabase } from "@/supabase/supabase";
import { baseURL } from "@/utils/api";

interface userMessage {
  chat_id: string;
  user_id: string;
  message: string;
  task_id: string | null;
  pending_tool_id: string | null;
}

interface routeRequest {
  origin: string;
  destination: string;
}

export const getGmailLogin = async () => {
  try {
    // const res = await fetch("http://192.168.1.28:8000/gmailLogin");
    const res = await fetch(
      // "https://isaac-preadditional-tirelessly.ngrok-free.dev/gmailLogin"
      `${baseURL + "/gmailLogin"}`
    );

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

export const calculateRouteGraph = async (routeRequest: routeRequest) => {
  try {
    console.log(routeRequest);
    // const res = await fetch(`${baseURL + "/anticip8/demo"}`, {
    const res = await fetch(`http://34.227.7.88:8000/anticip8/demo`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(routeRequest),
    });

    if (!res.ok) {
      console.log(
        `failed to calculate map graph: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getChatMessages = async (chatId: string, userId: string) => {
  try {
    const res = await fetch(
      // `http://192.168.1.28:8000/chat/${chatId}/${userId}`
      // `https://isaac-preadditional-tirelessly.ngrok-free.dev/chat/${chatId}/${userId}`
      `${baseURL}/chat/${chatId}/${userId}`
    );
    console.log(`URL BELOW`);

    console.log(`${baseURL}/chat/${chatId}/${userId}`);

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

export const sendAudio = async (audio: any) => {
  try {
    console.log(audio);
    const formData = new FormData();

    formData.append("file", {
      uri: audio.url,
      name: "Audio test file",
      type: "audio/m4a",
    } as any);

    const res = await fetch(`${baseURL + "/chat/transcript"}`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    console.log("User audio:", audio);

    if (!res.ok) {
      console.log(
        `failed to handle audio message submission: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Failed to send new message: " + error);
  }
};
