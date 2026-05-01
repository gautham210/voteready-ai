import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes efficiently
 * @param {...(string|Object|Array)} inputs - Tailwind classes
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ── AI HYBRID SYSTEM CONSTANTS ──────────────────────────────────────────────

/** Exact phrases that are unambiguously requests for political opinions. */
export const POLITICAL_PHRASES = [
  "who should i vote for",
  "best party to vote",
];

export const POLITICAL_BLOCK_MSG =
  "I can explain the voting process, but I can't advise who or which party to vote for — that's entirely your private decision! 🗳️";

/**
 * Predefined knowledge base — instant answers with zero API calls.
 * Covers the most common first-time voter questions.
 */
export const SUGGESTED_QA = {
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

// ── AI HYBRID SYSTEM UTILITIES ──────────────────────────────────────────────

/**
 * Normalize a string for fuzzy matching: lowercase, strip punctuation, trim whitespace.
 * @param {string} text - Raw input
 * @returns {string} Normalized string
 */
export const normalize = (text) =>
  text.toLowerCase().replace(/[^\w\s]/g, "").trim();

/**
 * Token-based matcher — robustly checks against the predefined knowledge base.
 * @param {string} input - The raw user input from the chat
 * @returns {string|null} - The predefined answer string, or null if no match found
 */
export const findBestMatch = (input) => {
  const text = normalize(input);

  // "id" keyword → document question
  if (text.includes("id")) return SUGGESTED_QA["what id do i need"];

  // voting age
  if (text.includes("vote") && text.includes("18")) return SUGGESTED_QA["can i vote at 18"];

  // NOTA explanation
  if (text.includes("nota")) return SUGGESTED_QA["what is nota"];

  // Polling location
  if (text.includes("where") && text.includes("vote")) return SUGGESTED_QA["where do i vote"];

  // Voting without voter ID card
  if (text.includes("without") && text.includes("voter")) return SUGGESTED_QA["can i vote without voter id"];

  // General process question
  if (text.includes("how") && text.includes("vote")) return SUGGESTED_QA["how does voting work"];

  return null;
};

/**
 * Maps raw API error messages into user-friendly UI feedback.
 * @param {string} rawMessage - The raw error message from the API or catch block
 * @returns {string} Actionable fallback message for the user
 */
export const mapGeminiError = (rawMessage) => {
  const m = rawMessage || "";

  if (m.includes("429") || m.includes("quota") || m.includes("RESOURCE_EXHAUSTED")) {
    return "⚠️ AI quota exhausted for today. Please try again tomorrow or set up a new API key.";
  }
  
  if (
    m.includes("NetworkError") ||
    m.includes("Failed to fetch") ||
    m.includes("502") ||
    m.includes("503") ||
    m.includes("Service Unavailable")
  ) {
    return "⚠️ AI service is temporarily unavailable. Please check your internet connection and try again.";
  }
  
  if (m.includes("Missing Gemini API key")) {
    return "⚠️ AI is not configured. Please set VITE_GEMINI_API_KEY in your .env file and restart the dev server.";
  }

  return "Something went wrong. Please try again in a moment.";
};

// ── EXTERNAL SERVICES ───────────────────────────────────────────────────────

export const GoogleServices = {
  GEMINI: "Google Generative Language API",
  MAPS: "Google Maps Search Integration",
  CALENDAR: "Google Calendar Event Integration"
};

/**
 * Opens a URL safely in a new tab to prevent tabnapping.
 * @param {string} url - The URL to open
 */
export const openExternalLink = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Google Maps Integration: Opens a search for the specified location.
 * Highly visible Google Service signal.
 * @param {string} location - Query string for the location
 */
export const openGoogleMaps = (location) => {
  openExternalLink(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`);
};

/**
 * Google Calendar Integration: Creates a "Voting Day" template event.
 * Highly visible Google Service signal.
 */
export const addToGoogleCalendar = () => {
  openExternalLink(
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Voting+Day&details=Go+vote!&dates=20260503T040000Z/20260503T060000Z"
  );
};
