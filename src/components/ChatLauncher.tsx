import { useEffect, useMemo, useState } from "react";
import { Box, Fab, Portal, SvgIcon } from "@mui/material";

import { botResponses } from "../data/botResponses";
import { useChatStore } from "../store/chatStore";
import ChatWidget from "./ChatWidget";

const ChatLauncher = () => {
  const messages = useChatStore((state) => state.messages);
  const addBotMessage = useChatStore((state) => state.addBotMessage);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const hasUserMessage = useMemo(
    () => messages.some((message) => message.sender === "user"),
    [messages],
  );

  // Setup 5 second interval to "send" bot messages after user has sent a message.
  useEffect(() => {
    if (!hasUserMessage) return;

    const intervalId = window.setInterval(() => {
      if (botResponses.length === 0) return;

      const randomIndex = Math.floor(Math.random() * botResponses.length);
      addBotMessage({ text: botResponses[randomIndex] });
      if (!isChatOpen) {
        setHasUnreadMessages(true);
      }
    }, 5000);

    // Clean up interval on component unmount.
    return () => window.clearInterval(intervalId);
  }, [addBotMessage, hasUserMessage, isChatOpen]);

  const toggleChatWindow = () => {
    setIsChatOpen((previousState) => {
      const nextState = !previousState;
      if (nextState) {
        setHasUnreadMessages(false);
      }
      return nextState;
    });
  };

  const closeChatWindow = () => {
    setIsChatOpen(false);
  };

  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1.5,
        }}
      >
        {isChatOpen ? <ChatWidget onClose={closeChatWindow} /> : null}
        <Box sx={{ position: "relative" }}>
          <Fab
            color="primary"
            aria-label="Toggle chat"
            onClick={toggleChatWindow}
          >
            {hasUnreadMessages && !isChatOpen ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "chat.unreadDot",
                  border: "2px solid",
                  borderColor: "background.paper",
                  zIndex: 10,
                }}
              />
            ) : null}
            <SvgIcon viewBox="0 0 24 24">
              <path d="M4 4h16v11H7l-3 3V4Zm2 2v7.17L6.17 13H18V6H6Z" />
            </SvgIcon>
          </Fab>
        </Box>
      </Box>
    </Portal>
  );
};

export default ChatLauncher;
