import { useState, type KeyboardEvent, type SubmitEvent } from "react";
import { Box, Button, SvgIcon, TextField } from "@mui/material";
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
        placeholder="Reply..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        multiline
        maxRows={2}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: 13,
            lineHeight: 1.35,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!text.trim()}
        aria-label="Send message"
        sx={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: "50%",
          p: 0,
          flex: "0 0 36px",
        }}
      >
        <SvgIcon fontSize="small" viewBox="0 0 24 24">
          <path d="M3 20V4l19 8-19 8Zm2-3 11.85-5L5 7v3.85L10 12l-5 1.15V17Z" />
        </SvgIcon>
      </Button>
    </Box>
  );
};

export default MessageInput;
