import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getLessons, deleteLesson } from '../api/lessons'
import LessonCard from '../components/sessions/LessonCard'
import SkeletonTable from '../components/sessions/SkeletonTable'
import EmptyState from '../components/sessions/EmptyState'
import AddLessonModal from '../components/AddLessonModal'
import EditLessonModal from '../components/EditLessonModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function SessionsPage() {
  const [lessons, setLessons]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(false)
  const [showAdd, setShowAdd]           = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [deletingId, setDeletingId]     = useState(null)
  const [confirming, setConfirming]     = useState(false)

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    getLessons()
      .then(d => setLessons(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleDelete = async () => {
    if (!deletingId) return
    setConfirming(true)
    try {
      await deleteLesson(deletingId)
      toast.success('מערך השיעור נמחק')
      setDeletingId(null)
      fetchAll()
    } catch {
      toast.error('שגיאה במחיקה. נסה שוב.')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">מערכי שיעור</h1>
          <p className="text-sm text-gray-400 mt-0.5">ניהול מערכי שיעור ושיוך לכיתות</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + שיעור חדש
        </button>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת מערכי השיעור</p>
          <button onClick={fetchAll} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
            נסה שוב
          </button>
        </div>
      ) : lessons.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onEdit={setEditingLesson}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}

      <AddLessonModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => { setShowAdd(false); fetchAll() }}
      />

      <EditLessonModal
        lesson={editingLesson}
        isOpen={!!editingLesson}
        onClose={() => setEditingLesson(null)}
        onSuccess={() => { setEditingLesson(null); fetchAll() }}
      />
      <ConfirmDeleteModal
        isOpen={!!deletingId}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        confirming={confirming}
        message="פעולה זו תמחק את מערך השיעור ואת כל השיוכים שלו לכיתות."
      />
    </div>
  )
}
