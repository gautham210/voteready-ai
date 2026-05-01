import { cn } from "../../utils"

/**
 * ChatBubble — renders a single message in the AI chat.
 *
 * Props:
 *   message   {string}  — text content
 *   isSenderAI {bool}   — true = AI bubble (left), false = user bubble (right)
 *   timestamp  {string} — optional formatted time string
 */
export function ChatBubble({ message, isSenderAI, timestamp }) {
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
          {/* Render message text safely — no dangerouslySetInnerHTML */}
          {message}
        </div>

        {timestamp && (
          <span
            className={cn(
              "text-[10px] text-slate-400 px-1",
              isSenderAI ? "text-left" : "text-right"
            )}
          >
            {timestamp}
          </span>
        )}
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
