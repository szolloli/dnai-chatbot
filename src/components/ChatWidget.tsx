import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

import { useChatStore } from "../store/chatStore";
import MessageInput from "./MessageInput";

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;

    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 1.5,
          overflowY: "auto",
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No messages yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={listRef}
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
        overflowY: "auto",
        bgcolor: "grey.50",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            px: 1.25,
            py: 0.75,
            borderRadius: 1,
            bgcolor:
              message.sender === "user" ? "primary.light" : "background.paper",
            color:
              message.sender === "user"
                ? "primary.contrastText"
                : "text.primary",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2">{message.text}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function ChatWidget() {
  return (
    <Box
      sx={{
        height: 400,
        width: 320,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" component="h2">
        Chat
      </Typography>
      <MessageList />
      <MessageInput />
    </Box>
  );
}
