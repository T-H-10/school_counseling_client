import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { completeAssignment, updateAssignment } from '../api/lessonAssignments'
import { parseApiError } from '../utils/apiError'
import { inputClass } from '../utils/formClasses'

export default function CompleteAssignmentModal({ assignment, isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({ completed_date: '', summary: '' })
  const [saving, setSaving] = useState(false)

  const isEdit = assignment?.status === 'completed'

  useEffect(() => {
    if (isOpen && assignment) {
      const existing = assignment.completed_date
        ? new Date(assignment.completed_date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
      setForm({
        completed_date: existing,
        summary:        assignment.summary ?? '',
      })
    }
  }, [isOpen, assignment])

  if (!isOpen || !assignment) return null

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        completed_date: new Date(form.completed_date + 'T12:00:00').toISOString(),
        summary:        form.summary || null,
      }
      if (isEdit) {
        await updateAssignment(assignment.id, payload)
      } else {
        await completeAssignment(assignment.id, payload)
      }
      toast.success(isEdit ? 'הסיכום עודכן' : 'השיעור סומן כהושלם')
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {isEdit ? 'עריכת סיכום' : 'סמן כהושלם + סיכום'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              תאריך ביצוע <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="completed_date"
              value={form.completed_date}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סיכום השיעור</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={5}
              placeholder="כתוב סיכום השיעור כאן..."
              className={`${inputClass} resize-none leading-relaxed`}
              dir="rtl"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />שומר...</>
              ) : isEdit ? 'עדכן' : 'שמור'}
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
