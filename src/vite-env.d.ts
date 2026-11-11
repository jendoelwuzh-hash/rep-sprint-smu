/// <reference types="vite/client" />

interface Window {
  claude?: {
    use: (tool: string) => Promise<(messages: any[], options?: any) => Promise<{ text: string }>>;
  };
}