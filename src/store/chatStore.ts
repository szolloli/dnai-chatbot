import { create } from "zustand";
import { v4 as uuid } from "uuid";

import type { Message, MessageSender } from "../types/chat";

type ChatStore = {
  messages: Message[];
  addMessage: (message: { sender: MessageSender; text: string }) => void;
  addUserMessage: (message: { text: string }) => void;
  addBotMessage: (message: { text: string }) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: uuid(),
          timestamp: Date.now(),
          ...message,
        },
      ],
    })),

  addUserMessage: (message) => {
    get().addMessage({ sender: "user", text: message.text });
  },

  addBotMessage: (message) => {
    get().addMessage({ sender: "bot", text: message.text });
  },

  clearMessages: () => set({ messages: [] }),
}));
