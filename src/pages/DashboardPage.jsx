import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getDashboard } from '../api/dashboard'
import { updateStudentEvent } from '../api/studentProfile'
import { getHebrewDateString, getTodayHoliday } from '../utils/hebrewDate'
import StatCard from '../components/dashboard/StatCard'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton'
import UrgentTasksCard from '../components/dashboard/UrgentTasksCard'
import ActivityFeedCard from '../components/dashboard/ActivityFeedCard'
import TodayMeetingsCard from '../components/dashboard/TodayMeetingsCard'
import FollowUpsCard from '../components/dashboard/FollowUpsCard'

export default function DashboardPage() {
  const [data, setData]                 = useState(null)
  const [todayMeetings, setTodayMeetings] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    getDashboard()
      .then(result => {
        setData(result)
        setTodayMeetings(result.alerts?.upcoming_today ?? [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  async function toggleStatus(item) {
    const next = item.status === 'completed' ? 'pending' : 'completed'
    setTodayMeetings(prev => prev.map(m => m.id === item.id ? { ...m, status: next } : m))
    try {
      await updateStudentEvent(item.id, { status: next })
    } catch {
      setTodayMeetings(prev => prev.map(m => m.id === item.id ? { ...m, status: item.status } : m))
      toast.error('שגיאה בעדכון הסטטוס')
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-base">שגיאה בטעינת נתוני לוח הבקרה. אנא רענן את הדף.</p>
      </div>
    )
  }

  const { recent_events, stats, alerts, today_lessons } = data
  const { missing_summaries, at_risk_students, upcoming_future } = alerts ?? {}
  const todayLessons = today_lessons ?? []
  const hebrewDate = getHebrewDateString()
  const holiday    = getTodayHoliday()

  const urgentCount = (missing_summaries?.length ?? 0) + (at_risk_students?.count ?? 0)

  return (
    <div data-testid="dashboard-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">עמוד הבית</h1>
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

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="תלמידות פעילות"    value={stats.students_count}        icon="👥" colorClass="bg-green-50 dark:bg-green-950" />
        <StatCard label="פגישות היום"       value={todayMeetings.length}        icon="📅" colorClass="bg-blue-50 dark:bg-blue-950" />
        <StatCard label="שיעורים היום"      value={todayLessons.length}        icon="📚" colorClass="bg-indigo-50 dark:bg-indigo-950" />
        <StatCard label="דורש טיפול עכשיו" value={urgentCount} urgent />
      </div>

      {/* Asymmetric main grid — Alerts DOM-first → col-1 RIGHT in RTL (3fr wide) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

        {/* Alerts + feed — mobile: top; desktop: col 1 (RIGHT in RTL, 3fr wide) */}
        <div className="space-y-4">
          <UrgentTasksCard
            urgentCount={urgentCount}
            missingSummaries={missing_summaries}
            atRiskStudents={at_risk_students}
          />
          <ActivityFeedCard recentEvents={recent_events} eventsThisWeek={stats.events_this_week} />
        </div>

        {/* Schedule — mobile: below; desktop: col 2 (LEFT in RTL, 2fr narrow) */}
        <div className="space-y-4">
          <TodayMeetingsCard meetings={todayMeetings} onToggleStatus={toggleStatus} />
          <FollowUpsCard items={upcoming_future} />
        </div>
      </div>
    </div>
  )
}
