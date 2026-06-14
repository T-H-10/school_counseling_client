import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createStudentEvent } from '../api/studentProfile'
import { createLesson } from '../api/lessons'
import { createAssignment } from '../api/lessonAssignments'
import { getClassLevels } from '../api/classLevels'
import { getSchoolYears } from '../api/schoolYears'
import { parseApiError } from '../utils/apiError'
import { toDatetimeLocal } from '../utils/datetime'
import { inputClass } from '../utils/formClasses'
import EventFields from './createFromSlot/EventFields'
import LessonFields from './createFromSlot/LessonFields'

export default function CreateFromSlotModal({ isOpen, onClose, onSuccess, slotStart, slotEnd }) {
  const [mode, setMode]           = useState('event')
  const [student, setStudent]     = useState(null)
  const [eventType, setEventType] = useState('meeting')
  const [title, setTitle]         = useState('')
  const [startDt, setStartDt]     = useState('')
  const [endDt, setEndDt]         = useState('')
  const [classLevels, setClassLevels] = useState([])
  const [schoolYears, setSchoolYears] = useState([])
  const [classLevel, setClassLevel]   = useState('')
  const [classNumber, setClassNumber] = useState('')
  const [schoolYear, setSchoolYear]   = useState('')
  const [saving, setSaving]           = useState(false)
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    getClassLevels().then(d => setClassLevels(Array.isArray(d) ? d : d.results ?? [])).catch(() => {})
    getSchoolYears().then(d => setSchoolYears(Array.isArray(d) ? d : d.results ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (isOpen && slotStart) {
      const defaultEnd = slotEnd
        ? slotEnd
        : new Date(new Date(slotStart).getTime() + 30 * 60 * 1000)
      setStartDt(toDatetimeLocal(slotStart))
      setEndDt(toDatetimeLocal(defaultEnd))
      setMode('event')
      setStudent(null)
      setEventType('meeting')
      setTitle('')
      setClassLevel('')
      setClassNumber('')
      setSchoolYear('')
      setValidationError(null)
    }
  }, [isOpen, slotStart, slotEnd])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'event' && !student) {
      setValidationError('יש לבחור תלמיד')
      return
    }
    setValidationError(null)
    setSaving(true)
    try {
      if (mode === 'event') {
        await createStudentEvent({
          student:    student.value,
          event_type: eventType,
          title,
          date:       new Date(startDt).toISOString(),
        })
        toast.success('הפגישה נשמרה בהצלחה')
      } else {
        const lesson = await createLesson({ title, school_year: schoolYear })
        await createAssignment({
          lesson:       lesson.id,
          class_level:  classLevel,
          class_number: classNumber ? Number(classNumber) : null,
          planned_date: new Date(startDt).toISOString(),
        })
        toast.success('מערך השיעור נשמר בהצלחה')
      }
      onSuccess()
    } catch (err) {
      toast.error(parseApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const activeYears = schoolYears.filter(y => y.is_active)
  const otherYears  = schoolYears.filter(y => !y.is_active)

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-800">יצירת אירוע חדש</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-6 pt-5">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode('event')}
              className={`flex-1 py-2 transition-colors ${
                mode === 'event'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              פגישה עם תלמיד
            </button>
            <button
              type="button"
              onClick={() => setMode('lesson')}
              className={`flex-1 py-2 transition-colors border-r border-gray-200 ${
                mode === 'lesson'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              שיעור כיתתי
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              נושא <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={mode === 'event' ? 'נושא הפגישה' : 'נושא השיעור'}
              className={inputClass}
              maxLength={200}
              required
            />
          </div>

          {/* Student picker — event mode only */}
          {mode === 'event' && (
            <EventFields
              student={student}
              setStudent={setStudent}
              eventType={eventType}
              setEventType={setEventType}
            />
          )}

          {/* School year + class level — lesson mode only */}
          {mode === 'lesson' && (
            <LessonFields
              schoolYear={schoolYear}
              setSchoolYear={setSchoolYear}
              classLevel={classLevel}
              setClassLevel={setClassLevel}
              classNumber={classNumber}
              setClassNumber={setClassNumber}
              activeYears={activeYears}
              otherYears={otherYears}
              classLevels={classLevels}
            />
          )}

          {/* Start + End datetime */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תאריך ושעת התחלה <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={startDt}
                onChange={e => setStartDt(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שעת סיום
              </label>
              <input
                type="datetime-local"
                value={endDt}
                onChange={e => setEndDt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Validation error (student not selected) */}
          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {validationError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  שומר...
                </>
              ) : (
                'שמור'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
