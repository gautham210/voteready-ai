import { cn } from "../../utils"

export function ProgressBar({ progress, className }) {
  return (
    <div
      className={cn("w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner", className)}
      role="progressbar"
      aria-valuenow={Math.max(progress, 0)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Voting preparation progress"
    >
      <div 
        className="bg-primary-600 h-3 rounded-full transition-all duration-700 ease-out" 
        style={{ width: `${Math.max(progress, 0)}%` }}
      ></div>
    </div>
  )
}
