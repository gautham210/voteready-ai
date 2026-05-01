🚀 VoteReady AI — A production-grade civic platform that simulates the complete Indian voting process and uses Google Gemini AI to guide first-time voters in real-time.

> Powered by **Google Gemini 2.0 Flash** · Built for first-time Indian voters · Accessibility-first · Demo-proof

---

## ✨ Features

- Step-by-step voting simulation
- NOTA support
- AI-powered guidance (Gemini)
- Smart fallback system (zero failure UX)
- Accessibility-first design

---

## 🏆 Design Philosophy

- Government-grade reliability
- Startup-grade UX
- Zero-dependency fallback for critical flows

---

## 🗳️ What It Does

VoteReady AI combines a **step-by-step voting simulation** with an **AI-powered assistant** to help first-time voters in India understand:

- Voter eligibility requirements
- Document preparation
- Electoral roll registration
- The complete polling booth experience (ID check → officer verification → ink mark → EVM voting → NOTA)

---

## 🤖 AI System Architecture

Our hybrid system guarantees a zero-failure UX. 

- **Smart Fallback Engine**: Common questions (e.g., "Can I vote at 18?") are intercepted locally using a robust token-based matcher for instant, zero-latency answers. This completely bypasses network variability.
- **Selective Intelligence**: Google Gemini is reserved strictly for complex, unknown, or dynamic queries. This ensures we don't waste API quota on common knowledge, and the app never crashes during a live demo.
- **Graceful Error Handling**: If network fails or quota is exhausted, users see clear, actionable fallback messages instead of technical errors.

---

## 🚀 Google Services Integration

This project uses Google Gemini 2.0 Flash via the Generative Language API to:

- Answer real-time voter questions
- Handle eligibility, documents, and process queries
- Provide fallback-safe AI responses

The app ensures:
- Efficient API usage
- Zero-failure UX via hybrid fallback system

---

## ☁️ Google Services Impact

- **Google Gemini 2.0 Flash** → Provides real-time, context-aware voter guidance through the Generative Language API.
- **Google Maps** → Drives the polling discovery feature, allowing users to find their assigned polling station instantly.
- **Google Calendar** → Generates automated vote-day reminders seamlessly.

---

## 🚀 Getting Started

```bash
# 1. Clone and install
npm install

# 2. Set up your API key
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY from https://aistudio.google.com

# 3. Start the dev server
npm run dev
```

---

## 🧪 Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Tests cover:
- `useProgress` — task toggling and percentage calculation
- `useChatContext` — political guard, Gemini calls, error mapping, token-based matching, instant flag
- `gemini.js` — API request structure, error handling, key validation
- `BoothWalkthrough` — full 6-step flow integration

---

## 🔐 Security

- API keys are never committed and handled via environment variables
- API keys are stored in `.env` and are **never committed** to version control
- `.env` is listed in `.gitignore` — it will not appear in `git status` or be pushed
- Use `.env.example` as a template to set up your local environment
- **Never expose real API keys in public repositories**
- All debug logs containing the API key are gated behind `import.meta.env.DEV` — zero output in production builds
- External links use `noopener,noreferrer` to prevent tabnapping
- All chat message content is rendered as plain text — no `dangerouslySetInnerHTML`

---

## 🏗️ Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 3**
- **Lucide React** icons
- **Vitest** + **@testing-library/react** for testing
- **Google Gemini 2.0 Flash** for AI responses

---

## ♿ Accessibility

- All interactive elements use semantic `<button>` elements
- `aria-pressed` on toggle buttons
- `role="progressbar"` with `aria-valuenow/min/max`
- `role="dialog"` + `aria-modal` on chat panel
- `aria-live="polite"` on chat message list
- Keyboard: `Escape` closes chat, `Space`/`Enter` activates buttons
- `:focus-visible` ring for keyboard navigation
