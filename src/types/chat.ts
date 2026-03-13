export type MessageSender = "user" | "bot";

export type Message = {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: number;
};
