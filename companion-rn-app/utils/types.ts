export interface decodedPolyline {
  lat: string;
  lng: string;
}

export type decodedPolyline2 = { [key: string]: number };

export interface messageInterface {
  content: object | string;
  role: string;
  timestamp: string;
}

export type PacketContent = string | { [key: string]: string };

export type DecodedPoint = {
  lat: number;
  lng: number;
};

export interface packetInterface {
  performative: string;
  message_id: string;
  user_id: string;
  task_id: string | null;
  chat_id: string;
  pending_tool_id: string | null;
  content: PacketContent;
  sender: string;
  receiver: string;
  polyline?: string;
}
