import { beforeEach, describe, expect, it } from "vitest";
import { useChatStore } from "../src/store/chatStore";

const getMessages = () => useChatStore.getState().messages;

beforeEach(() => {
  // Reset the store to its initial state before each test
  useChatStore.getState().clearMessages();
});

describe("chatStore", () => {
  it("starts with one initial bot message", () => {
    const messages = getMessages();

    expect(messages).toHaveLength(1);
    expect(messages[0].sender).toBe("bot");
    expect(messages[0].text.length).toBeGreaterThan(0);
  });

  it("appends a user message with the expected sender and text", () => {
    const initialCount = getMessages().length;

    useChatStore.getState().addUserMessage({ text: "Hi" });

    const messages = getMessages();
    const lastMessage = messages.at(-1);

    expect(messages).toHaveLength(initialCount + 1);
    expect(lastMessage?.sender).toBe("user");
    expect(lastMessage?.text).toBe("Hi");
  });

  it("appends a bot message with the expected sender and text", () => {
    const initialCount = getMessages().length;

    useChatStore.getState().addBotMessage({ text: "Hello" });

    const messages = getMessages();
    const lastMessage = messages.at(-1);

    expect(messages).toHaveLength(initialCount + 1);
    expect(lastMessage?.sender).toBe("bot");
    expect(lastMessage?.text).toBe("Hello");
  });

  it("clearMessages resets the conversation to a single initial bot message", () => {
    useChatStore.getState().addUserMessage({ text: "First" });
    useChatStore.getState().addBotMessage({ text: "Second" });

    useChatStore.getState().clearMessages();

    const messages = getMessages();
    expect(messages).toHaveLength(1);
    expect(messages[0].sender).toBe("bot");
    expect(messages[0].text.length).toBeGreaterThan(0);
  });

  it("adds id and timestamp metadata to new messages", () => {
    useChatStore.getState().addUserMessage({ text: "First" });
    const firstMessage = getMessages().at(-1);

    useChatStore.getState().addBotMessage({ text: "Second" });
    const secondMessage = getMessages().at(-1);

    expect(firstMessage).toBeDefined();
    expect(secondMessage).toBeDefined();
    expect(typeof secondMessage?.id).toBe("string");
    expect(secondMessage?.id.length).toBeGreaterThan(0);
    expect(typeof secondMessage?.timestamp).toBe("number");
    expect(secondMessage?.timestamp).toBeGreaterThanOrEqual(
      firstMessage?.timestamp ?? 0,
    );
  });
});
