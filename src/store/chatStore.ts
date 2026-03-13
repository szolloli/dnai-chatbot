import { create } from "zustand";
import { v4 as uuid } from "uuid";

import type { Message } from "../types/chat";

type MessagePayload = Pick<Message, "sender" | "text">;
type MessageTextPayload = Pick<Message, "text">;

export type ChatStore = {
  messages: Message[];
  addMessage: (message: MessagePayload) => void;
  addUserMessage: (message: MessageTextPayload) => void;
  addBotMessage: (message: MessageTextPayload) => void;
  clearMessages: () => void;
};

const createMessage = ({ sender, text }: MessagePayload): Message => ({
  id: uuid(),
  sender,
  text,
  timestamp: Date.now(),
});

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, createMessage(message)],
    })),

  addUserMessage: (message) => {
    get().addMessage({ sender: "user", text: message.text });
  },

  addBotMessage: (message) => {
    get().addMessage({ sender: "bot", text: message.text });
  },

  clearMessages: () => set({ messages: [] }),
}));
