import { MapPin, Calendar, FileText } from "lucide-react"
import { Button } from "../ui/Button"

export function TakeAction() {
  return (
    <div className="bg-gradient-to-br from-indigo-50/80 to-white p-6 rounded-2xl shadow-soft border border-indigo-100 transition-all hover:shadow-lg space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
        <span className="bg-primary-100 text-primary-600 p-1.5 rounded-lg text-sm">⚡</span>
        Take Action
      </h2>
      <p className="text-sm text-slate-600">Quick links to get you ready for election day.</p>
      
      <div className="space-y-3">
        <Button 
          className="w-full justify-start py-6 text-base shadow-sm hover:shadow-md transition-all"
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=polling+station+near+me`, '_blank')}
        >
          <MapPin className="h-5 w-5 mr-3 shrink-0" /> Find Polling Station
        </Button>
        
        <Button 
          variant="outline"
          className="w-full justify-start py-6 text-base"
          onClick={() => window.open(`https://vote.gov/`, '_blank')}
        >
          <FileText className="h-5 w-5 mr-3 text-slate-400 shrink-0" /> Register to Vote
        </Button>

        <Button 
          variant="outline"
          className="w-full justify-start py-6 text-base"
          onClick={() => window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Voting+Day&details=Go+vote!&dates=20260503T040000Z/20260503T060000Z`, '_blank')}
        >
          <Calendar className="h-5 w-5 mr-3 text-slate-400 shrink-0" /> Add Reminder
        </Button>
      </div>
    </div>
  )
}
