import { useLayoutEffect, useRef } from "react";
import { Avatar, Box, Paper, Typography } from "@mui/material";

import { useChatStore } from "../store/chatStore";

const SINGLE_MESSAGE_HEIGHT = 34;

type MessageListProps = {
  isBotThinking: boolean;
};

const MessageList = ({ isBotThinking }: MessageListProps) => {
  const messages = useChatStore((state) => state.messages);
  const listRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const container = listRef.current;

    if (!hasMountedRef.current) {
      // On first mount, pin to latest message immediately (no jump animation).
      container.scrollTop = container.scrollHeight;
      hasMountedRef.current = true;
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [isBotThinking, messages.length]);

  return (
    <Box
      ref={listRef}
      sx={{
        flex: 1,
        px: 1.5,
        py: 1.25,
        overflowY: "auto",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      {messages.map((message) =>
        message.sender === "bot" ? (
          <Box
            key={message.id}
            sx={{
              alignSelf: "flex-start",
              maxWidth: "92%",
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
            }}
          >
            <Avatar
              src="https://i.pravatar.cc/40?img=13"
              alt="Assistant"
              sx={{
                width: SINGLE_MESSAGE_HEIGHT,
                height: SINGLE_MESSAGE_HEIGHT,
                flexShrink: 0,
              }}
            />
            <Paper
              elevation={0}
              sx={{
                width: "fit-content",
                maxWidth: "100%",
                px: 1.5,
                py: 1,
                minHeight: SINGLE_MESSAGE_HEIGHT,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                borderRadius: "12px",
                bgcolor: "chat.botBubble",
                color: "chat.botText",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: 13, lineHeight: 1.35 }}
              >
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Box
            key={message.id}
            sx={{
              alignSelf: "flex-end",
              maxWidth: "85%",
              display: "flex",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                alignSelf: "flex-end",
                px: 1.25,
                py: 0.75,
                minHeight: SINGLE_MESSAGE_HEIGHT,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                borderRadius: "12px",
                bgcolor: "chat.userBubble",
                color: "chat.userText",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: 13, lineHeight: 1.35 }}
              >
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ),
      )}
      {isBotThinking ? (
        <Box
          sx={{
            alignSelf: "flex-start",
            maxWidth: "92%",
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
          }}
        >
          <Avatar
            src="https://i.pravatar.cc/40?img=13"
            alt="Assistant"
            sx={{
              width: SINGLE_MESSAGE_HEIGHT,
              height: SINGLE_MESSAGE_HEIGHT,
              flexShrink: 0,
            }}
          />
          <Paper
            elevation={0}
            sx={{
              px: 1.5,
              py: 1,
              minHeight: SINGLE_MESSAGE_HEIGHT,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              borderRadius: "12px",
              bgcolor: "chat.botBubble",
            }}
          >
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[0, 1, 2].map((dotIndex) => (
                <Box
                  key={dotIndex}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "chat.botText",
                    opacity: 0.35,
                    animation: "chatTypingDots 1.2s infinite ease-in-out",
                    animationDelay: `${dotIndex * 0.2}s`,
                    "@keyframes chatTypingDots": {
                      "0%, 80%, 100%": {
                        opacity: 0.35,
                        transform: "translateY(0)",
                      },
                      "40%": {
                        opacity: 1,
                        transform: "translateY(-2px)",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      ) : null}
    </Box>
  );
};

export default MessageList;
