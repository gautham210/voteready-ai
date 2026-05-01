import { useState, useCallback, useMemo } from 'react';
import { getGeminiResponse } from '../lib/gemini';
import {
  POLITICAL_PHRASES,
  POLITICAL_BLOCK_MSG,
  findBestMatch,
  mapGeminiError,
} from '../utils';

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
 * Provides a production-grade chat state manager with priority-based routing:
 *   1. Political guard        → instant block, no API call
 *   2. Predefined knowledge   → instant answer, no API call, no loading state
 *   3. Google Gemini 2.0 Flash → dynamic answer via generativelanguage.googleapis.com
 *   4. Error fallback         → graceful, specific message per failure type
 *
 * @param {string} currentStep — Current walkthrough step label (e.g. "ID Verification") injected as Gemini context
 * @returns {{ messages: Array<Object>, sendMessage: Function, isTyping: boolean }}
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
      if (import.meta.env.DEV) {
        console.error("[VoteReady AI] Gemini error:", err.message);
      }

      // ── Priority 4: Specific, actionable error messages ──────────────────
      const fallbackMsg = mapGeminiError(err.message);
      appendMsg("ai", fallbackMsg, false);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, currentStep, appendMsg]);

  // Memoize return value to prevent unnecessary re-renders in consumer components
  return useMemo(() => ({
    messages,
    sendMessage,
    isTyping
  }), [messages, sendMessage, isTyping]);
}
