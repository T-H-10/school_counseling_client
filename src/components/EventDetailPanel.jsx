import { useNavigate } from 'react-router-dom'
import { getHebrewDateString } from '../utils/hebrewDate'

function formatDatetime(date) {
  if (!date) return '—'
  const d = new Date(date)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventDetailPanel({ event, onClose }) {
  const navigate   = useNavigate()
  const isLesson  = event.resource?.type === 'lesson'
  const typeLabel = isLesson ? 'שיעור קבוצתי' : 'פגישה אישית'
  const typeColor = isLesson
    ? 'bg-green-100 text-green-700'
    : 'bg-blue-100 text-blue-700'
  const withLabel = isLesson ? 'כיתה' : 'תלמיד/ה'

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-testid="event-detail-panel"
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor}`}>
            {typeLabel}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <h3 className="text-base font-semibold text-gray-800" data-testid="event-detail-title">{event.title}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16 shrink-0">{withLabel}:</span>
              <span className="font-medium text-gray-700">
                {event.resource?.with ?? '—'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-16 shrink-0 pt-0.5">התחלה:</span>
              <div className="leading-tight">
                <div className="font-mono text-gray-700 text-xs">{formatDatetime(event.start)}</div>
                {event.start && <div className="text-xs text-indigo-400 opacity-80">{getHebrewDateString(new Date(event.start), true)}</div>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-16 shrink-0 pt-0.5">סיום:</span>
              <div className="leading-tight">
                <div className="font-mono text-gray-700 text-xs">{formatDatetime(event.end)}</div>
                {event.end && <div className="text-xs text-indigo-400 opacity-80">{getHebrewDateString(new Date(event.end), true)}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-2">
          {isLesson && event.resource?.lesson_id && (
            <button
              onClick={() => { onClose(); navigate(`/lessons/${event.resource.lesson_id}`) }}
              data-testid="event-detail-goto-lesson"
              className="w-full text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors font-medium"
            >
              עבור לדף השיעור ←
            </button>
          )}
          <button
            onClick={onClose}
            data-testid="event-detail-close"
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  )
}
