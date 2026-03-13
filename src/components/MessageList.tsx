import { useLayoutEffect, useMemo, useRef } from "react";
import { Avatar, Box, Paper, Typography } from "@mui/material";

import { useChatStore } from "../store/chatStore";

const SINGLE_MESSAGE_HEIGHT = 34;
const SCROLL_BOTTOM_THRESHOLD = 8;

const isScrolledToBottom = (container: HTMLDivElement): boolean => {
  return (
    container.scrollHeight - container.scrollTop - container.clientHeight <=
    SCROLL_BOTTOM_THRESHOLD
  );
};

const getBubbleBorderRadius = (
  sender: "user" | "bot",
  indexInBlock: number,
  blockSize: number,
): string => {
  const isFirst = indexInBlock === 0;
  const isLast = indexInBlock === blockSize - 1;
  const isSingle = isFirst && isLast;

  if (sender === "bot") {
    if (isSingle) return "12px";
    if (isFirst) return "12px 12px 12px 0";
    if (isLast) return "0 12px 12px 12px";
    return "0 12px 12px 0";
  }

  if (isSingle) return "12px";
  if (isFirst) return "12px 12px 0 12px";
  if (isLast) return "12px 0 12px 12px";
  return "12px 0 0 12px";
};

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const listRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages],
  );

  const senderBlocks = useMemo(() => {
    return sortedMessages.reduce<
      Array<{ sender: "user" | "bot"; messages: typeof sortedMessages }>
    >((blocks, message) => {
      const lastBlock = blocks[blocks.length - 1];

      if (!lastBlock || lastBlock.sender !== message.sender) {
        blocks.push({ sender: message.sender, messages: [message] });
        return blocks;
      }

      lastBlock.messages.push(message);
      return blocks;
    }, []);
  }, [sortedMessages]);

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const container = listRef.current;

    if (!hasMountedRef.current) {
      // On first mount, pin to latest message immediately (no jump animation).
      container.scrollTop = container.scrollHeight;
      shouldAutoScrollRef.current = true;
      hasMountedRef.current = true;
      return;
    }

    if (!shouldAutoScrollRef.current) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [sortedMessages.length]);

  return (
    <Box
      ref={listRef}
      onScroll={(event) => {
        shouldAutoScrollRef.current = isScrolledToBottom(event.currentTarget);
      }}
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
      {senderBlocks.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 13 }}
        >
          No messages yet.
        </Typography>
      ) : (
        senderBlocks.map((block, blockIndex) =>
          block.sender === "bot" ? (
            <Box
              key={`bot-${blockIndex}-${block.messages[0].id}`}
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.375,
                  }}
                >
                  {block.messages.map((message, messageIndex) => (
                    <Paper
                      key={message.id}
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
                        borderRadius: getBubbleBorderRadius(
                          "bot",
                          messageIndex,
                          block.messages.length,
                        ),
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
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              key={`user-${blockIndex}-${block.messages[0].id}`}
              sx={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                display: "flex",
                flexDirection: "column",
                gap: 0.375,
              }}
            >
              {block.messages.map((message, messageIndex) => (
                <Paper
                  key={message.id}
                  elevation={0}
                  sx={{
                    alignSelf: "flex-end",
                    px: 1.25,
                    py: 0.75,
                    minHeight: SINGLE_MESSAGE_HEIGHT,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: getBubbleBorderRadius(
                      "user",
                      messageIndex,
                      block.messages.length,
                    ),
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
              ))}
            </Box>
          ),
        )
      )}
    </Box>
  );
};

export default MessageList;
