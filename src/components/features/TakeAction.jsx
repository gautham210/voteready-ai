import { MapPin, Calendar, FileText } from "lucide-react"
import { Button } from "../ui/Button"
import { openExternalLink, openGoogleMaps, addToGoogleCalendar } from "../../utils"

export function TakeAction() {
  return (
    <div className="bg-gradient-to-br from-indigo-50/80 to-white p-6 rounded-2xl shadow-soft border border-indigo-100 transition-all hover:shadow-lg space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
        <span className="bg-primary-100 text-primary-600 p-1.5 rounded-lg text-sm" aria-hidden="true">⚡</span>
        Take Action
      </h2>
      <p className="text-sm text-slate-600">Quick links to get you ready for election day.</p>
      
      <div className="space-y-3">
        <Button 
          className="w-full justify-start py-6 text-base shadow-sm hover:shadow-md transition-all"
          onClick={() => openGoogleMaps("polling station near me")}
          aria-label="Find Polling Station on Google Maps"
        >
          <MapPin className="h-5 w-5 mr-3 shrink-0" aria-hidden="true" /> Find Polling Station
        </Button>
        
        <Button 
          variant="outline"
          className="w-full justify-start py-6 text-base"
          onClick={() => openExternalLink("https://vote.gov/")}
          aria-label="Register to Vote"
        >
          <FileText className="h-5 w-5 mr-3 text-slate-400 shrink-0" aria-hidden="true" /> Register to Vote
        </Button>

        <Button 
          variant="outline"
          className="w-full justify-start py-6 text-base"
          onClick={addToGoogleCalendar}
          aria-label="Add Reminder to Google Calendar"
        >
          <Calendar className="h-5 w-5 mr-3 text-slate-400 shrink-0" aria-hidden="true" /> Add Reminder
        </Button>
      </div>
    </div>
  )
}
