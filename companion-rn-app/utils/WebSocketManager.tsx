import { fetchChat } from "@/api/fetchAPI";
import { useAuthStore } from "@/store/store";
import { WS_URL } from "@/utils/api";
import { packetInterface, webPacketInterface } from "@/utils/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Create a context so any component can access the sendPacket function
const WebSocketContext = createContext<{
  sendPacket: (packet: any) => void;
} | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAuthStore((state) => state.user);
  const chatId = useAuthStore((state) => state.chatId);
  const setChatId = useAuthStore((state) => state.setChatId);
  const setGraph = useAuthStore((state) => state.setGraph);
  const setLatestChatPacket = useAuthStore(
    (state) => state.setLatestChatPacket,
  );

  const wsRef = useRef<WebSocket | null>(null);
  const [reconnectCounter, setReconnectCounter] = useState(0);

  //fetch and set chatId
  useEffect(() => {
    if (user && !chatId) {
      const getChats = async () => {
        const chats = await fetchChat(user.id);
        if (Array.isArray(chats) && chats.length > 0) {
          setChatId(chats[0].chat_id);
        }
      };
      getChats();
    }
  }, [user, chatId]);

  // establish and manage the WebSocket connection
  // route chat packets to global state
  useEffect(() => {
    if (!chatId) return;

    const ws = new WebSocket(`${WS_URL}/ws/${chatId}`);
    wsRef.current = ws;

    let pingInterval: number;

    ws.onopen = () => {
      console.log("Global WebSocket connected:", chatId);
      pingInterval = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      const packet: packetInterface | webPacketInterface = JSON.parse(
        event.data,
      );
      if (
        "type" in packet &&
        packet.type !== "ping" &&
        packet.type !== "pong"
      ) {
        if (packet.data && packet.data.graph) {
          setGraph(packet.data.graph);
        }
      }

      if ("performative" in packet) {
        setLatestChatPacket(packet);
      }
    };

    ws.onclose = () => {
      clearInterval(pingInterval);
      setTimeout(() => setReconnectCounter((prev) => prev + 1), 3000);
    };

    return () => {
      ws.onclose = null;
      ws.close();
    };
  }, [chatId, reconnectCounter]);

  const sendPacket = useCallback((packet: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(packet));
    } else {
      console.warn("WebSocket not ready, packet dropped");
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendPacket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useGlobalWebSocket must be used within WebSocketProvider");
  return context;
};
