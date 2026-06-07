import { useEffect, useState, useCallback } from 'react'
import { getClassSessions, deleteClassSession } from '../api/classSessions'
import { getClassLevels } from '../api/classLevels'
import { getSchoolYears } from '../api/schoolYears'
import AddSessionModal from '../components/AddSessionModal'
import EditSessionModal from '../components/EditSessionModal'

function formatDatetime(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="divide-y divide-gray-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
            <div className="h-4 bg-gray-100 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-7 bg-gray-100 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SessionsPage() {
  const [sessions, setSessions]       = useState([])
  const [classLevels, setClassLevels] = useState([])
  const [schoolYears, setSchoolYears] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [showAdd, setShowAdd]         = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [deletingId, setDeletingId]   = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    Promise.all([
      getClassSessions(),
      getClassLevels(),
      getSchoolYears(),
    ])
      .then(([sessData, clData, syData]) => {
        const rawSessions = Array.isArray(sessData) ? sessData : sessData.results ?? []
        const rawYears    = Array.isArray(syData)   ? syData   : syData.results    ?? []
        const rawLevels = Array.isArray(clData) ? clData : clData.results ?? []
        setSessions(rawSessions)
        setClassLevels(rawLevels)
        setSchoolYears(rawYears)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const classLevelMap = Object.fromEntries(classLevels.map(cl => [cl.id, cl.name]))
  const schoolYearMap = Object.fromEntries(schoolYears.map(sy => [sy.id, sy.name]))

  const handleDelete = async (id) => {
    setDeleteError(null)
    try {
      await deleteClassSession(id)
      setDeletingId(null)
      fetchAll()
    } catch {
      setDeleteError(id)
    }
  }

  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">שיעורים</h1>
          <p className="text-sm text-gray-400 mt-0.5">ניהול שיעורים ומפגשי קבוצה</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + הוסף שיעור
        </button>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת השיעורים</p>
          <button
            onClick={fetchAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium mb-1">אין שיעורים עדיין</p>
          <p className="text-sm text-gray-400 mb-4">הוסף שיעור ראשון לתחילת המעקב</p>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + הוסף שיעור
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>נושא</span>
            <span className="w-12 text-center">כיתה</span>
            <span className="w-28 text-center">תאריך</span>
            <span className="w-24 text-center">שנת לימודים</span>
            <span className="w-24 text-center">פעולות</span>
          </div>

          <div className="divide-y divide-gray-100">
            {sorted.map(session => (
              <div key={session.id}>
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">
                  {/* Title + optional summary */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{session.title}</p>
                    {session.summary && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{session.summary}</p>
                    )}
                  </div>

                  {/* Class level */}
                  <div className="w-12 text-center">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {classLevelMap[session.class_level] ?? '—'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="w-28 text-center">
                    <span className="text-xs text-gray-500 font-mono">{formatDatetime(session.date)}</span>
                  </div>

                  {/* School year */}
                  <div className="w-24 text-center">
                    <span className="text-xs text-gray-500">{schoolYearMap[session.school_year] ?? '—'}</span>
                  </div>

                  {/* Actions */}
                  <div className="w-24 flex items-center justify-center gap-1">
                    {deletingId === session.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md transition-colors"
                        >
                          מחק
                        </button>
                        <button
                          onClick={() => { setDeletingId(null); setDeleteError(null) }}
                          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md transition-colors"
                        >
                          ביטול
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingSession(session)}
                          className="text-xs text-gray-400 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                        >
                          עריכה
                        </button>
                        <button
                          onClick={() => { setDeletingId(session.id); setDeleteError(null) }}
                          className="text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                        >
                          מחיקה
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete error for this row */}
                {deleteError === session.id && (
                  <div className="px-5 pb-3 text-xs text-red-600">
                    שגיאה במחיקה. אנא נסה שוב.
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-400">{sorted.length} שיעורים</span>
          </div>
        </div>
      )}

      <AddSessionModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => { setShowAdd(false); fetchAll() }}
      />
      <EditSessionModal
        session={editingSession}
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
        onSuccess={() => { setEditingSession(null); fetchAll() }}
      />
    </div>
  )
}
