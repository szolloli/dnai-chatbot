import { useEffect, useMemo, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";

import { useChatStore } from "../store/chatStore";

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const listRef = useRef<HTMLDivElement | null>(null);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages],
  );

  useEffect(() => {
    if (!listRef.current) return;

    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [sortedMessages.length]);

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
      {sortedMessages.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No messages yet.
        </Typography>
      ) : (
        sortedMessages.map((message) => (
          <Paper
            key={message.id}
            elevation={0}
            sx={{
              alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              px: 1.25,
              py: 0.75,
              borderRadius: 1,
              bgcolor:
                message.sender === "user"
                  ? "primary.light"
                  : "background.paper",
              color:
                message.sender === "user"
                  ? "primary.contrastText"
                  : "text.primary",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2">{message.text}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}
