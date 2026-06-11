import { useEffect, useState, useCallback } from 'react'
import { getClassSessions, deleteClassSession } from '../api/classSessions'
import { getClassLevels } from '../api/classLevels'
import { getSchoolYears } from '../api/schoolYears'
import AddSessionModal from '../components/AddSessionModal'
import EditSessionModal from '../components/EditSessionModal'
import SkeletonTable from '../components/sessions/SkeletonTable'
import EmptyState from '../components/sessions/EmptyState'
import SessionsTable from '../components/sessions/SessionsTable'

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
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <SessionsTable
          sessions={sorted}
          classLevelMap={classLevelMap}
          schoolYearMap={schoolYearMap}
          deletingId={deletingId}
          deleteError={deleteError}
          onEdit={setEditingSession}
          onConfirmDelete={handleDelete}
          onStartDelete={(id) => { setDeletingId(id); setDeleteError(null) }}
          onCancelDelete={() => { setDeletingId(null); setDeleteError(null) }}
        />
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
