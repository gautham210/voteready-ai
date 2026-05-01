import { useState, useCallback } from 'react';
import { getGeminiResponse } from '../lib/gemini';

/** Exact phrases that are unambiguously requests for political opinions. */
const POLITICAL_PHRASES = [
  "who should i vote for",
  "best party to vote",
];

const POLITICAL_BLOCK_MSG =
  "I can explain the voting process, but I can't advise who or which party to vote for — that's entirely your private decision! 🗳️";

/**
 * Predefined knowledge base — instant answers with zero API calls.
 * Covers the most common first-time voter questions.
 * Powered by Google Gemini for everything not listed here.
 */
const SUGGESTED_QA = {
  "can i vote at 18":
    "Yes. The minimum voting age in India is 18. You must also be an Indian citizen and registered in your constituency.",

  "what id do i need":
    "You can carry any one valid photo ID such as Aadhaar Card, Voter ID (EPIC), Passport, or Driving License.",

  "how does voting work":
    "At the polling booth, your ID is verified, your name is checked in the voter list, ink is applied, and you cast your vote on the EVM.",

  "can i vote without voter id":
    "Yes, you can vote without a voter ID if your name is in the electoral roll and you carry another approved photo ID like Aadhaar or Passport.",

  "what is nota":
    "NOTA (None Of The Above) allows you to reject all candidates. Your vote is counted but not given to any candidate.",

  "where do i vote":
    "You must vote at your assigned polling station. You can find it using the NVSP portal or Voter Helpline app.",
};

/**
 * Normalize a string for fuzzy matching:
 * lowercase, remove punctuation, collapse whitespace.
 */
const normalize = (text) =>
  text.toLowerCase().replace(/[^\w\s]/g, "").trim();

/**
 * Check whether the user's input contains any predefined Q&A key.
 * Returns the predefined answer string, or null if no match.
 *
 * Examples that match:
 *   "im 18 can i vote at 18 now?"  → matches "can i vote at 18"
 *   "what id do i need to vote?"   → matches "what id do i need"
 */
const findBestMatch = (input) => {
  const normalizedInput = normalize(input);
  for (const key of Object.keys(SUGGESTED_QA)) {
    if (normalizedInput.includes(key)) {
      return SUGGESTED_QA[key];
    }
  }
  return null;
};

/** Format HH:MM for message timestamps. */
function nowTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Create a well-formed message object. */
function makeMsg(sender, text) {
  return { id: Date.now() + Math.random(), sender, text, timestamp: nowTime() };
}

/**
 * useChatContext — Smart Hybrid AI System
 *
 * Priority order:
 *   1. Political guard       → instant block, no API call
 *   2. Predefined knowledge  → instant answer, no API call, no loading state
 *   3. Google Gemini 2.0 Flash → dynamic answer via generativelanguage.googleapis.com
 *   4. Error fallback        → graceful, specific message per failure type
 *
 * @param {string} currentStep — walkthrough step label injected as Gemini context
 */
export function useChatContext(currentStep) {
  const [messages, setMessages] = useState([
    makeMsg(
      "ai",
      "Hi! I'm VoteReady AI 🗳️ Ask me anything about voting in India — eligibility, documents, or the process."
    ),
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const appendMsg = useCallback((sender, text) => {
    setMessages((prev) => [...prev, makeMsg(sender, text)]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    // Guard: empty / whitespace-only input
    const trimmed = text?.trim();
    if (!trimmed) return;

    // Guard: prevent double-send while Gemini is responding
    // (predefined answers are synchronous so this guard doesn't affect them)
    if (isTyping) return;

    appendMsg("user", trimmed);

    const lower = trimmed.toLowerCase();

    // ── Priority 1: Block political opinion requests ───────────────────────
    if (POLITICAL_PHRASES.some((p) => lower.includes(p))) {
      appendMsg("ai", POLITICAL_BLOCK_MSG);
      return;
    }

    // ── Priority 2: Predefined knowledge base (instant, no loading state) ─
    const predefined = findBestMatch(trimmed);
    if (predefined) {
      appendMsg("ai", predefined);
      return;
    }

    // ── Priority 3: Google Gemini 2.0 Flash ───────────────────────────────
    setIsTyping(true);

    const context = currentStep
      ? `The user is on step: "${currentStep}" of the Indian voting walkthrough.`
      : "";

    try {
      const reply = await getGeminiResponse(trimmed, context);
      appendMsg("ai", reply);
    } catch (err) {
      console.error("[VoteReady AI] Gemini error:", err.message);

      const m = err.message ?? "";

      // ── Priority 4: Specific, actionable error messages ─────────────────
      if (m.includes("429") || m.includes("quota") || m.includes("RESOURCE_EXHAUSTED")) {
        appendMsg(
          "ai",
          "⚠️ AI quota exhausted for today. Please try again tomorrow or set up a new API key."
        );
      } else if (
        m.includes("NetworkError") ||
        m.includes("Failed to fetch") ||
        m.includes("502") ||
        m.includes("503") ||
        m.includes("Service Unavailable")
      ) {
        appendMsg(
          "ai",
          "⚠️ AI service is temporarily unavailable. Please check your internet connection and try again."
        );
      } else if (m.includes("Missing Gemini API key")) {
        appendMsg(
          "ai",
          "⚠️ AI is not configured. Please set VITE_GEMINI_API_KEY in your .env file and restart the dev server."
        );
      } else {
        appendMsg("ai", "Something went wrong. Please try again in a moment.");
      }
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, currentStep, appendMsg]);

  return { messages, sendMessage, isTyping };
}
