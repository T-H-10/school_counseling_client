import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { updateStudentEvent } from '../api/studentProfile'

const EVENT_TYPE_OPTIONS = [
  { value: 'meeting',        label: 'פגישה' },
  { value: 'call',           label: 'שיחה' },
  { value: 'teacher_report', label: 'דיווח מורה' },
  { value: 'other',          label: 'אחר' },
]

function toLocalDatetime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function parseApiError(err) {
  const data = err?.response?.data
  if (!data) return 'שגיאה בשמירה, אנא נסה שוב'
  if (typeof data === 'string') return data
  const first = Object.values(data)[0]
  if (Array.isArray(first)) return first[0]
  if (typeof first === 'string') return first
  return 'שגיאה בשמירה, אנא נסה שוב'
}

const inputClass =
  'w-full border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white'

export default function EditEventModal({ event, isOpen, onClose, onSuccess }) {
  const [form, setForm]     = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen && event) {
      setForm({
        event_type:  event.event_type,
        date:        toLocalDatetime(event.date),
        title:       event.title,
        agenda:      event.agenda ?? '',
        description: event.description ?? '',
      })
    }
  }, [isOpen, event])

  if (!isOpen || !form) return null

  const isFuture = form.date ? new Date(form.date) > new Date() : false

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateStudentEvent(event.id, {
        event_type:  form.event_type,
        title:       form.title,
        agenda:      form.agenda || null,
        description: form.description || null,
        date:        new Date(form.date).toISOString(),
      })
      toast.success('הפגישה עודכנה בהצלחה')
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
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">עריכת פגישה</h2>
          <button
            onClick={onClose}
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
              className={inputClass}
              maxLength={200}
              required
            />
          </div>

          {/* Future: agenda only. Past/today: show existing agenda (read-only hint) + summary */}
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
                className={`${inputClass} resize-none leading-relaxed`}
                dir="rtl"
              />
            </div>
          ) : (
            <>
              {/* Show the original agenda as context if it exists */}
              {form.agenda !== '' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מטרת הפגישה
                    <span className="mr-1 text-xs font-normal text-gray-400">(אג׳נדה שנקבעה)</span>
                  </label>
                  <textarea
                    name="agenda"
                    value={form.agenda}
                    onChange={handleChange}
                    rows={2}
                    className={`${inputClass} resize-none leading-relaxed bg-gray-50`}
                    dir="rtl"
                  />
                </div>
              )}
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
                  className={`${inputClass} resize-none leading-relaxed`}
                  dir="rtl"
                />
              </div>
            </>
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
                'שמור שינויים'
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
