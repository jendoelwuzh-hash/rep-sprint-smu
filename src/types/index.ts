export interface GradeMeta {
  label: string;
  accent: string;
  accentSoft: string;
}

export interface Topic {
  id: string;
  name: string;
  code: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string;
  system: string;
}

export interface ProgressData {
  mastery: number;
  xp: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface SessionData {
  start: number | null;
  topics: string[];
  agents: string[];
  msgCount: number;
  xpStart: number;
}

export interface StoredState {
  progress: Record<string, ProgressData>;
  xpTotal: number;
  streak: number;
  lastActive: string | null;
  chats: Record<string, ChatMessage[]>;
  parentPhone: string;
  session: SessionData;
}

export interface DiagramSpec {
  type: 'coordinate' | 'numberline' | 'bar' | 'shape';
  [key: string]: any;
}

export interface ParsedBlock {
  type: 'text' | 'table' | 'diagram';
  content?: string;
  header?: string[];
  rows?: string[][];
  spec?: DiagramSpec;
}