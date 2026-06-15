import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getLesson } from '../api/lessons'
import { deleteAssignment } from '../api/lessonAssignments'
import AssignmentCard from '../components/lessons/AssignmentCard'
import EditLessonModal from '../components/EditLessonModal'
import AssignClassModal from '../components/AssignClassModal'
import CompleteAssignmentModal from '../components/CompleteAssignmentModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function LessonDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [lesson, setLesson]               = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(false)
  const [showEdit, setShowEdit]           = useState(false)
  const [showAssign, setShowAssign]       = useState(false)
  const [completingAssignment, setCompletingAssignment] = useState(null)
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null)
  const [confirmingDelete, setConfirmingDelete]         = useState(false)

  const fetchLesson = useCallback(() => {
    setLoading(true)
    setError(false)
    getLesson(id)
      .then(setLesson)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { fetchLesson() }, [fetchLesson])

  const handleDeleteAssignment = async () => {
    if (!deletingAssignmentId) return
    setConfirmingDelete(true)
    try {
      await deleteAssignment(deletingAssignmentId)
      toast.success('השיוך נמחק')
      setDeletingAssignmentId(null)
      fetchLesson()
    } catch {
      toast.error('שגיאה במחיקה')
    } finally {
      setConfirmingDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 animate-pulse">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4 mr-auto" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-red-500 text-sm mb-4">שגיאה בטעינת מערך השיעור</p>
        <button onClick={fetchLesson} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">נסה שוב</button>
      </div>
    )
  }

  const assignments = [...(lesson.assignments ?? [])].sort((a, b) => {
    const lvA = a.class_level_name ?? ''
    const lvB = b.class_level_name ?? ''
    if (lvA !== lvB) return lvA.localeCompare(lvB, 'he')
    return (a.class_number ?? Infinity) - (b.class_number ?? Infinity)
  })

  return (
    <div data-testid="lesson-detail-page">
      <button
        onClick={() => navigate('/lessons')}
        data-testid="lesson-detail-back"
        className="mb-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <span>→</span>
        <span>חזרה לשיעורים</span>
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">

        {/* Title + edit icon — RTL: h1 first → RIGHT, button last → LEFT */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1" data-testid="lesson-detail-title">{lesson.title}</h1>
          <button
            onClick={() => setShowEdit(true)}
            data-testid="lesson-detail-edit"
            className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
            aria-label="עריכה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>

        {/* Action buttons — justify-start = RIGHT in RTL */}
        <div className="flex items-center gap-3 mb-5 justify-start flex-wrap">
          <button
            onClick={() => setShowAssign(true)}
            data-testid="lesson-detail-assign"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            🏫 שייך לכיתה נוספת
          </button>
          {lesson.presentation_url && (
            <a
              href={lesson.presentation_url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="lesson-detail-presentation"
              className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              🔗 פתח מצגת Drive
            </a>
          )}
        </div>

        {/* Description */}
        {lesson.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-right mb-6">
            {lesson.description}
          </p>
        )}

        {/* Assignments section */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 text-right mb-4">
            סטטוס העברת השיעור בכיתות
          </h2>

          {assignments.length === 0 ? (
            <p className="text-sm text-gray-400 text-right">לא שויכו כיתות עדיין. לחץ על "שייך לכיתה נוספת" להתחלה.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignments.map(a => (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  onComplete={() => setCompletingAssignment(a)}
                  onEditSummary={() => setCompletingAssignment(a)}
                  onDelete={() => setDeletingAssignmentId(a.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditLessonModal
        lesson={lesson}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSuccess={() => { setShowEdit(false); fetchLesson() }}
      />
      <AssignClassModal
        lessonId={lesson.id}
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        onSuccess={() => { setShowAssign(false); fetchLesson() }}
      />
      <CompleteAssignmentModal
        assignment={completingAssignment}
        isOpen={!!completingAssignment}
        onClose={() => setCompletingAssignment(null)}
        onSuccess={() => { setCompletingAssignment(null); fetchLesson() }}
      />
      <ConfirmDeleteModal
        isOpen={!!deletingAssignmentId}
        onConfirm={handleDeleteAssignment}
        onCancel={() => setDeletingAssignmentId(null)}
        confirming={confirmingDelete}
        message="פעולה זו תמחק את שיוך הכיתה לשיעור."
      />
    </div>
  )
}
