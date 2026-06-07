import { useState, useEffect } from 'react'
import { createClassSession } from '../api/classSessions'
import { getClassLevels } from '../api/classLevels'
import { getSchoolYears } from '../api/schoolYears'

function nowLocalDatetime() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const INITIAL_FORM = {
  title: '',
  school_year: '',
  class_level: '',
  date: '',
  end_date: '',
  summary: '',
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

export default function AddSessionModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm]             = useState(INITIAL_FORM)
  const [classLevels, setClassLevels] = useState([])
  const [schoolYears, setSchoolYears] = useState([])
  const [saving, setSaving]         = useState(false)
  const [apiError, setApiError]     = useState(null)

  useEffect(() => {
    getClassLevels().then(data => {
      setClassLevels(Array.isArray(data) ? data : data.results ?? [])
    }).catch(() => {})
    getSchoolYears().then(data => {
      const years = Array.isArray(data) ? data : data.results ?? []
      setSchoolYears(years)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (isOpen) {
      setForm({ ...INITIAL_FORM, date: nowLocalDatetime() })
      setApiError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setApiError(null)
    try {
      await createClassSession({
        title:       form.title,
        school_year: form.school_year,
        class_level: form.class_level,
        date:        new Date(form.date).toISOString(),
        end_date:    form.end_date ? new Date(form.end_date).toISOString() : null,
        summary:     form.summary || null,
      })
      onSuccess()
    } catch (err) {
      setApiError(parseApiError(err))
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
          <h2 className="text-base font-semibold text-gray-800">הוספת שיעור</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              נושא השיעור <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="נושא השיעור"
              className={inputClass}
              maxLength={200}
              required
            />
          </div>

          {/* School Year + Class Level side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שנת לימודים <span className="text-red-400">*</span>
              </label>
              <select
                name="school_year"
                value={form.school_year}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">בחר שנה</option>
                {activeYears.map(y => (
                  <option key={y.id} value={y.id}>{y.name} (פעיל)</option>
                ))}
                {otherYears.map(y => (
                  <option key={y.id} value={y.id}>{y.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כיתה <span className="text-red-400">*</span>
              </label>
              <select
                name="class_level"
                value={form.class_level}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">בחר כיתה</option>
                {classLevels.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + End Date side by side */}
          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שעת סיום
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סיכום השיעור
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={4}
              placeholder="כתוב סיכום השיעור כאן..."
              className={`${inputClass} resize-none leading-relaxed`}
              dir="rtl"
            />
          </div>

          {/* Error banner */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {apiError}
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
                'שמור שיעור'
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
