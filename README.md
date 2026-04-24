# ⚡ Explain My Code Like I'm 5

A single-file React application that takes any code snippet and instantly returns beginner-friendly explanations, deep technical breakdowns, bug reports, flowchart descriptions, and interview prep — all powered by the Claude AI API.

---

## ✨ Features

| Feature | Description |
|---|---|
| **ELI5 Explanation** | Simple, friendly breakdown anyone can understand |
| **Intermediate Explanation** | Clear walkthrough for developers still learning |
| **Advanced / Technical** | Design patterns, edge cases, implementation details |
| **Execution Flow** | Numbered step-by-step of what happens at runtime |
| **Real-World Analogy** | One metaphor that maps directly to the code's behaviour |
| **Time & Space Complexity** | Big-O analysis with reasoning |
| **Pseudocode** | Language-agnostic pseudocode of the logic |
| **Flowchart Description** | Structured node-by-node flow you can draw or diagram |
| **Bug Detection** | Risky patterns, severity ratings, and suggested fixes |
| **Improvements** | 3–5 concrete optimisations |
| **Interview Mode** | 5 senior-engineer questions with model answers |
| **Voice Avatar** | Web Speech API reads the ELI5 explanation aloud |
| **Dark Mode** | One-click toggle |
| **Session History** | Last 10 analyses stored in-session |
| **Export** | Download the full explanation as a `.txt` file |

---

## 🛠 Tech Stack

- **React 18** — functional components + hooks only
- **Claude API** (`claude-sonnet-4-20250514`) — all AI generation
- **Web Speech API** — browser-native voice playback, no extra dependency
- **Tailwind CSS variables** — theming via CSS custom properties
- **Zero external UI libraries** — everything is hand-rolled

---

## 📁 Project Structure

```
explain-my-code.jsx   ← entire app in one file (MVP)
README.md
```

This is an MVP / proof-of-concept. All components, hooks, and styles live in a single `.jsx` file for portability. The production-ready version with Monaco Editor, Mermaid diagrams, Supabase auth, .NET backend, and PostgreSQL persistence lives in the `/explain-my-code/` directory.

---

## 🚀 Getting Started

### Option A — Drop into any Vite + React project

```bash
# 1. Create a new Vite project (skip if you have one)
npm create vite@latest my-app -- --template react
cd my-app
npm install

# 2. Replace src/App.jsx with explain-my-code.jsx
cp explain-my-code.jsx src/App.jsx

# 3. Start the dev server
npm run dev
```

### Option B — Claude.ai Artifacts

Paste the contents of `explain-my-code.jsx` directly into a Claude Artifact (React mode). It runs in-browser with no setup.

---

## 🔑 API Key

The app calls the Anthropic API directly from the browser. This is fine for local dev and demos.

For production, proxy the request through a backend (see the full-stack version) so your API key is never exposed to the client.

The Claude API endpoint used:
```
POST https://api.anthropic.com/v1/messages
Model: claude-sonnet-4-20250514
```

No API key configuration is needed when running inside Claude.ai Artifacts — the key is injected automatically.

---

## 🖥 Supported Languages

JavaScript · TypeScript · Python · Java · C# · C++ · Go · Rust

Sample code is pre-loaded for JavaScript, Python, and Java. Switching the language dropdown reloads the sample automatically.

---

## 📸 UI Overview

```
┌─────────────────────────────────────────────────────────┐
│  ⚡ ExplainMyCode              [History] [Dark] [Sign in] │
├──────────────────────────┬──────────────────────────────┤
│  Language ▾  Upload  Clear│  Explanations│Flow│Bugs│Interview │
│                           │                              │
│   CODE EDITOR             │   RESULTS PANEL             │
│   (syntax-highlighted     │   (streams in as AI         │
│    textarea)              │    responds)                │
│                           │                              │
│  [──────── Analyze ──────]│                              │
│  🤖 [▶ ELI5 voice] [■]   │                              │
└──────────────────────────┴──────────────────────────────┘
```

---

## 🗺 Roadmap (Full-Stack Version)

The production upgrade (`/explain-my-code/`) adds:

- **Monaco Editor** — full IDE syntax highlighting with line numbers
- **Mermaid.js** — renders actual flowchart diagrams
- **.NET 8 Web API backend** — proxies Claude, handles auth, stores history
- **PostgreSQL** — persistent analysis history per user
- **Supabase / Auth0** — JWT-based authentication
- **SSE Streaming** — token-by-token streaming via Server-Sent Events
- **Docker Compose** — one-command full-stack startup

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙏 Built With

- [Anthropic Claude](https://www.anthropic.com) — AI engine
- [React](https://react.dev) — UI framework
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — voice synthesis
