import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Fab, Portal, SvgIcon } from "@mui/material";

import { botResponses } from "../data/botResponses";
import { useChatStore } from "../store/chatStore";
import ChatWidget from "./ChatWidget";

const ChatLauncher = () => {
  const messages = useChatStore((state) => state.messages);
  const addBotMessage = useChatStore((state) => state.addBotMessage);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const isChatOpenRef = useRef(false);
  const thinkingAnimationFrameRef = useRef<number | null>(null);
  const responseTimeoutRef = useRef<number | null>(null);
  const lastRespondedUserMessageIdRef = useRef<string | null>(null);

  const latestUserMessageId = useMemo(
    () =>
      [...messages]
        .reverse()
        .find((message) => message.sender === "user")?.id ?? null,
    [messages],
  );

  // Reply exactly once for each user message after a 5 second delay.
  useEffect(() => {
    if (!latestUserMessageId || isBotThinking) return;
    if (responseTimeoutRef.current !== null) return;
    if (latestUserMessageId === lastRespondedUserMessageIdRef.current) return;

    thinkingAnimationFrameRef.current = window.requestAnimationFrame(() => {
      setIsBotThinking(true);
      thinkingAnimationFrameRef.current = null;
    });
    responseTimeoutRef.current = window.setTimeout(() => {
      lastRespondedUserMessageIdRef.current = latestUserMessageId;
      setIsBotThinking(false);
      responseTimeoutRef.current = null;

      if (botResponses.length === 0) return;
      const randomIndex = Math.floor(Math.random() * botResponses.length);
      addBotMessage({ text: botResponses[randomIndex] });
      if (!isChatOpenRef.current) {
        setHasUnreadMessages(true);
      }
    }, 5000);
  }, [addBotMessage, isBotThinking, latestUserMessageId]);

  useEffect(() => {
    return () => {
      if (thinkingAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(thinkingAnimationFrameRef.current);
      }
      if (responseTimeoutRef.current !== null) {
        window.clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  const toggleChatWindow = () => {
    setIsChatOpen((previousState) => {
      const nextState = !previousState;
      if (nextState) {
        setHasUnreadMessages(false);
      }
      return nextState;
    });
    isChatOpenRef.current = !isChatOpenRef.current;
  };

  const closeChatWindow = () => {
    isChatOpenRef.current = false;
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
