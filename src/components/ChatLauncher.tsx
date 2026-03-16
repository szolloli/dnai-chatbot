import { useCallback, useState } from "react";
import { Box, Fab, Portal, SvgIcon } from "@mui/material";

import { useBotPolling } from "../hooks/useBotPolling";
import ChatWidget from "./ChatWidget";

const ChatLauncher = () => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleBotMessage = useCallback((chatOpen: boolean) => {
    if (!chatOpen) {
      setHasUnreadMessages(true);
    }
  }, []);

  const { isBotThinking } = useBotPolling({
    isChatOpen,
    onBotMessage: handleBotMessage,
  });

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
        {isChatOpen ? (
          <ChatWidget isBotThinking={isBotThinking} onClose={closeChatWindow} />
        ) : null}
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
