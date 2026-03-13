import { Box, IconButton, SvgIcon, Typography } from "@mui/material";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

type ChatWidgetProps = {
  onClose: () => void;
};

const ChatWidget = ({ onClose }: ChatWidgetProps) => {
  return (
    <Box
      sx={{
        height: 400,
        width: 360,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontSize: 16, fontWeight: 600 }}
        >
          Chat
        </Typography>
        <IconButton aria-label="Close chat" onClick={onClose} size="small">
          <SvgIcon fontSize="small" viewBox="0 0 24 24">
            <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.29-6.3z" />
          </SvgIcon>
        </IconButton>
      </Box>
      <MessageList />
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: 1.5,
          py: 1.25,
        }}
      >
        <MessageInput />
      </Box>
    </Box>
  );
};

export default ChatWidget;
