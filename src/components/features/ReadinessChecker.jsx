import { CheckCircle2, Circle } from "lucide-react"
import { useReadiness } from "../../hooks/useReadiness"

export function ReadinessChecker() {
  const { formData, toggleField, percentage, suggestions } = useReadiness()

  return (
    <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Readiness Check</h3>
        <span className="text-xs font-bold text-slate-400">{percentage}%</span>
      </div>

      <div className="space-y-1.5 mb-3">
        {[
          { id: 'age', label: 'Minimum voting age' },
          { id: 'id', label: 'Acceptable ID' },
          { id: 'registered', label: 'Registered to vote' }
        ].map(item => (
          <div 
            key={item.id}
            className="flex items-center space-x-2 py-1.5 cursor-pointer group"
            onClick={() => toggleField(item.id)}
          >
            {formData[item.id] ? (
              <CheckCircle2 className="h-4 w-4 text-slate-400 group-hover:text-green-500 transition-colors" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            )}
            <span className={`text-xs ${formData[item.id] ? "text-slate-500 line-through" : "text-slate-600"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="bg-slate-50 border border-slate-100 text-slate-500 p-2.5 rounded-lg text-xs">
          <ul className="list-disc pl-4 space-y-0.5">
            {suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
