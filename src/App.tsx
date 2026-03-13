import { Box } from "@mui/material";

import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
      }}
    >
      <ChatWidget />
    </Box>
  );
}

export default App;
