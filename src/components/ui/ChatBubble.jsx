import { memo } from "react"
import { cn } from "../../utils"

/**
 * ChatBubble — renders a single message in the AI chat.
 * Wrapped in React.memo to prevent unnecessary re-renders of the message list.
 *
 * Props:
 *   message   {string}  — text content
 *   isSenderAI {bool}   — true = AI bubble (left), false = user bubble (right)
 *   timestamp  {string} — optional formatted time string
 *   instant    {bool}   — true = predefined answer (⚡), false = Gemini answer (🤖)
 */
export const ChatBubble = memo(function ChatBubble({ message, isSenderAI, timestamp, instant = false }) {
  return (
    <div
      className={cn(
        "flex w-full mb-3 fade-in",
        isSenderAI ? "justify-start" : "justify-end"
      )}
      role="listitem"
    >
      {/* AI avatar dot */}
      {isSenderAI && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1"
        >
          AI
        </div>
      )}

      <div className="flex flex-col gap-0.5 max-w-[82%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isSenderAI
              ? "bg-white text-slate-800 rounded-tl-sm border border-slate-100 shadow-sm"
              : "bg-primary-600 text-white rounded-tr-sm shadow-sm"
          )}
        >
          {/* Plain text only — no HTML rendering, XSS-safe */}
          {message}
        </div>

        {/* Status badge + timestamp row */}
        <div className={cn(
          "flex items-center gap-2 px-1",
          isSenderAI ? "justify-start" : "justify-end"
        )}>
          {isSenderAI && (
            <span className="text-[9px] font-medium text-slate-400">
              {instant ? "⚡ Instant answer" : "🤖 AI response"}
            </span>
          )}
          {timestamp && (
            <span className="text-[9px] text-slate-400">
              {timestamp}
            </span>
          )}
        </div>
      </div>

      {/* User avatar dot */}
      {!isSenderAI && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold ml-2 mt-1"
        >
          You
        </div>
      )}
    </div>
  )
}
