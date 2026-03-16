# Chat Widget Prototype

This project is a simple chat widget prototype built as a technical assignment.  
It includes a floating chat launcher, a chat window UI, message history, automatic bot responses (polling), and unread message signaling.

## Technology

The app is built with React, TypeScript, and Vite.  
UI is implemented with Material UI (MUI), and chat state management is handled with Zustand.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Manual Work vs Codex

- Manual:
  - Project initialization and setup.
  - Small direct fixes/adjustments where manual edits were faster than prompting an agent.
- Codex-assisted:
  - Most of the base chat structure and component implementation.
  - Incremental functional improvements (store logic, polling, unread behavior, scrolling behavior).
  - UI refactors and design updates across the chat widget.
  - The Codex agent was guided to stick to my preferences and coding style during implementation and refinement.
  - Tests were created using Codex and manually reviewed. After manual review, new tests were adjusted to be more thorough for example so the bot messages aren't polled infintely.
- Specific examples of what needed to be adjusted:
  - Closure issues when using `setTimeout` in combination with opening and closing the chat window. Codex used state values instead of refs which resulted in unread message indicator not updating correctly.
  - Styling needed minor adjustments for example in earlier UI variant there was more complex border radius logic which neeeded to be tweaked manually.
  - Removing already implement features was not thorough and needed to be removed manually.
  - usBotPolling logic was a bit overcomplicated and used more state variabled than needed. I manually removed redundant state variables and used derived values instead.
