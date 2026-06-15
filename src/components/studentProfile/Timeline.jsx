import EventTypeBadge from './EventTypeBadge'
import { getHebrewDateString } from '../../utils/hebrewDate'

export default function Timeline({ timeline, onEdit }) {
  return (
    <>
      {/* Timeline */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">היסטוריית מפגשים</h2>

      {timeline.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center" data-testid="timeline-empty">
          <p className="text-gray-400 text-sm">אין פגישות רשומות עדיין</p>
        </div>
      ) : (
        <div className="relative pr-10" data-testid="timeline">
          {/* Vertical line on the physical right (RTL start side) */}
          <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          {timeline.map(item => (
            <div key={item.id} className="relative mb-5" data-testid="timeline-event" data-event-id={item.id}>
              {/* Dot centered on the line */}
              <div className="absolute right-2.5 top-4 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <EventTypeBadge type={item.event_type} />
                    <div className="text-xs text-gray-400 font-mono leading-tight">
                      <div>{item.display_date}</div>
                      {item.date && (
                        <div className="text-indigo-400 opacity-80">{getHebrewDateString(new Date(item.date), true)}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onEdit(item)}
                    data-testid="timeline-event-edit"
                    className="text-xs text-gray-400 hover:text-indigo-600 transition-colors px-2 py-0.5 rounded hover:bg-indigo-50"
                  >
                    עריכה
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-800" data-testid="timeline-event-title">{item.title}</p>
                {item.agenda && (
                  <p className="text-sm text-indigo-600 mt-1 leading-relaxed">
                    <span className="font-medium text-indigo-400 text-xs">מטרה: </span>
                    {item.agenda}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {item.agenda && (
                      <span className="font-medium text-gray-400 text-xs">סיכום: </span>
                    )}
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
