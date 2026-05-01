import { useState, useMemo } from 'react'
import { ProgressBar } from './components/ui/ProgressBar'
import { FloatingActionButton } from './components/ui/FloatingActionButton'
import { ReadinessChecker } from './components/features/ReadinessChecker'
import { GuidedJourney, getAllTaskIds } from './components/features/GuidedJourney'
import { ChatAssistant } from './components/features/ChatAssistant'
import { TakeAction } from './components/features/TakeAction'
import { BoothWalkthrough } from './components/features/BoothWalkthrough'
import { CommandBar } from './components/ui/CommandBar'
import { useProgress } from './hooks/useProgress'

function App() {
  const [userType, setUserType] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState("General")
  
  const allTaskIds = useMemo(() => getAllTaskIds(), [])
  const progressHook = useProgress(allTaskIds)
  const { progressPercentage } = progressHook

  const getMilestoneMessage = (pct) => {
    if (pct === 100) return "🎉 All done — you're fully ready to vote!"
    if (pct >= 80) return "🔥 Almost there — just one step left"
    if (pct >= 50) return "🚀 Halfway there — keep going!"
    if (pct >= 20) return "👍 Great start — let's prepare"
    return "👋 Let's get started"
  }

  const handleAskAI = (context = "General") => {
    setChatContext(context)
    setIsChatOpen(true)
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-soft text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-primary-100 text-primary-600 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🗳️</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to VoteReady AI</h1>
          <p className="text-slate-500 mb-8">Before we begin, tell us a bit about yourself.</p>
          
          <div className="space-y-4">
            <button 
              className="w-full p-4 border-2 border-slate-100 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all font-medium text-left flex justify-between items-center group bg-white hover:-translate-y-0.5"
              onClick={() => setUserType('first-time')}
            >
              <span>I'm a first-time voter</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600">→</span>
            </button>
            <button 
              className="w-full p-4 border-2 border-slate-100 rounded-2xl hover:border-primary-500 hover:shadow-md transition-all font-medium text-left flex justify-between items-center group bg-white hover:-translate-y-0.5"
              onClick={() => setUserType('experienced')}
            >
              <span>I've voted before</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600">→</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background text-slate-800 pb-24 lg:pb-0 animate-in fade-in duration-500 ${progressPercentage === 100 ? 'animate-confetti' : ''}`}>
      <CommandBar 
        progressPercentage={progressPercentage} 
        milestoneMessage={getMilestoneMessage(progressPercentage)}
        onAskAI={handleAskAI}
      />

      {/* Mobile Header (minimal) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 py-3 mb-6">
        <h1 className="font-bold text-lg flex items-center justify-center gap-2">
          <span className="bg-primary-600 text-white p-1 rounded-md text-sm">🗳️</span> 
          VoteReady AI
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          
          {/* LEFT PANEL: Sticky Progress Tracker (Desktop only) */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="sticky top-12">
              <h1 className="font-bold text-2xl flex items-center gap-2 mb-8">
                <span className="bg-primary-600 text-white p-2 rounded-xl text-lg">🗳️</span> 
                VoteReady AI
              </h1>

              <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 mb-8 transition-all hover:shadow-lg">
                <h2 className="text-xl font-bold mb-2">Your Progress</h2>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-4xl font-extrabold text-primary-600">{progressPercentage}%</span>
                </div>
                <ProgressBar progress={progressPercentage} />
                <p className="text-slate-600 font-medium mt-3">
                  {getMilestoneMessage(progressPercentage)}
                </p>
              </div>
              <TakeAction />
              <div className="mt-8">
                <ReadinessChecker />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Tasks & Guided Journey */}
          <div className="lg:col-span-8 space-y-8">
            <section className="lg:hidden">
              <h2 className="text-2xl font-bold mb-2">
                {userType === 'first-time' ? "Let's get you ready to vote!" : "Welcome back, voter!"}
              </h2>
              <p className="text-slate-600">Follow the steps below to ensure you're fully prepared for election day.</p>
            </section>

            <div className="lg:hidden space-y-8 mb-8">
              <TakeAction />
              <ReadinessChecker />
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-6 hidden lg:block">Your Voting Tasks</h2>
              <h2 className="text-xl font-bold mb-4 lg:hidden">Your Voting Tasks</h2>
              <GuidedJourney progressHook={progressHook} onAskAI={handleAskAI} />
            </section>

            <section className="mt-12">
              <BoothWalkthrough />
            </section>
          </div>
        </div>
      </main>

      <ChatAssistant 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentStep={chatContext} 
      />
    </div>
  )
}

export default App
