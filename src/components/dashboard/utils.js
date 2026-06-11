export const EVENT_TYPE_ICONS = {
  meeting: '📅',
  call: '📞',
  teacher_report: '📋',
  other: '📌',
}

export const EVENT_TYPE_LABELS = {
  meeting: 'פגישה',
  call: 'שיחה',
  teacher_report: 'דיווח מורה',
  other: 'אחר',
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

export function relativeDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const time = formatTime(dateStr)
  const dayDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (dayDiff === 0) return `היום, ${time}`
  if (dayDiff === 1) return `אתמול, ${time}`
  return `לפני ${dayDiff} ימים, ${time}`
}

export function futureDateBadge(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const eventDay = new Date(dateStr); eventDay.setHours(0, 0, 0, 0)
  const dayDiff = Math.round((eventDay - today) / (1000 * 60 * 60 * 24))
  if (dayDiff === 1) return { label: 'מחר', cls: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' }
  if (dayDiff <= 3) return { label: `בעוד ${dayDiff} ימים`, cls: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' }
  const d = new Date(dateStr)
  return { label: `${d.getDate()}/${d.getMonth() + 1}`, cls: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' }
}
