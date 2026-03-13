import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    chat: {
      botBubble: string;
      botText: string;
      userBubble: string;
      userText: string;
      unreadDot: string;
    };
  }

  interface PaletteOptions {
    chat?: {
      botBubble?: string;
      botText?: string;
      userBubble?: string;
      userText?: string;
      unreadDot?: string;
    };
  }
}

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4629F2",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#FF3B30",
    },
    divider: "#E5E7EB",
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0D082C",
    },
    chat: {
      botBubble: "#F1F7FF",
      botText: "#0D082C",
      userBubble: "#4629F2",
      userText: "#FFFFFF",
      unreadDot: "#FF3B30",
    },
  },
});
