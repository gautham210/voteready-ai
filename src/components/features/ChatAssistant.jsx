import { useState, useRef, useEffect, useCallback } from "react"
import { Send, X, Sparkles } from "lucide-react"
import { useChatContext } from "../../hooks/useChatContext"
import { ChatBubble } from "../ui/ChatBubble"

/**
 * ChatAssistant
 * Powered by Google Gemini 2.0 Flash via the Generative Language API.
 *
 * Security note: VITE_GEMINI_API_KEY is injected at build time via .env
 * and must NEVER be committed to source control (.gitignore enforced).
 */

// Module-level constant — not recreated on every render
const QUICK_QUESTIONS = [
  "Can I vote at 18?",
  "What ID do I need?",
  "How does voting work?",
]

export function ChatAssistant({ isOpen, onClose, currentStep }) {
  const { messages, sendMessage, isTyping } = useChatContext(currentStep)
  const [input, setInput] = useState("")
  const scrollRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Escape key closes the dialog
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  const handleSend = useCallback((e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    sendMessage(trimmed)
    setInput("")
  }, [input, isTyping, sendMessage])

  // Stable click handler for quick-question chips
  const handleChip = useCallback((q) => {
    sendMessage(q)
  }, [sendMessage])

  if (!isOpen) return null

  return (
    /* Backdrop — click outside panel to close */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="VoteReady AI Assistant"
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/30 backdrop-blur-sm sm:items-end sm:justify-end sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div className="flex flex-col h-full w-full bg-white sm:max-w-md sm:h-[620px] sm:rounded-2xl shadow-glass overflow-hidden">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-sm leading-none">VoteReady AI</h2>
              <p className="text-[10px] text-primary-100 mt-0.5 leading-none">
                {currentStep ? `Context: ${currentStep}` : "Indian Voting Assistant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Gemini badge — highlights Google Gemini integration */}
            <span
              title="Google Gemini 2.0 Flash"
              className="text-[9px] font-semibold bg-white/20 rounded-full px-2 py-0.5 tracking-wide"
            >
              Powered by Gemini
            </span>
            <button
              onClick={onClose}
              aria-label="Close AI assistant"
              className="p-1.5 hover-lift rounded-full hover:bg-white/20 btn-press"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Message list ─────────────────────────────────────────────── */}
        {/*
          role="log" is the correct ARIA role for a live message feed.
          aria-live="polite" announces new messages to screen readers.
        */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              isSenderAI={msg.sender === "ai"}
              timestamp={msg.timestamp}
              instant={msg.instant}
            />
          ))}

          {/* Typing indicator — only shown while Gemini is responding */}
          {isTyping && (
            <div className="flex w-full mb-3 justify-start" aria-label="AI is thinking">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 flex-shrink-0"
              >
                AI
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <span className="flex space-x-1 items-center h-4" aria-hidden="true">
                  <span className="typing-dot h-1.5 w-1.5 bg-slate-400 rounded-full" />
                  <span className="typing-dot h-1.5 w-1.5 bg-slate-400 rounded-full" />
                  <span className="typing-dot h-1.5 w-1.5 bg-slate-400 rounded-full" />
                </span>
                <span className="sr-only">AI is thinking…</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Quick-question chips — shown only before first user message ─ */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 py-2 bg-white border-t border-slate-100">
            <p
              id="quick-questions-label"
              className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wide"
            >
              Suggested questions
            </p>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-labelledby="quick-questions-label"
            >
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  aria-label={`Ask: ${q}`}
                  onClick={() => handleChip(q)}
                  className="text-xs bg-slate-100 hover-lift btn-press text-slate-700 rounded-full px-3 py-1.5 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input form ────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSend}
          className="px-3 py-3 border-t border-slate-100 bg-white flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            id="chat-input"
            name="chat-input"
            className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 border border-transparent focus:border-primary-300"
            placeholder="Ask about voting in India…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            autoComplete="off"
            aria-label="Ask about voting in India"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="p-2.5 bg-primary-600 text-white rounded-xl hover-lift btn-press disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        {/* Legal disclaimer */}
        <p className="text-center text-[9px] text-slate-400 pb-2 bg-white">
          VoteReady AI provides general guidance only — not legal advice.
        </p>

      </div>
    </div>
  )
}
