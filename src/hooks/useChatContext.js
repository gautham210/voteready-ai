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
 * lowercase, strip punctuation, trim whitespace.
 */
const normalize = (text) =>
  text.toLowerCase().replace(/[^\w\s]/g, "").trim();

/**
 * Token-based matcher — more robust than pure substring matching.
 * Handles real-world phrasing like "i'm 18 can i vote?" or "need an id".
 *
 * Returns the matched answer string, or null.
 */
const findBestMatch = (input) => {
  const text = normalize(input);

  // "id" keyword → document question (check before "vote" tests)
  if (text.includes("id")) {
    return SUGGESTED_QA["what id do i need"];
  }

  // voting age — must mention "vote" AND "18"
  if (text.includes("vote") && text.includes("18")) {
    return SUGGESTED_QA["can i vote at 18"];
  }

  // NOTA explanation
  if (text.includes("nota")) {
    return SUGGESTED_QA["what is nota"];
  }

  // Polling location
  if (text.includes("where") && text.includes("vote")) {
    return SUGGESTED_QA["where do i vote"];
  }

  // Voting without voter ID card
  if (text.includes("without") && text.includes("voter")) {
    return SUGGESTED_QA["can i vote without voter id"];
  }

  // General process question
  if (text.includes("how") && text.includes("vote")) {
    return SUGGESTED_QA["how does voting work"];
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

/**
 * Create a well-formed message object.
 * @param {"ai"|"user"} sender
 * @param {string} text
 * @param {boolean} [instant] - true for predefined answers (shows ⚡ badge)
 */
function makeMsg(sender, text, instant = false) {
  return {
    id: Date.now() + Math.random(),
    sender,
    text,
    timestamp: nowTime(),
    instant, // used by ChatBubble to show ⚡ Instant answer vs 🤖 AI response
  };
}

/**
 * useChatContext — Smart Hybrid AI System
 *
 * Priority order:
 *   1. Political guard        → instant block, no API call
 *   2. Predefined knowledge   → instant answer, no API call, no loading state
 *   3. Google Gemini 2.0 Flash → dynamic answer via generativelanguage.googleapis.com
 *   4. Error fallback         → graceful, specific message per failure type
 *
 * @param {string} currentStep — walkthrough step label injected as Gemini context
 */
export function useChatContext(currentStep) {
  const [messages, setMessages] = useState([
    makeMsg(
      "ai",
      "Hi! I'm VoteReady AI 🗳️ Ask me anything about voting in India — eligibility, documents, or the process.",
      false
    ),
  ]);
  const [isTyping, setIsTyping] = useState(false);

  /** Append a message. `instant` marks predefined responses. */
  const appendMsg = useCallback((sender, text, instant = false) => {
    setMessages((prev) => [...prev, makeMsg(sender, text, instant)]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    // Guard: empty / whitespace-only input
    const trimmed = text?.trim();
    if (!trimmed) return;

    // Guard: prevent double-send while Gemini is responding
    if (isTyping) return;

    appendMsg("user", trimmed);

    const lower = trimmed.toLowerCase();

    // ── Priority 1: Block political opinion requests ───────────────────────
    if (POLITICAL_PHRASES.some((p) => lower.includes(p))) {
      appendMsg("ai", POLITICAL_BLOCK_MSG, true);
      return;
    }

    // ── Priority 2: Predefined knowledge base (instant, no loading state) ─
    const predefined = findBestMatch(trimmed);
    if (predefined) {
      appendMsg("ai", predefined, true); // instant=true → ⚡ badge in UI
      return;
    }

    // ── Priority 3: Google Gemini 2.0 Flash ───────────────────────────────
    setIsTyping(true);

    const context = currentStep
      ? `The user is on step: "${currentStep}" of the Indian voting walkthrough.`
      : "";

    try {
      const reply = await getGeminiResponse(trimmed, context);
      appendMsg("ai", reply, false); // instant=false → 🤖 badge in UI
    } catch (err) {
      console.error("[VoteReady AI] Gemini error:", err.message);

      const m = err.message ?? "";

      // ── Priority 4: Specific, actionable error messages ──────────────────
      if (m.includes("429") || m.includes("quota") || m.includes("RESOURCE_EXHAUSTED")) {
        appendMsg(
          "ai",
          "⚠️ AI quota exhausted for today. Please try again tomorrow or set up a new API key.",
          false
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
          "⚠️ AI service is temporarily unavailable. Please check your internet connection and try again.",
          false
        );
      } else if (m.includes("Missing Gemini API key")) {
        appendMsg(
          "ai",
          "⚠️ AI is not configured. Please set VITE_GEMINI_API_KEY in your .env file and restart the dev server.",
          false
        );
      } else {
        appendMsg("ai", "Something went wrong. Please try again in a moment.", false);
      }
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, currentStep, appendMsg]);

  return { messages, sendMessage, isTyping };
}
