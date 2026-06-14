import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createAssignment } from '../api/lessonAssignments'
import { getClassLevels } from '../api/classLevels'
import { parseApiError } from '../utils/apiError'
import { inputClass } from '../utils/formClasses'

const INITIAL_FORM = { class_level: '', class_number: '', planned_date: '' }

export default function AssignClassModal({ lessonId, isOpen, onClose, onSuccess }) {
  const [form, setForm]           = useState(INITIAL_FORM)
  const [classLevels, setClassLevels] = useState([])
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    getClassLevels()
      .then(d => setClassLevels(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => { if (isOpen) setForm(INITIAL_FORM) }, [isOpen])

  if (!isOpen) return null

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await createAssignment({
        lesson:       lessonId,
        class_level:  form.class_level,
        class_number: form.class_number ? Number(form.class_number) : null,
        planned_date: form.planned_date
          ? new Date(form.planned_date + 'T12:00:00').toISOString()
          : null,
      })
      toast.success('הכיתה שויכה בהצלחה')
      onSuccess()
    } catch (err) {
      toast.error(parseApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Blue header matching screenshot */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 rounded-t-2xl">
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors text-lg leading-none">✕</button>
          <h2 className="text-base font-semibold text-white">שייך שיעור לכיתה 🏫</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
              בחר כיתה <span className="text-red-400">*</span>
            </label>
            <select
              name="class_level"
              value={form.class_level}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">בחירה...</option>
              {classLevels.map(cl => (
                <option key={cl.id} value={cl.id}>{cl.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">מספר כיתה</label>
            <input
              type="number"
              name="class_number"
              value={form.class_number}
              onChange={handleChange}
              min={1}
              placeholder="לדוגמה: 1"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">תאריך מתוכנן להעברה</label>
            <input
              type="date"
              name="planned_date"
              value={form.planned_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />שומר...</>
              ) : 'שייך לכיתה'}
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
