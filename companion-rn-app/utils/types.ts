import { Session, User } from "@supabase/supabase-js";

export interface decodedPolyline {
  lat: string;
  lng: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface Chat {
  chat_id: string;
  user_id: string;
  messages: ChatMessage[];
  created_at: string;
}

export interface AuthStore {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  polyline: DecodedPoint[] | null;
  session: Session | null;
  error: any;

  setPolyline: (polyline: DecodedPoint[]) => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<() => void>;
}

export type decodedPolyline2 = { [key: string]: number };

export interface messageInterface {
  content: object | string;
  role: string;
  timestamp: string;
}

export type PacketContent = {
  message: string;
  audio_url: string | null;
};

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

export type Risk = {
  failure_mode: string;
  label: string;
  prevention: string[];
  correction: string[];
  best_prevention: string;
  best_correction: string;
  severity?: number;
  probability: number;
};

export type Step = {
  node_from: string;
  node_to: string;
  label: string;
  risks: Risk[];
  preventions: prevention[];
  probability?: number;
};

export type TravelData = {
  steps: Step[];
};

interface prevention {
  label: string;
  adjusted_probabilities: Record<string, number>;
}

export interface TreeNode {
  id: string;
  name: string;
  type: string;
  children?: TreeNode[];
  label?: string;
  severity?: number;
  probability?: number;
  preventions?: prevention[];
}

export interface ConvertedTreeNode {
  id: string;
  data: {
    label: string;
    children: TreeNode[] | undefined;
  };
  position: {
    y: number;
    x: number;
  };
  type: string;
  style: {
    background: string;
    border: string;
    maxWidth: number;
    fontSize: string;
    borderRadius: number;
  };
}
