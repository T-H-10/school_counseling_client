import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import { getHebrewDateString, getTodayHoliday } from '../utils/hebrewDate'

const EVENT_TYPE_LABELS = {
  meeting: 'פגישה',
  call: 'שיחה',
  teacher_report: 'דיווח מורה',
  other: 'אחר',
}

const EVENT_TYPE_COLORS = {
  meeting: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  call: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  teacher_report: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date) {
  const d = new Date(date)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function StatCard({ label, value, colorClass, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
    </div>
  )
}

function AlertCard({ colorKey, icon, title, children }) {
  const styles = {
    blue:   { wrap: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',     title: 'text-blue-800 dark:text-blue-300',  body: 'text-blue-700 dark:text-blue-400' },
    orange: { wrap: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800', title: 'text-amber-800 dark:text-amber-300', body: 'text-amber-700 dark:text-amber-400' },
    red:    { wrap: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',         title: 'text-red-800 dark:text-red-300',     body: 'text-red-700 dark:text-red-400' },
  }
  const s = styles[colorKey]
  return (
    <div className={`border rounded-xl px-5 py-4 flex items-start gap-3 ${s.wrap}`}>
      <span className="text-lg mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${s.title}`}>{title}</p>
        {children && <div className={`text-sm mt-1.5 ${s.body}`}>{children}</div>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-56 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-base">שגיאה בטעינת נתוני לוח הבקרה. אנא רענן את הדף.</p>
      </div>
    )
  }

  const { today_sessions, tomorrow_sessions, recent_events, stats, alerts } = data
  const { upcoming_today, missing_summaries, at_risk_students } = alerts ?? {}
  const hebrewDate = getHebrewDateString()
  const holiday    = getTodayHoliday()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const hebrewTomorrow    = getHebrewDateString(tomorrow)
  const todayFormatted    = formatDate(new Date())
  const tomorrowFormatted = formatDate(tomorrow)

  const hasAlerts = missing_summaries?.length > 0 || at_risk_students?.count > 0

  const todayCombined = [
    ...(today_sessions ?? []).map(s => ({ ...s, itemType: 'session' })),
    ...(upcoming_today ?? []).map(e => ({ ...e, itemType: 'meeting' })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">לוח בקרה</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <span className="text-gray-300 dark:text-gray-600 text-sm">·</span>
          <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">{hebrewDate}</p>
          {holiday && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
              ✡ {holiday}
            </span>
          )}
        </div>
      </div>

      {/* Smart Alerts */}
      {hasAlerts && (
        <div className="space-y-3 mb-5">
          {missing_summaries?.length > 0 && (
            <AlertCard colorKey="orange" icon="✏️" title={`${missing_summaries.length} פגישות עבר ללא סיכום`}>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {missing_summaries.slice(0, 3).map(e => (
                  <Link key={e.id} to={`/students/${e.student_id}`} className="hover:underline">
                    {e.student_name}
                  </Link>
                ))}
                {missing_summaries.length > 3 && <span>ועוד {missing_summaries.length - 3}</span>}
              </div>
            </AlertCard>
          )}

          {at_risk_students?.count > 0 && (
            <AlertCard colorKey="red" icon="⚠️" title={`${at_risk_students.count} תלמידים ללא מגע מעל 90 יום`}>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {at_risk_students.students.slice(0, 3).map(s => (
                  <Link key={s.id} to={`/students/${s.id}`} className="hover:underline">
                    {s.full_name}
                  </Link>
                ))}
                {at_risk_students.count > 3 && <span>ועוד {at_risk_students.count - 3}</span>}
              </div>
            </AlertCard>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="שיעורים היום"    value={today_sessions.length}    icon="📚" colorClass="bg-blue-50 dark:bg-blue-950" />
        <StatCard label="שיעורים למחר"    value={tomorrow_sessions.length} icon="📅" colorClass="bg-indigo-50 dark:bg-indigo-950" />
        <StatCard label="תלמידים פעילים"  value={stats.students_count}     icon="👥" colorClass="bg-green-50 dark:bg-green-950" />
        <StatCard label="אירועים השבוע"   value={stats.events_this_week}   icon="📋" colorClass="bg-purple-50 dark:bg-purple-950" />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming events — today + tomorrow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
            אירועים קרובים
          </h2>

          <div className="flex items-center gap-1.5 text-xs mb-2">
            <span className="font-semibold text-gray-500 dark:text-gray-400">היום</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-gray-400 dark:text-gray-500">{todayFormatted}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-gray-400 dark:text-gray-500">{hebrewDate}</span>
          </div>
          {todayCombined.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">אין אירועים מתוכננים להיום</p>
          ) : (
            <ul className="space-y-2.5 mb-4">
              {todayCombined.map(item => (
                <li key={`${item.itemType}-${item.id}`} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-12 shrink-0">
                    {formatTime(item.date)}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.itemType === 'session' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  {item.itemType === 'meeting' ? (
                    <Link
                      to={`/students/${item.student_id}`}
                      className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                    >
                      {item.student_name}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {tomorrow_sessions.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 text-xs mb-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-500 dark:text-gray-400">מחר</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-gray-400 dark:text-gray-500">{tomorrowFormatted}</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-gray-400 dark:text-gray-500">{hebrewTomorrow}</span>
              </div>
              <ul className="space-y-2.5">
                {tomorrow_sessions.map(session => (
                  <li key={session.id} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-12 shrink-0">
                      {formatTime(session.date)}
                    </span>
                    <span className="w-2 h-2 rounded-full shrink-0 bg-green-300 dark:bg-green-700" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{session.title}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Recent events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">אירועים אחרונים</h2>
            <Link to="/calendar" className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">הצג הכל</Link>
          </div>
          {recent_events.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">אין אירועים השבוע</p>
          ) : (
            <ul className="space-y-3">
              {recent_events.map(event => (
                <li key={event.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      to={`/students/${event.student_id}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {event.student_name}
                    </Link>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        EVENT_TYPE_COLORS[event.event_type] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 shrink-0 text-end leading-tight">
                    <div>{formatDate(event.date)}</div>
                    <div>{getHebrewDateString(new Date(event.date), false)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
