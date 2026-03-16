import { useEffect, useMemo, useRef } from "react";

import { botResponses } from "../data/botResponses";
import { useChatStore } from "../store/chatStore";

const DEFAULT_RESPONSE_DELAY_MS = 5000;

type UseBotPollingOptions = {
  isChatOpen?: boolean;
  onBotMessage?: (isChatOpen: boolean) => void;
  responseDelayMs?: number;
};

export const useBotPolling = ({
  isChatOpen = false,
  onBotMessage,
  responseDelayMs = DEFAULT_RESPONSE_DELAY_MS,
}: UseBotPollingOptions = {}) => {
  const messages = useChatStore((state) => state.messages);
  const addBotMessage = useChatStore((state) => state.addBotMessage);
  const isChatOpenRef = useRef(isChatOpen);
  const onBotMessageRef = useRef(onBotMessage);
  const responseTimeoutRef = useRef<number | null>(null);
  const lastRespondedUserMessageIdRef = useRef<string | null>(null);

  const latestUserMessageId = useMemo(
    () =>
      [...messages].reverse().find((message) => message.sender === "user")
        ?.id ?? null,
    [messages],
  );

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  useEffect(() => {
    onBotMessageRef.current = onBotMessage;
  }, [onBotMessage]);

  const isLatestMessageUserMessage =
    messages?.[messages.length - 1]?.sender === "user";

  // Upon "receiving" a user message, start a timeout to reply.
  useEffect(() => {
    if (!latestUserMessageId) return;
    if (responseTimeoutRef.current !== null) return;
    if (latestUserMessageId === lastRespondedUserMessageIdRef.current) return;

    responseTimeoutRef.current = window.setTimeout(() => {
      lastRespondedUserMessageIdRef.current = latestUserMessageId;
      responseTimeoutRef.current = null;

      if (botResponses.length === 0) return;

      const randomIndex = Math.floor(Math.random() * botResponses.length);
      addBotMessage({ text: botResponses[randomIndex] });

      onBotMessageRef.current?.(isChatOpenRef.current);
    }, responseDelayMs);

    // Clean currently active timeout.
    return () => {
      if (responseTimeoutRef.current !== null) {
        window.clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
    };
  }, [
    addBotMessage,
    isLatestMessageUserMessage,
    latestUserMessageId,
    responseDelayMs,
  ]);

  return { isBotThinking: isLatestMessageUserMessage };
};
