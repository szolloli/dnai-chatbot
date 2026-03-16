import { reactCompilerPreset } from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

const config = {
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    clearMocks: true,
  },
};

export default config;
