import { baseURL } from "@/utils/api";

export const postCommunication = async (body: Object) => {
  try {
    const res = await fetch(`${baseURL + "/posts/communication"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
export const postEvent = async (body: Object) => {
  try {
    const res = await fetch(`${baseURL + "/posts/event"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getCommunications = async () => {
  try {
    const res = await fetch(`${baseURL + "/posts"}`);

    if (!res.ok) {
      console.log("Error fetching data");
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("error:" + error);
  }
};

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

export const sendChatMessage = async (userQuery: string) => {
  try {
    const res = await fetch(`${baseURL + "/chat/message"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userQuery: userQuery }),
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
    console.error(error);
  }
};
