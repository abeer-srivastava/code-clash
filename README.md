# ⚡ Code Clash Frontend: The Cyber-Arena

This is the high-performance, real-time frontend for **Code Clash**, built with a "Cyber-Terminal" aesthetic. It manages the user interface, real-time battle state synchronization, and interactive code editing.

## 🏗️ Architecture & System Design

The frontend is a **Next.js 15 (App Router)** application that acts as a thin client for the backend state. It uses a **WebSocket-First** architecture where the UI is a direct reflection of the room state pushed by the server.

### Key Components
- **`BattleArena` (`app/battle/[roomId]`)**: The core state machine. It handles the transition between `WAITING` (Lobby), `IN_PROGRESS` (Coding), and `COMPLETED` (Results).
- **`Monaco Editor`**: Integrated with custom themes and multi-language support (JS, Python, C++, Java).
- **`useSocket` Hook**: A centralized service that manages the WebSocket lifecycle, including automatic reconnection and message typing.
- **`GSAP & Framer Motion`**: Drives the "Cyberpunk" aesthetic through heavy use of GLSL-inspired animations and "Shuffle" text effects.

## 🔄 Data Flow (Client-Side)
1. **State Sync**: Every change in the battle is broadcasted by the backend as a `ROOM_STATE` message.
2. **Local Updates**: UI updates (like typing status) are kept lightweight, while critical data (results, winner) is strictly server-authoritative.
3. **Execution Pipeline**:
   - Clicking **RUN** sends a `RUN_CODE` event. The client waits for a `RUN_RESULT` specifically for them.
   - Clicking **SUBMIT** sends a `SUBMIT_CODE` event. The client waits for the global `SUBMISSION_RESULT` or `BATTLE_END`.

## 🛠️ Tech Stack & Services
- **Styling**: Tailwind CSS with custom utility classes for the "Neo-Brutalism" look.
- **State Management**: `Zustand` (Global User Store) + Local React State (Room Logic).
- **Icons**: Lucide React.
- **Animations**: GSAP (ScrollTrigger, SplitText) + Framer Motion.

## ⚙️ Development
1. Install dependencies: `npm install`
2. Configure `.env.local` with your `NEXT_PUBLIC_WS_URL`.
3. Start the engine: `npm run dev`
