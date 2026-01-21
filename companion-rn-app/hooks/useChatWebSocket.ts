import { WS_URL } from "@/utils/api";
import { packetInterface } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useChatWebsocket = (
  chatId: string | null,
  onPacket: (packet: packetInterface) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const onPacketRef = useRef(onPacket);

  useEffect(() => {
    onPacketRef.current = onPacket;
  }, [onPacket]);

  // connect to chatId's websocket
  useEffect(() => {
    if (!chatId) return;
    // const ws = new WebSocket(`ws://localhost:8000/ws/${chatId}`);
    // const ws = new WebSocket(`ws://192.168.1.28:8000/ws/${chatId}`);

    const ws = new WebSocket(`${WS_URL}/ws/${chatId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", chatId);
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

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [chatId]);

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
