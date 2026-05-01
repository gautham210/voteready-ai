import { cn } from "../../utils"

export function Button({ className, variant = "primary", size = "default", children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-500 shadow-soft",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 text-slate-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-lg px-3",
    lg: "h-12 rounded-xl px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
