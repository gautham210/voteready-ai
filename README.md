# VoteReady AI

> A civic education platform guiding first-time Indian voters through the complete voting process — powered by **Google Gemini 2.0 Flash**.

---

## 🗳️ What It Does

VoteReady AI combines a **step-by-step voting simulation** with an **AI-powered assistant** to help first-time voters in India understand:

- Voter eligibility requirements
- Document preparation
- Electoral roll registration
- The complete polling booth experience (ID check → officer verification → ink mark → EVM voting → NOTA)

---

## ☁️ Google Services Used

| Service | Purpose |
|---|---|
| **Google Gemini 2.0 Flash** | AI assistant answering voter questions in 2–3 sentences |
| **Google Maps** | Polling station finder (via Maps Search URL) |
| **Google Calendar** | Vote-day reminder (via Calendar event URL) |
| **Generative Language API** | `generativelanguage.googleapis.com/v1beta` REST endpoint |

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
- `useChatContext` — political guard, Gemini calls, error mapping
- `gemini.js` — API request structure, error handling, key validation
- `BoothWalkthrough` — full 6-step flow integration

---

## 🔐 Security

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
