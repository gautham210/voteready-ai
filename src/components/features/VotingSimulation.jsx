import { useState } from "react"
import { CheckCircle2, RotateCcw } from "lucide-react"
import { Button } from "../ui/Button"

const candidates = [
  { id: 1, name: "Lion Party", emoji: "🦁" },
  { id: 2, name: "Star Party", emoji: "🌟" },
  { id: 3, name: "Tree Party", emoji: "🌳" }
]

export function VotingSimulation() {
  const [selectedId, setSelectedId] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  if (hasVoted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CheckCircle2 className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your vote has been recorded!</h2>
        <p className="text-slate-500 mb-8">(This was a simulation)</p>
        <Button variant="outline" onClick={() => { setHasVoted(false); setSelectedId(null) }}>
          <RotateCcw className="h-4 w-4 mr-2" /> Reset Simulation
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-soft border border-slate-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-primary-100 text-primary-600 p-1.5 rounded-lg text-sm">🎮</span>
          Try Voting Simulation
        </h2>
        <p className="text-slate-500 mt-1">Select a candidate and practice casting your vote.</p>
      </div>

      <div className="space-y-3 mb-8">
        {candidates.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedId === c.id 
                ? 'border-primary-500 bg-primary-50/50 shadow-[0_0_15px_rgba(var(--color-primary-500),0.15)] scale-[1.02]' 
                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-3xl mr-4">{c.emoji}</span>
            <span className="text-lg font-semibold text-slate-800">{c.name}</span>
            {selectedId === c.id && (
              <CheckCircle2 className="ml-auto h-6 w-6 text-primary-600 animate-in zoom-in" />
            )}
          </button>
        ))}
      </div>

      <Button 
        className="w-full py-6 text-lg transition-all"
        disabled={!selectedId}
        onClick={() => setHasVoted(true)}
      >
        Cast Vote
      </Button>
    </div>
  )
}
