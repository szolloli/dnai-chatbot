import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { botResponses } from "../data/botResponses";
import { useChatStore } from "../store/chatStore";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatWidget = () => {
  const addBotMessage = useChatStore((state) => state.addBotMessage);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (botResponses.length === 0) return;

      const randomIndex = Math.floor(Math.random() * botResponses.length);
      const response = botResponses[randomIndex];
      addBotMessage({ text: response });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [addBotMessage]);

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
};

export default ChatWidget;
