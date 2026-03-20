import { WS_URL } from "@/utils/api";
import { packetInterface } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useChatWebsocket = (
  chatId: string | null,
  onPacket: (packet: packetInterface) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const onPacketRef = useRef(onPacket);
  const [reconnectCounter, setReconnectCounter] = useState(0);

  useEffect(() => {
    onPacketRef.current = onPacket;
  }, [onPacket]);

  // connect to chatId's websocket
  useEffect(() => {
    if (!chatId) return;

    const ws = new WebSocket(`${WS_URL}/ws/${chatId}`);
    wsRef.current = ws;

    let pingInterval: number;

    ws.onopen = () => {
      console.log("WebSocket connected:", chatId);

      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          // Sending a dummy ping packet
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    ws.onerror = (e) => {
      console.log("WebSocket Error:", e);
    };

    ws.onclose = (e) => {
      console.log("WebSocket Closed:", e.code, e.reason);
      clearInterval(pingInterval);

      setTimeout(() => {
        console.log("Attempting to reconnect...");
        setReconnectCounter((prev) => prev + 1);
      }, 3000);
    };

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data);
      onPacketRef.current(packet);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [chatId, reconnectCounter]);

  //send new packet to chat_id or return if ws not ready
  const sendPacket = useCallback((packet: packetInterface) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready, packet dropped");
      return;
    }

    ws.send(JSON.stringify(packet));
  }, []);

  return sendPacket;
};
