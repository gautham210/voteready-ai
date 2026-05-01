import { Sparkles, MapPin, Calendar } from "lucide-react"
import { openGoogleMaps, addToGoogleCalendar } from "../../utils"

/**
 * CommandBar — sticky bottom (mobile) / top (desktop) action bar.
 * Displays progress and quick-access Google service integrations.
 */
export function CommandBar({ progressPercentage, milestoneMessage, onAskAI, isChatOpen }) {
  return (
    <div className="fixed lg:sticky lg:top-0 bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t lg:border-t-0 lg:border-b border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:shadow-sm px-4 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Progress */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
            <svg className="w-10 h-10 transform -rotate-90" aria-hidden="true">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
              <circle
                cx="20" cy="20" r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="100.53"
                strokeDashoffset={100.53 - (100.53 * progressPercentage) / 100}
                className="text-indigo-500 transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-slate-700" aria-label={`Progress: ${progressPercentage}%`}>{progressPercentage}%</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
            <p className="text-sm font-semibold text-slate-800">{milestoneMessage}</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onAskAI("General")}
            aria-label="Ask VoteReady AI a question"
            aria-expanded={isChatOpen}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Ask AI</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1" aria-hidden="true"></div>

          <button
            onClick={() => openGoogleMaps("polling station near me")}
            aria-label="Find my polling booth on Google Maps"
            className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline text-sm font-medium">Booth</span>
          </button>

          <button
            onClick={addToGoogleCalendar}
            aria-label="Add voting day reminder to Google Calendar"
            className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline text-sm font-medium">Reminder</span>
          </button>
        </div>
      </div>
    </div>
  )
}
