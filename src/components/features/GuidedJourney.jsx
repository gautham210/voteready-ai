import { Sparkles, MapPin, Calendar, CheckSquare, Square } from "lucide-react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"

export const journeySteps = [
  {
    id: "eligibility",
    title: "📋 Voter Eligibility Verification",
    description: "Make sure you meet the basic requirements.",
    infoText: "Minimum voting age in India is 18 years.\n\nYou must also:\n• Be a citizen of India\n• Be registered in your constituency\n\nIf you're 17, you can pre-register before turning 18.",
    successText: "✔ Nice — you're eligible to vote!",
    tasks: [
      { id: "elig_age", label: "I meet the minimum voting age" },
      { id: "elig_citizen", label: "I meet citizenship requirements" }
    ]
  },
  {
    id: "registration",
    title: "🏛️ Electoral Roll Registration",
    description: "Complete your voter registration before the deadline.",
    infoText: "Register via NVSP / Voter Helpline app\nDeadline matters\nCan update address",
    successText: "✔ Great — your registration is sorted!",
    tasks: [
      { id: "reg_status", label: "Checked my registration status" },
      { id: "reg_deadline", label: "Verified my state's registration deadline" }
    ]
  },
  {
    id: "documents",
    title: "📄 Identity Verification Requirements",
    description: "Gather the necessary identification.",
    infoText: "You can carry ANY ONE of these:\n• Aadhaar Card\n• Voter ID\n• Passport\n• Driving License\n\nName should match your registration details.",
    successText: "✔ Perfect — you have your documents!",
    tasks: [
      { id: "doc_id", label: "I have a valid photo ID" },
      { id: "doc_address", label: "My ID shows my current address" }
    ]
  },
  {
    id: "voting_day",
    title: "🗳️ Polling Day Protocol",
    description: "Head to your assigned polling location.",
    hasLocationAction: true,
    hasCalendarAction: true,
    infoText: "Steps at polling booth:\n1. Show ID\n2. Get verified\n3. Go to EVM\n4. Press button\n5. Ink mark applied\n\nTakes ~5–10 minutes.",
    successText: "✔ Awesome — you're ready to vote!",
    tasks: [
      { id: "vote_location", label: "Found my polling station" },
      { id: "vote_time", label: "Planned a specific time to vote" }
    ]
  },
  {
    id: "after_voting",
    title: "✅ Post-Election Tracking",
    description: "Track results and share your civic duty.",
    infoText: "Ink mark meaning\nResults tracking\nImportance of participation",
    successText: "✔ Excellent — you're an active citizen!",
    tasks: [
      { id: "after_sticker", label: "Grabbed my 'I Voted' sticker" },
      { id: "after_track", label: "Know where to track election results" }
    ]
  }
];

// Helper to get all task IDs
export const getAllTaskIds = () => {
  return journeySteps.flatMap(step => step.tasks.map(t => t.id));
};

export function GuidedJourney({ progressHook, onAskAI }) {
  const { toggleTask, isComplete } = progressHook
  
  return (
    <div className="space-y-6">
      {journeySteps.map((step) => {
        const stepTasks = step.tasks;
        const completedCount = stepTasks.filter(t => isComplete(t.id)).length;
        const isStepFullyComplete = completedCount === stepTasks.length;

        let statusChip = null;
        if (completedCount === 0) {
          statusChip = <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1"><span className="text-[10px]">⚠️</span> Not completed</div>;
        } else if (completedCount < stepTasks.length) {
          statusChip = <div className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1"><span className="text-[10px]">⏳</span> Pending</div>;
        } else {
          statusChip = <div className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full flex items-center gap-1"><span className="text-[10px]">✅</span> Verified</div>;
        }

        return (
          <Card 
            key={step.id} 
            className={`transition-opacity duration-200 ease-out ${isStepFullyComplete ? 'border-primary-200 bg-primary-50/30' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-lg font-bold ${isStepFullyComplete ? 'text-primary-800' : 'text-slate-800'}`}>
                {step.title}
              </h3>
              {statusChip}
            </div>
            
            <p className="text-sm text-gray-600 mt-2 mb-4 whitespace-pre-line">
              {step.infoText}
            </p>

            {/* Task List */}
            <div className="space-y-2 mb-4">
              {stepTasks.map(task => {
                const checked = isComplete(task.id);
                return (
                  <div 
                    key={task.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-opacity duration-200 ease-out ${
                      checked ? 'bg-primary-50 border-primary-200 text-primary-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => {
                      toggleTask(task.id);
                    }}
                  >
                    {checked ? (
                      <CheckSquare className="h-5 w-5 text-primary-600 shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${checked ? 'line-through opacity-70' : ''}`}>
                      {task.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Micro-feedback */}
            {isStepFullyComplete && (
              <div className="mt-2 mb-4 text-sm font-medium text-emerald-600 transition-opacity duration-200 ease-out">
                {step.successText}
              </div>
            )}

            {/* External Actions for Voting Day */}
            {step.hasLocationAction && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=polling+station+near+me`, '_blank', 'noopener,noreferrer')}
                >
                  <MapPin className="h-4 w-4 mr-2" /> Find Polling Station
                </Button>
                {step.hasCalendarAction && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Voting+Day&details=Go+vote!&dates=20260503T040000Z/20260503T060000Z`, '_blank', 'noopener,noreferrer')}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Add Reminder
                  </Button>
                )}
              </div>
            )}

            <div className="flex justify-end mt-4 pt-4 border-t border-slate-50">
              <Button 
                variant="ghost" 
                onClick={() => onAskAI(step.title)}
                title="Explain Simpler"
                className="flex gap-2 text-amber-600 hover:bg-amber-50"
              >
                <Sparkles className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">Ask AI about this</span>
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
