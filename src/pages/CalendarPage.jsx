import { useState, useEffect, useCallback, useRef, cloneElement } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/he'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getCalendarEvents } from '../api/calendar'
import EventDetailPanel from '../components/EventDetailPanel'
import CreateFromSlotModal from '../components/CreateFromSlotModal'
import { getHebrewDateString } from '../utils/hebrewDate'

moment.locale('he')
moment.updateLocale('he', { week: { dow: 0, doy: 6 } })

const localizer = momentLocalizer(moment)

const messages = {
  today: 'היום',
  previous: 'הקודם',
  next: 'הבא',
  month: 'חודש',
  week: 'שבוע',
  day: 'יום',
  agenda: 'רשימה',
  date: 'תאריך',
  time: 'שעה',
  event: 'אירוע',
  noEventsInRange: 'אין אירועים בטווח זה',
  showMore: total => `+${total} נוספים`,
}

function mapEvents(data) {
  return data.map(e => ({
    id: e.id,
    title: e.title,
    start: new Date(e.start),
    end: e.end
      ? new Date(e.end)
      : new Date(new Date(e.start).getTime() + 30 * 60 * 1000),
    resource: { type: e.type, with: e.with, lesson_id: e.lesson_id },
  }))
}

function eventPropGetter(event) {
  const isLesson = event.resource?.type === 'lesson'
  return {
    style: {
      backgroundColor: isLesson ? '#16a34a' : '#2563eb',
      borderColor: isLesson ? '#15803d' : '#1d4ed8',
      color: 'white',
      borderRadius: '4px',
      fontSize: '12px',
      padding: '2px 4px',
    },
  }
}

function HebrewMonthDateHeader({ date, label, onDrillDown }) {
  return (
    <div onClick={onDrillDown} className="text-right cursor-pointer">
      <span>{label}</span>
      <div className="text-xs text-indigo-400 opacity-80 leading-none mt-0.5">
        {getHebrewDateString(date, false)}
      </div>
    </div>
  )
}

function HebrewWeekHeader({ date, label }) {
  return (
    <div className="text-center">
      <div>{label}</div>
      <div className="text-xs text-indigo-400 opacity-80 leading-none">
        {getHebrewDateString(date, false)}
      </div>
    </div>
  )
}

// Test hook only: tags each month day cell with a stable data-testid (and its date) so UI
// tests can target slots without relying on react-big-calendar's internal markup. Clones the
// existing background cell rather than wrapping it, so no DOM/layout change — purely additive.
function DayCellWrapper({ children, value }) {
  return cloneElement(children, {
    'data-testid': 'calendar-day-cell',
    'data-date': value?.toISOString(),
  })
}

export default function CalendarPage() {
  const [events, setEvents]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [view, setView]                   = useState(Views.WEEK)
  const [date, setDate]                   = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [slotInfo, setSlotInfo]           = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const currentRange = useRef({
    start: moment().startOf('week').toDate(),
    end:   moment().endOf('week').toDate(),
  })

  const fetchEvents = useCallback((start, end) => {
    setLoading(true)
    getCalendarEvents(start, end)
      .then(data => setEvents(mapEvents(Array.isArray(data) ? data : [])))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchEvents(currentRange.current.start, currentRange.current.end)
  }, [fetchEvents])

  const handleRangeChange = useCallback((range) => {
    let start, end
    if (Array.isArray(range)) {
      start = range[0]
      end   = moment(range[range.length - 1]).endOf('day').toDate()
    } else {
      start = range.start
      end   = range.end
    }
    currentRange.current = { start, end }
    fetchEvents(start, end)
  }, [fetchEvents])

  const handleSelectSlot = useCallback((slot) => {
    setSlotInfo({ start: slot.start, end: slot.end })
    setShowCreateModal(true)
  }, [])

  const handleCreateSuccess = useCallback(() => {
    setShowCreateModal(false)
    const { start, end } = currentRange.current
    fetchEvents(start, end)
  }, [fetchEvents])

  return (
    <div data-testid="calendar-page">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">לוח שנה</h1>
          <p className="text-sm text-gray-400 mt-0.5">פגישות ושיעורים מתוזמנים</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600 inline-block shrink-0" />
            פגישות אישיות
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-600 inline-block shrink-0" />
            שיעורים קבוצתיים
          </span>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="h-0.5 bg-indigo-100 rounded overflow-hidden mb-3">
          <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}

      {/* Calendar card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4" data-testid="calendar-container">
        <div style={{ height: 'calc(100vh - 248px)', direction: 'rtl' }}>
          <Calendar
            localizer={localizer}
            events={events}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            onRangeChange={handleRangeChange}
            onSelectEvent={setSelectedEvent}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={eventPropGetter}
            messages={messages}
            rtl
            culture="he"
            views={[Views.WEEK, Views.DAY, Views.MONTH]}
            popup
            selectable
            components={{
              dateCellWrapper: DayCellWrapper,
              month: { dateHeader: HebrewMonthDateHeader },
              week:  { header: HebrewWeekHeader },
              day:   { header: HebrewWeekHeader },
            }}
          />
        </div>
      </div>

      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <CreateFromSlotModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        slotStart={slotInfo?.start}
        slotEnd={slotInfo?.end}
      />
    </div>
  )
}
