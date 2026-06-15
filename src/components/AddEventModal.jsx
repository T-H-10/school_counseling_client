import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createStudentEvent } from '../api/studentProfile'
import { EVENT_TYPE_OPTIONS } from '../constants/eventTypes'
import { parseApiError } from '../utils/apiError'
import { toDatetimeLocal } from '../utils/datetime'
import { inputClass } from '../utils/formClasses'

const INITIAL_FORM = { event_type: 'meeting', date: '', title: '', agenda: '', description: '' }

export default function AddEventModal({ studentId, isOpen, onClose, onSuccess }) {
  const [form, setForm]     = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm({ ...INITIAL_FORM, date: toDatetimeLocal(new Date()) })
    }
  }, [isOpen])

  if (!isOpen) return null

  const isFuture = form.date ? new Date(form.date) > new Date() : false

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createStudentEvent({
        student:     studentId,
        event_type:  form.event_type,
        title:       form.title,
        agenda:      form.agenda || null,
        description: form.description || null,
        date:        new Date(form.date).toISOString(),
      })
      toast.success('הפגישה נשמרה בהצלחה')
      onSuccess()
    } catch (err) {
      toast.error(parseApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-testid="add-event-modal"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">הוספת פגישה</h2>
          <button
            onClick={onClose}
            data-testid="add-event-close"
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Event type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סוג אירוע <span className="text-red-400">*</span>
            </label>
            <select
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
              data-testid="add-event-type"
              className={inputClass}
              required
            >
              {EVENT_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Date & time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תאריך ושעה <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              data-testid="add-event-date"
              className={inputClass}
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              נושא <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="נושא הפגישה"
              data-testid="add-event-title"
              className={inputClass}
              maxLength={200}
              required
            />
          </div>

          {/* Agenda (future) or Description (past/today) — switches as the user changes the date */}
          {isFuture ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מטרת הפגישה
                <span className="mr-1 text-xs font-normal text-indigo-500">(פגישה עתידית)</span>
              </label>
              <textarea
                name="agenda"
                value={form.agenda}
                onChange={handleChange}
                rows={4}
                placeholder="מה מתוכנן לדיון בפגישה?"
                data-testid="add-event-agenda"
                className={`${inputClass} resize-none leading-relaxed`}
                dir="rtl"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סיכום הפגישה
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="כתוב סיכום הפגישה כאן..."
                data-testid="add-event-summary"
                className={`${inputClass} resize-none leading-relaxed`}
                dir="rtl"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              data-testid="add-event-submit"
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  שומר...
                </>
              ) : (
                'שמור אירוע'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              data-testid="add-event-cancel"
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
