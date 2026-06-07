function formatDatetime(date) {
  if (!date) return '—'
  const d = new Date(date)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventDetailPanel({ event, onClose }) {
  const isSession = event.resource?.type === 'class_session'
  const typeLabel = isSession ? 'שיעור קבוצתי' : 'פגישה אישית'
  const typeColor = isSession
    ? 'bg-green-100 text-green-700'
    : 'bg-blue-100 text-blue-700'
  const withLabel = isSession ? 'כיתה' : 'תלמיד/ה'

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
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
          <h3 className="text-base font-semibold text-gray-800">{event.title}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16 shrink-0">{withLabel}:</span>
              <span className="font-medium text-gray-700">
                {event.resource?.with ?? '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16 shrink-0">התחלה:</span>
              <span className="font-mono text-gray-700 text-xs">
                {formatDatetime(event.start)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16 shrink-0">סיום:</span>
              <span className="font-mono text-gray-700 text-xs">
                {formatDatetime(event.end)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  )
}
