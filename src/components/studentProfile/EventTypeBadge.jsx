const EVENT_TYPE_MAP = {
  meeting:        { label: 'פגישה',       classes: 'bg-indigo-100 text-indigo-700' },
  call:           { label: 'שיחה',        classes: 'bg-blue-100 text-blue-700' },
  teacher_report: { label: 'דיווח מורה', classes: 'bg-amber-100 text-amber-700' },
  other:          { label: 'אחר',         classes: 'bg-gray-100 text-gray-600' },
}

export default function EventTypeBadge({ type }) {
  const { label, classes } = EVENT_TYPE_MAP[type] ?? EVENT_TYPE_MAP.other
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes}`}>
      {label}
    </span>
  )
}
