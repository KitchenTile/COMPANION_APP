import { packetInterface } from "@/utils/types";
import { useEffect, useState } from "react";

export const useChatWebsocket = (
  chatId: string,
  onPacket: (packet: packetInterface) => void
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  // connect to chatId's websocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${chatId}`);

    ws.onopen = () => {
      console.log("Connected!");
      setWs(ws);
    };
    ws.onerror = (e) => {
      console.log("WebSocket Error:", e);
    };

    ws.onclose = (e) => {
      console.log("WebSocket Closed:", e.code, e.reason);
    };

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data);
      onPacket(packet);
    };

    return () => ws.close();
  }, []);

  //send new packet to chat_id
  const sendPacket = (packet: packetInterface) => {
    if (ws) ws.send(JSON.stringify(packet));
  };

  return sendPacket;
};
