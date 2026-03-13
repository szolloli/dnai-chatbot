import { useState, type KeyboardEvent, type SubmitEvent } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useChatStore } from "../store/chatStore";

const MessageInput = () => {
  const addUserMessage = useChatStore((state) => state.addUserMessage);
  const [text, setText] = useState("");

  const handleSend = () => {
    const message = text.trim();
    if (!message) return;
    addUserMessage({ text: message });
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
    // Shift+Enter will automatically insert a newline in the TextField
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 1 }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        multiline
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!text.trim()}
        sx={{ minWidth: 72 }}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
