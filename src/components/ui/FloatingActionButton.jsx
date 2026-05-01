import { MessageCircle } from "lucide-react"

export function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 bg-primary-600 text-white rounded-full shadow-soft flex items-center justify-center hover:bg-primary-500 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 z-50"
      aria-label="Ask AI"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  )
}
