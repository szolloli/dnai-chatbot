import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useBotPolling } from "../src/hooks/useBotPolling";
import { useChatStore } from "../src/store/chatStore";

const botMessagesCount = () =>
  useChatStore.getState().messages.filter((message) => message.sender === "bot")
    .length;

type HookHarnessProps = {
  isChatOpen?: boolean;
  onBotMessage?: (isChatOpen: boolean) => void;
};

// Small component wrapper so the hook can be exercised through React renders.
const HookHarness = ({
  isChatOpen = false,
  onBotMessage,
}: HookHarnessProps) => {
  const { isBotThinking } = useBotPolling({ isChatOpen, onBotMessage });

  return <div data-testid="bot-thinking">{isBotThinking ? "yes" : "no"}</div>;
};

beforeEach(() => {
  vi.useFakeTimers();
  // MessageList uses animation frames, so keep timer-driven renders deterministic.
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    return window.setTimeout(() => callback(performance.now()), 16);
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    window.clearTimeout(id);
  });
  useChatStore.getState().clearMessages();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("useBotPolling", () => {
  it("sets thinking state and adds exactly one bot reply after 5 seconds", () => {
    render(<HookHarness isChatOpen={false} />);
    expect(screen.getByTestId("bot-thinking").textContent).toBe("no");

    const initialBotCount = botMessagesCount();

    // A user message should immediately flip the hook into "thinking"
    // and only append a bot reply once the delay has elapsed.
    act(() => {
      useChatStore.getState().addUserMessage({ text: "Hello bot" });
    });

    act(() => {
      vi.advanceTimersByTime(16);
    });
    expect(screen.getByTestId("bot-thinking").textContent).toBe("yes");
    expect(botMessagesCount()).toBe(initialBotCount);

    act(() => {
      vi.advanceTimersByTime(4983);
    });
    expect(botMessagesCount()).toBe(initialBotCount);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("bot-thinking").textContent).toBe("no");
    expect(botMessagesCount()).toBe(initialBotCount + 1);

    // Only one message should be appended per polling cycle.
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(botMessagesCount()).toBe(initialBotCount + 1);
  });

  it("invokes the latest callback with the latest chat-open state when replying", () => {
    const initialCallback = vi.fn();
    const latestCallback = vi.fn();
    const { rerender } = render(
      <HookHarness isChatOpen={false} onBotMessage={initialCallback} />,
    );

    act(() => {
      useChatStore.getState().addUserMessage({ text: "Hello bot" });
    });

    rerender(<HookHarness isChatOpen={true} onBotMessage={latestCallback} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(initialCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledTimes(1);
    expect(latestCallback).toHaveBeenCalledWith(true);
  });
});
